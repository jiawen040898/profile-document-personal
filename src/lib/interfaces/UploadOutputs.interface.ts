import { ResumeSkills } from './ResumeUpload.interface';

export interface UploadOutput {
    file_path: string;
    file_name: string;
    resume?: OutputResume;
    meta: MetaOutput;
}

export interface MetaOutput {
    company_id?: string;
    company_name?: string;
    job_id?: string;
    job_title?: string;
}

export interface OutputResume {
    content_path: string;
    parsed_content: OutputParsedContent;
}

export interface OutputParsedContent {
    profile: OutputResumeProfile;
    careers: Array<OutputResumeWorkExperience>;
    skills: ResumeSkills[];
}

export interface OutputResumeProfile {
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    phone_code?: string | null;
    email?: string | null;
    nationality?: string | null;
}

export interface OutputResumeWorkExperience {
    role: string | null;
    organization?: string | null;
    country_code?: string | null;
    description?: string | null;
    months_of_work?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean | null;
}
