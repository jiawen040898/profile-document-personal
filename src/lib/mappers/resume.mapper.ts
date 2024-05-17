import { sanitizeByteString } from '@pulsifi/utils';
import { parsePhoneNumber } from 'libphonenumber-js';

import {
    Resume,
    StructuredResumeCompetency,
    StructuredResumeEmploymentHistory,
} from '../interfaces/Resume.interface';
import {
    ResumeData,
    ResumeSkills,
    ResumeWorkExperience,
} from '../interfaces/ResumeUpload.interface';

const proficiencyMap: { [key: string]: string } = {
    EXCELLENT: 'expert',
    GOOD: 'competent',
    BASIC: 'novice',
};

const toResumeDetails = (
    resumeRawData: Resume,
    filePath: string,
): ResumeData => {
    const rawPhoneNumber =
        resumeRawData.StructuredResume?.ContactMethod?.Telephone_mobile;
    const phoneNumberData = getPhoneNumber(rawPhoneNumber);
    const workExperiences = parseExperience(
        resumeRawData.StructuredResume?.EmploymentHistory,
    );
    const skills = parseSkills(resumeRawData.StructuredResume?.Competency);

    return {
        content_path: filePath,
        parsed_content: {
            profile: {
                first_name:
                    resumeRawData.StructuredResume?.PersonName?.GivenName ||
                    null,
                last_name:
                    resumeRawData.StructuredResume?.PersonName?.FamilyName ||
                    null,
                phone_number: phoneNumberData.nationalNumber,
                phone_code: phoneNumberData.countryCallingCode,
                email:
                    resumeRawData.StructuredResume?.ContactMethod
                        ?.InternetEmailAddress_main || null,
                nationality:
                    resumeRawData.StructuredResume?.Nationality?.[0] || null,
                professional_summary:
                    sanitizeByteString(
                        resumeRawData.StructuredResume?.ExecutiveSummary,
                    ) || null,
            },
            careers: workExperiences,
            skills,
        },
    };
};

function getPhoneNumber(rawPhoneNumber: string | undefined) {
    try {
        if (rawPhoneNumber) {
            const phoneNumber = parsePhoneNumber(rawPhoneNumber);
            return {
                countryCallingCode: String(phoneNumber.countryCallingCode),
                nationalNumber: phoneNumber.nationalNumber,
            };
        }
    } catch (error) {}

    return { countryCallingCode: null, nationalNumber: null };
}

function parseExperience(
    employmentHistory: StructuredResumeEmploymentHistory[] = [],
): ResumeWorkExperience[] {
    return employmentHistory.map((experience) => ({
        role: sanitizeByteString(experience.Title?.[0]),
        organization: sanitizeByteString(experience.OrgName),
        country_code: experience.LocationSummary?.CountryCode || null,
        description: sanitizeByteString(experience.Description),
        months_of_work: experience.MonthsOfWork || null,
        start_date:
            experience.StartDate && Date.parse(experience.StartDate)
                ? experience.StartDate
                : null,
        end_date:
            experience.EndDate && Date.parse(experience.EndDate)
                ? experience.EndDate
                : null,
        is_current: String(experience.EndDate)
            ? Boolean(
                  String(experience.EndDate).toLowerCase() === 'present' ||
                      !experience.EndDate,
              )
            : null,
    }));
}

function parseSkills(
    competencies: StructuredResumeCompetency[] = [],
): ResumeSkills[] {
    const skills: ResumeSkills[] = [];

    const daxtraSkillCondition1 = (
        auth: boolean,
        description: string,
    ): boolean => auth && description === 'Skill';

    const daxtraSkillCondition2 = (description: string): boolean =>
        description.toLowerCase() === 'skill > language';

    competencies.forEach((skill) => {
        if (daxtraSkillCondition1(skill.auth, skill.description)) {
            const processedSkillName = sanitizeByteString(skill.skillName);

            if (processedSkillName) {
                skills.push({
                    name: processedSkillName,
                    proficiency: skill.skillProficiency
                        ? proficiencyMap[skill.skillProficiency]
                        : null,
                    source: 'daxtra',
                });
            }
        }

        if (daxtraSkillCondition2(skill.description)) {
            const processedSkillName = sanitizeByteString(
                skill.skillName.split('>').at(-1),
            );

            if (processedSkillName) {
                skills.push({
                    name: processedSkillName,
                    proficiency: skill.skillProficiency
                        ? proficiencyMap[skill.skillProficiency]
                        : null,
                    source: 'daxtra',
                });
            }
        }
    });

    return skills;
}

export const resumeMapper = {
    toResumeDetails,
};
