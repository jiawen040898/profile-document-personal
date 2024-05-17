import { DaxtraErrorCode, DaxtraStatus } from '../enum/daxtra.enum';
import { FileScanErrorCode, FileScanStatus } from '../enum/file-scan.enum';
import { File } from './File.interface';

export interface ResumeWorkExperience {
    role: string | null;
    organization: string | null;
    country_code: string | null;
    description: string | null;
    months_of_work: number | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean | null;
}

export interface ResumeProfile {
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    phone_code: string | null;
    email: string | null;
    nationality: string | null;
    professional_summary: string | null;
}

export interface ResumeSkills {
    name: string;
    proficiency: string | null;
    source: string;
}

export interface ResumeParsedContent {
    profile: ResumeProfile;
    careers: ResumeWorkExperience[];
    skills: ResumeSkills[];
}

export interface ResumeData {
    content_path: string;
    parsed_content: ResumeParsedContent;
}

export interface ResumeUploadStatusMeta {
    file_scan_status: FileScanStatus;
    file_scan_failed_reason?: FileScanErrorCode;
    daxtra_status: DaxtraStatus;
    daxtra_failed_reason?: DaxtraErrorCode;
}

export interface ResumeUpload {
    id: string;
    file_name: string;
    file_path: string;
    status_meta: ResumeUploadStatusMeta;
    resume: ResumeData | null;
}

export interface ResumeUploadRequest {
    company_id?: number;
    file?: File | null;
    file_name?: string | null;
}
