import { Tag } from '@aws-sdk/client-s3';
import { DaxtraConfig } from '@pulsifi/configs';
import { generatorUtil, logger } from '@pulsifi/fn';
import { ConvertPdfPayload, Resume, UploadOutput } from '@pulsifi/interfaces';
import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import FormData from 'form-data';
import * as jwt from 'jsonwebtoken';
import { Stream } from 'stream';

import { AxiosHeaderBuilder } from '../builders';
import { CustomError, ErrorType } from '../CustomError';
import { DaxtraErrorCode, DaxtraStatus } from '../enum/daxtra.enum';
import { TagKey } from '../enum/s3-tag.enum';
import { s3TagUtil } from '../utils/s3-tag.util';

const SERVICE_NAME = 'DaxtraService';
const APPLICATION_FORM_CONTENT_TYPE = 'application/form';
const JWT_EXPIRED_IN_SECONDS = 86400; // seconds - 1 day

const MAX_WAIT_TIME_FOR_DAXTRA_RESULT = DaxtraConfig.timed_out * 1000 || 50000; // ms

let serviceTime: Date, timeTaken: number;

axios.interceptors.request.use((request) => {
    serviceTime = new Date();
    logger.trace(
        `API Request Start Time: ${JSON.stringify(serviceTime, null, 2)}`,
        { context: SERVICE_NAME, url: request.url },
    );
    return request;
});

axios.interceptors.response.use((response) => {
    timeTaken = (new Date().getTime() - serviceTime.getTime()) / 1000;
    logger.trace(
        `API Request End Time: ${JSON.stringify(new Date(), null, 2)}`,
        { context: SERVICE_NAME, url: response.config.url },
    );
    return response;
});

function handleError(e: SafeAny, postUrl: string, output?: UploadOutput) {
    if (e.code === 'ECONNABORTED') {
        logger.error(
            `Exceeded max wait time (${MAX_WAIT_TIME_FOR_DAXTRA_RESULT}) for daxtra result `,
            {
                context: SERVICE_NAME,
                url: postUrl,
                output,
                timeTaken,
            },
        );
        throw CustomError.get(ErrorType.TIMED_OUT, e);
    }

    logger.error('Failed to parse CV.', {
        context: SERVICE_NAME,
        url: postUrl,
        output,
        timeTaken,
        response: (e.response && e.response.data) || e,
    });
    throw CustomError.get(ErrorType.INVALID_RESUME);
}

function getJwtToken(): string | undefined {
    if (!DaxtraConfig.jwtSecret) {
        return undefined;
    }

    return jwt.sign({ account: DaxtraConfig.account }, DaxtraConfig.jwtSecret, {
        expiresIn: JWT_EXPIRED_IN_SECONDS,
        jwtid: generatorUtil.uuid(),
    });
}

function getAuthorizationHeader(): RawAxiosRequestHeaders {
    const token = getJwtToken();

    if (token) {
        return new AxiosHeaderBuilder(APPLICATION_FORM_CONTENT_TYPE)
            .addAcceptGzipEncoding()
            .addHeader({ JWT: token })
            .build();
    }

    return new AxiosHeaderBuilder(APPLICATION_FORM_CONTENT_TYPE)
        .addAcceptGzipEncoding()
        .build();
}

/**
 * Send file to daxtra for parsing
 * @param {string} file - b64 string of .doc, .docx or .pdf file
 * @param output
 * @return {Promise.<Resume>} - parsed resume details from file
 */
