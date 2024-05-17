import { generatorUtil } from '@pulsifi/fn';
import { UploadOutput } from '@pulsifi/interfaces';

import { httpMiddleware } from '../../lib/commonMiddleware';
import {
    copyFileToCompanyAssetFolder,
    uploadingFile,
} from '../fileUpload/uploadingFile';

// endpoint input: {file: file, file_purpose: attachment|resume}

// header Content-Type have to set to multipart/form-data
const uploadHandler = async (event: SafeAny) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { file, company_id, company_name, job_id, job_title } = event.body;

    const basePath = 'fileUpload';
    const uuid = generatorUtil.uuid();

    const savedItem = await uploadingFile(file, true, uuid, uuid, basePath);

    const assetItem = await copyFileToCompanyAssetFolder(
        savedItem,
        company_id || 'general',
        uuid,
    );

    const output: UploadOutput = {
        file_path: assetItem.file_path,
        file_name: assetItem.file_name,
        meta: {
            company_id,
            company_name,
            job_id,
            job_title,
        },
    };

    return {
        statusCode: 200,
        body: JSON.stringify({ data: output }, null, 2),
    };
};

export const handler = httpMiddleware(uploadHandler);
