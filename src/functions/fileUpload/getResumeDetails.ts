import { OutputParsedContent, Resume, UploadOutput } from '@pulsifi/interfaces';
import { resumeMapper } from '@pulsifi/mappers';
import { parseResume } from '@pulsifi/services';

export async function getResumeDetails(
    file: Buffer,
    output: UploadOutput,
): Promise<{
    fullDetails: Resume;
    partialDetails: OutputParsedContent;
}> {
    const b64File: string = file.toString('base64');
    const fullDetails: Resume = await parseResume(b64File, output);

    const getMappedResumeDetails = resumeMapper.toResumeDetails(
        fullDetails,
        '',
    );

    const partialDetails: OutputParsedContent = {
        profile: getMappedResumeDetails.parsed_content.profile,
        careers: getMappedResumeDetails.parsed_content.careers,
        skills: getMappedResumeDetails.parsed_content.skills,
    };

    return {
        fullDetails,
        partialDetails,
    };
}
