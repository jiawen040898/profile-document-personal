import { FilePurpose } from '@pulsifi/enum';
import { generatorUtil } from '@pulsifi/fn';
import { File, OutputResume, UploadOutput } from '@pulsifi/interfaces';

import { httpMiddleware } from '../../lib/commonMiddleware';
import { getResumeDetails } from './getResumeDetails';
import { uploadingFile } from './uploadingFile';
import { validateFile } from './validation';

// endpoint input: {file: file, file_purpose: attachment|resume}

// header Content-Type have to set to multipart/form-data
const uploadHandler = async (event: SafeAny /*, context*/) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { file_purpose, file, company_id, company_name, job_id, job_title } =
        event.body;

    validateFile(file_purpose, file);

    const uuid = generatorUtil.uuid();

    const savedItem = await uploadingFile(
        file,
        file_purpose === FilePurpose.RESUME ||
            file_purpose === FilePurpose.ATTACHMENT,
        uuid,
        file_purpose,
    );

    const output: UploadOutput = {
        file_path: savedItem.file_path,
        file_name: savedItem.file_name,
        meta: {
            company_id,
            company_name,
            job_id,
            job_title,
        },
    };

    if (file_purpose == FilePurpose.RESUME) {
        const { fullDetails, partialDetails } = await getResumeDetails(
            file.content,
            output,
        );
        const fullDetailsJson = JSON.stringify(fullDetails);
        const fullDetailsBuffer = Buffer.from(fullDetailsJson, 'utf-8');
        const fullDetailsJsonFile: File = {
            content: fullDetailsBuffer,
            filename: 'daxtra.json',
            mimeType: 'application/json',
        };
        const savedJson = await uploadingFile(
            fullDetailsJsonFile,
            false,
            uuid,
            'daxtra',
        );

        const outputResume: OutputResume = {
            content_path: savedJson.file_path,
            parsed_content: partialDetails,
        };

        output.resume = outputResume;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ data: output }, null, 2),
    };
};

export const handler = httpMiddleware(uploadHandler);
