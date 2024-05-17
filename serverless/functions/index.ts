/* eslint-disable @typescript-eslint/naming-convention */
import { Functions } from 'serverless/aws';

import { candidateFileUpload } from './candidate-file-upload.fn';
import { convertToPdf } from './convert-to-pdf.fn';
import { documentUpload } from './document-upload.fn';
import { resumeParser } from './resume-parser.fn';
import { resumeUpload } from './resume-upload.fn';

export const functions: Functions = {
    candidateFileUpload,
    documentUpload,
    convertToPdf,
    resumeUpload,
    resumeParser,
};