export async function parseResume(
    file: string,
    output?: UploadOutput,
): Promise<Resume> {
    const postUrl = `${DaxtraConfig.url}/profile/full/json`;
    const payload = {
        account: DaxtraConfig.account,
        file,
    };

    let resume: Resume;
    try {
        const response = await axios.post<{ Resume: Resume }>(
            postUrl,
            payload,
            {
                timeout: MAX_WAIT_TIME_FOR_DAXTRA_RESULT,
                headers: getAuthorizationHeader(),
            },
        );
        resume = response.data.Resume;
    } catch (e) {
        throw handleError(e, postUrl, output);
    }

    if (
        !resume.ExperienceSummary ||
        !resume.TextResume ||
        !resume.StructuredResume
    ) {
        logger.warn(`CV content is empty even parsed successfully.`, {
            context: SERVICE_NAME,
            url: postUrl,
            output,
            timeTaken,
        });
        throw CustomError.get(ErrorType.INVALID_RESUME);
    }

    const textResume = (resume.TextResume += '');
    const hasConversionWarning = textResume.includes(
        'CONVERSION WARNING: GRAPHICAL PDF DOCUMENT',
    );
    if (hasConversionWarning) {
        logger.warn(
            `CV content had conversion warning even parsed successfully.`,
            { context: SERVICE_NAME, url: postUrl, output, timeTaken },
        );
        throw CustomError.get(ErrorType.INVALID_RESUME);
    }

    logger.info(`CV parsed successfully.`, {
        context: SERVICE_NAME,
        url: postUrl,
        output,
        timeTaken,
    });

    return resume;
}

export async function getResumeParsedData(
    file: string,
): Promise<{ resume: Resume | null; tags: Tag[] }> {
    const postUrl = `${DaxtraConfig.url}/profile/full/json`;
    const payload = {
        account: DaxtraConfig.account,
        file,
    };

    let resume: Resume;
    try {
        const response = await axios.post<{ Resume: Resume }>(
            postUrl,
            payload,
            {
                timeout: MAX_WAIT_TIME_FOR_DAXTRA_RESULT,
                headers: getAuthorizationHeader(),
            },
        );
        resume = response.data.Resume;
    } catch (e) {
        if (e.code === 'ECONNABORTED') {
            logger.error(
                `Daxtra - Exceeded max wait time (${MAX_WAIT_TIME_FOR_DAXTRA_RESULT}) for result `,
                {
                    context: SERVICE_NAME,
                    url: postUrl,
                    timeTaken,
                },
            );

            const tags = s3TagUtil.buildTagSet({
                [TagKey.DAXTRA_STATUS]: DaxtraStatus.FAILED,
                [TagKey.DAXTRA_ERROR_CODE]: DaxtraErrorCode.TIMED_OUT,
            });

            return { resume: null, tags: tags };
        }

        logger.error('Daxtra - Failed to parse CV.', {
            context: SERVICE_NAME,
            url: postUrl,
            timeTaken,
            response: (e.response && e.response.data) || e,
        });

        const tags = s3TagUtil.buildTagSet({
            [TagKey.DAXTRA_STATUS]: DaxtraStatus.FAILED,
            [TagKey.DAXTRA_ERROR_CODE]: DaxtraErrorCode.FAILED_TO_PARSE_RESUME,
        });

        return { resume: null, tags: tags };
    }

    logger.info(`CV parsed successfully.`, {
        context: SERVICE_NAME,
        url: postUrl,
        timeTaken,
    });

    const tags = s3TagUtil.buildTagSet({
        [TagKey.DAXTRA_STATUS]: DaxtraStatus.SUCCESS,
    });

    return { resume, tags: tags };
}

/**
 * Send file to convert to Pdf
 * @param {string} file - b64 string of .doc, .docx or .pdf file
 * @param output
 */
export async function parseToPdf(
    file: SafeAny,
    output: ConvertPdfPayload,
): Promise<AxiosResponse<Stream>> {
    const postUrl = `${DaxtraConfig.url}/convert2pdf`;

    const payload = new FormData();
    payload.append('account', DaxtraConfig.account);
    payload.append('file', file);

    try {
        const stream = await axios.post(postUrl, payload, {
            responseType: 'stream',
            headers: getAuthorizationHeader(),
        });
        logger.info('CV was converted to PDF successful', {
            context: SERVICE_NAME,
            url: postUrl,
            output,
            timeTaken,
        });

        return stream;
    } catch (e) {
        logger.error('Failed to convert CV to PDF.', {
            context: SERVICE_NAME,
            url: postUrl,
            output,
            error: e,
        });
        throw CustomError.get(ErrorType.INTERNAL_SERVER_ERROR, e);
    }
}
