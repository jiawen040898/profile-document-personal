import { PulsifiConfig } from '@pulsifi/configs';
import { logger } from '@pulsifi/fn';
import { ICandidateAddResume } from '@pulsifi/interfaces';
import axios from 'axios';

export async function candidateAddResume(
    jobApplicationId: string,
    fileName: string,
    filePath: string,
    contentPath: string,
): Promise<void> {
    const addResumePath = `candidate/v1.0/partner/job_applications/${jobApplicationId}/resume`;
    const postUrl = `${PulsifiConfig.alb_url}/${addResumePath}`;
    const resumeFileExtension = filePath.split('.').pop()!;

    const payload: ICandidateAddResume = {
        file_name: fileName,
        file_path: filePath,
        file_type: resumeFileExtension,
        content_path: contentPath,
    };

    logger.info('Call candidate API to add resume', {
        data: { postUrl, payload },
    });

    await axios.post(postUrl, payload);
}
