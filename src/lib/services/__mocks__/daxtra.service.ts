import { Resume } from '@pulsifi/interfaces';

import { CustomError } from '../../CustomError';

export async function parseResume(file: string): Promise<Resume> {
    if (!file.length) {
        throw new CustomError('File does not exist');
    }
    return {
        StructuredResume: {
            ContactMethod: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                InternetEmailAddress_main: 'huatzhi@gmail.com',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                PostalAddress_main: {
                    PostalCode: '81800',
                    AddressLine: '210, Jalan Kurnia',
                    Municipality: 'Ulu Tiram',
                    Region: 'Johor',
                    CountryCode: 'MY',
                },
                InternetWebAddress: [
                    {
                        content: 'www.huatzhi.com',
                        type: 'url',
                    },
                ],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Telephone_mobile: '+60 11 - 1089 8231',
            },
            PersonName: {
                FormattedName: 'Lor Gian Zhi',
                FamilyName: 'Zhi',
                GivenName: 'Lor',
                MiddleName: ['Gian'],
                sex: 'Male',
            },
            EmploymentHistory: [
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: 'Present',
                    MonthsOfWork: 45,
                    EmployerOrgName: 'Snsoft Sdn Bhd',
                    Title: ['Javascript Developer'],
                    OrgName: 'Johor',
                    PositionType: 'PERMANENT',
                    JobArea: 'it',
                    StartDate: '2017-05',
                    Description:
                        '*    Develop new features based on requirement (full-stack)\n    *    Fix urgent bugs in the system.\n    *    Breaking down big tasks and assigning them to new recruits.\n    *    Participated in maintenance of the system that handles 10,000,000+ API calls per day.\n    *    Wrote a report generator that analyzes and summarizes 25,000,000 mongo documents within a minute. Some parts of its functions are also being reused for other purposes later by colleagues, which massively shortens their development process.\n    *    Creating a project to scrape data from third party websites through Python and Scrapy, automate them with UI for setting and data presentation.\n    *    Designing and adjusting databases based on requirement and performance issues.\n    *    Use selenium to mimic user behavior for testing.\n    *    Using Pyautogui to automate tasks for the company.\n    *    Keep exploring new ways to achieve the company needs.',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2017-04',
                    MonthsOfWork: 2,
                    EmployerOrgName: 'Talk Focus Sdn Bhd',
                    Title: ['Junior Software Developer'],
                    OrgName: 'K.L.',
                    PositionType: 'CONTRACT',
                    JobArea: 'it',
                    JobGrade: 'joblevel-nonmanager-low',
                    StartDate: '2017-03',
                    Description:
                        '*    Add Js and PHP on top of Wordpress to customize pages.\n    *    Add modules on top of the current Laravel system in the company to fulfill company needs.\n    *    Adjust the way Laravel handles upload so that it will add watermark and compress image size on PDF, GIF, PNG, BMP and JPG.\n\nFreelancing, Remote - JS & PHP Developer',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2016-10',
                    PositionType: 'PERMANENT',
                    MonthsOfWork: 16,
                    JobArea: 'it',
                    StartDate: '2015-07',
                    Description:
                        '*    Wrote a set of Javascript image handlers that do cropping, resizing and rotation of image.\n    *    Built a PHP backend API for a mobile app for gym to allow all their customers to check-in through QR codes for virtual currencies which can exchange for physical rewards.\n    *    Single handedly built a PHP backend API for a Jewellery Reseller to track their stocks flow, and transaction records. Actions of all users are tracked for the security purposes.',
                },
            ],
            Competency: [
                {
                    skillLevel: 100,
                    skillName: 'Full Stack',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 45,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2021',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Full Stack'],
                },
                {
                    skillLevel: 72,
                    skillName: 'Python Programming',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 45,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-lang',
                    },
                    lastUsed: '2021',
                    skillProficiency: 'GOOD',
                    skillAliasArray: [
                        'Python Programming',
                        'Python',
                        'Python - Intermediate',
                    ],
                },
                {
                    auth: true,
                    skillLevel: 66,
                    skillName: 'Ruby on Rails',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: [
                        'Ruby on Rails',
                        'Ruby on Rails - Intermediate',
                    ],
                    skillProficiency: 'GOOD',
                },
                {
                    skillLevel: 51,
                    skillName: 'JavaScript',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 16,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-lang',
                    },
                    lastUsed: '2016',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['JavaScript'],
                },
                {
                    skillLevel: 50,
                    skillName: 'Back End',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 16,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2016',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['Back End'],
                },
                {
                    skillLevel: 48,
                    skillName: 'WordPress',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2017',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['WordPress'],
                },
                {
                    skillLevel: 47,
                    skillName: 'Laravel',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-tool',
                    },
                    lastUsed: '2017',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['Laravel'],
                },
                {
                    skillLevel: 45,
                    skillName: 'JScript',
                    description: 'Skill > IT',
                    auth: true,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2017',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['JScript', 'JS'],
                },
                {
                    skillLevel: 45,
                    skillName: 'PHP Developer',
                    description: 'Skill > IT',
                    auth: false,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2017',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['PHP Developer'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'Go programming language',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-lang',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['Go programming language', 'Golang'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'Node.js',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-tool',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['Node.js'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'ReactJS',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > progr-tool',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['ReactJS'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'SCSS',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['SCSS'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'SQL',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['SQL', 'SQL Queries'],
                },
                {
                    auth: true,
                    skillLevel: 13,
                    skillName: 'Sass',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['Sass'],
                },
                {
                    auth: true,
                    skillLevel: 31,
                    skillName: 'Chinese',
                    description: 'Skill > Language',
                    skillAliasArray: ['Chinese', '中文'],
                },
                {
                    auth: true,
                    skillLevel: 31,
                    skillName: 'English',
                    description: 'Skill > Language',
                    skillAliasArray: ['English'],
                },
                {
                    skillLevel: 100,
                    skillName: 'Javascript Developer',
                    description: 'Held Position',
                    auth: false,
                    skillUsed: {
                        value: 45,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2021',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Javascript Developer'],
                },
                {
                    skillLevel: 48,
                    skillName: 'Junior Software Developer',
                    description: 'Held Position',
                    auth: false,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    lastUsed: '2017',
                    skillProficiency: 'WORKING',
                    skillAliasArray: ['Junior Software Developer'],
                },
                {
                    auth: false,
                    skillLevel: 13,
                    skillName: 'Project management',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'mngm-consult',
                    },
                    description: 'Held Position',
                    skillAliasArray: ['Project management'],
                },
                {
                    auth: true,
                    skillLevel: 91,
                    skillName: 'Bachelors Degree > Bachelor of Science',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'bachelors',
                    },
                    description: 'Degree/Qualification',
                    skillAliasArray: [
                        'Bachelors Degree > Bachelor of Science',
                        'B.Sc. (Hons)',
                    ],
                    Grade: 'Honours',
                },
                {
                    auth: false,
                    skillLevel: 82,
                    skillName: 'Getting Golang certification',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'certification',
                    },
                    description: 'Degree/Qualification > Professional',
                    skillAliasArray: ['Getting Golang certification'],
                },
                {
                    auth: true,
                    skillLevel: 100,
                    skillName: 'industry~it',
                    skillCount: 3,
                    description: 'Industry',
                },
            ],
            lang: 'en',
            Languages: [
                {
                    Speak: true,
                    LanguageCode: 'zh',
                    Write: true,
                    Read: true,
                },
                {
                    Speak: true,
                    LanguageCode: 'en',
                    Write: true,
                    Read: true,
                },
            ],
            EducationHistory: [
                {
                    EndDate: 'Present',
                    schoolType: 'unknown',
                    StartDate: '2017-01',
                },
                {
                    EndDate: '2019-10',
                    Comments:
                        'Remote - Programming with Google Go Specialization\n\n - https://www.coursera.org/account/accomplishments/specialization/NRKHAVZ9KQFE  out of interest through Coursera.',
                    schoolType: 'TRAINING',
                    Degree: {
                        degreeType: 'professional',
                        DegreeName: 'Getting Golang certification',
                        DegreeDate: '2019-10',
                    },
                    StartDate: '2019-09',
                    SchoolName: 'University of California',
                },
            ],
            Nationality: [],
        },
        ExperienceSummary: {
            ExecutiveBrief:
                'Lor Gian Zhi is a resident of Ulu Tiram, Johor, MY. He has been working in the IT occupational sector for more than 5 years. Currently he is employed as a Javascript Developer at Snsoft Sdn Bhd. Lor has extensive knowledge of Full Stack. So far Lor has not gained any managerial experience.',
            HighestEducationalLevel: 'bachelors',
            TotalMonthsOfWorkExperience: 63,
            TotalYearsOfWorkExperience: 5,
        },
        FileStruct: {
            attachment: [
                {
                    conv: 'yes',
                    lang: 'EN',
                    doc_type: 'cv',
                    fname: '0807680525488049',
                    content: '/tmp/soap_263613448749435',
                    ftype: 'docx',
                },
            ],
            filename: '/tmp/soap_263613448749435',
        },
        src: 'DAXTRA-CVX schema:2.0.38 release:0.29.0.69788 rdate:2020-10-14',
        TextResume:
            "\n\nHuat Zhi's Resume\nLor Gian Zhi\nLooking for quality\n210,  Jalan Kurnia,\n81800 Ulu Tiram,\nJohor, Malaysia.\n(60) 11 - 1089 8231\n\n huatzhi@gmail.com\nwww.huatzhi.com\n\nEXPERIENCE\n\nSnsoft Sdn Bhd, Johor. - Javascript Developer\nMAY 2017 - NOW\n\n    *    Develop new features based on requirement (full-stack)\n    *    Fix urgent bugs in the system.\n    *    Breaking down big tasks and assigning them to new recruits.\n    *    Participated in maintenance of the system that handles 10,000,000+ API calls per day.\n    *    Wrote a report generator that analyzes and summarizes 25,000,000 mongo documents within a minute. Some parts of its functions are also being reused for other purposes later by colleagues, which massively shortens their development process.\n    *    Creating a project to scrape data from third party websites through Python and Scrapy, automate them with UI for setting and data presentation.\n    *    Designing and adjusting databases based on requirement and performance issues.\n    *    Use selenium to mimic user behavior for testing.\n    *    Using Pyautogui to automate tasks for the company.\n    *    Keep exploring new ways to achieve the company needs.\n\nTalk Focus Sdn Bhd, K.L. - Junior Software Developer\nMARCH 2017 - APRIL 2017\n\n    *    Add Js and PHP on top of Wordpress to customize pages.\n    *    Add modules on top of the current Laravel system in the company to fulfill company needs.\n    *    Adjust the way Laravel handles upload so that it will add watermark and compress image size on PDF, GIF, PNG, BMP and JPG.\n\nFreelancing, Remote - JS & PHP Developer\nJULY 2015 - OCTOBER 2016\n\n    *    Wrote a set of Javascript image handlers that do cropping, resizing and rotation of image.\n    *    Built a PHP backend API for a mobile app for gym to allow all their customers to check-in through QR codes for virtual currencies which can exchange for physical rewards.\n    *    Single handedly built a PHP backend API for a Jewellery Reseller to track their stocks flow, and transaction records. Actions of all users are tracked for the security purposes.\n\n\n\n\nEDUCATION\n\nFree Code Camp, Remote - Coding Bootcamp\nJANUARY 2017 - PRESENT\n\nDoing self study and hopefully mastering Node.js in the progress.\n\nUniversity of California, Remote - Programming with Google Go Specialization\nSEPTEMBER 2019 - OCTOBER 2019\n\nGetting Golang  certification - https://www.coursera.org/account/accomplishments/specialization/NRKHAVZ9KQFE  out of interest through Coursera.\n\nNext Academy, Kuala Lumpur - Web Development Bootcamp\nOCTOBER 2016 - DECEMBER 2016\n\nMastering Ruby on Rails and learning coding best practices that previously couldn't get a chance to do so.\n\nAsia Pacific Technology, Kuala Lumpur - B.Sc. (Hons) Technopreneurship (Degree)\nMAY 2011 - MARCH 2015\n\nGraduated with Second Class Honours: 1st Division (2:1)\nSKILLS\n\n    *    Ruby on Rails - Intermediate\nMEAN stack - Intermediate\nLaravel/Lumen - Intermediate\n    *    SQL Queries / MySQLi - Intermediate\n    *    Python - Intermediate\n    *    Golang - Entry\n    *    ReactJs - Entry\n    *    VueJs -Entry\n    *    SCSS/SASS - Entry\n\nINTERESTED IN LEARNING\n\n    *    Best practices on handling testing\n    *    Project management cycle that work efficiently\n    *    Anything that improve code quality without adding more works for programmers and reduce cost of production\n\nLANGUAGES\n\n中文(Chinese), English\n\n",
        ParserInfo: {
            ConverterRelease: '0.22.0.69788',
            ParserConfiguration:
                '{max_len=30000} {tel_flag=} {send_zip=} {fast_conv=} {DEF_LOCAL=} {sdate=0} {no_email_body=0} {do_clever_zoning=0} {keep_zone_span=0} {keep_span=1} {complex=0} {accept_langs=} {not_accept_langs=} {prefer_lang_cv=} {pers_only=0} {projects_off=0} {tree_search_on=0} {all_skills=0} {turbo=0} {known_layouts_only=0} {split_language=0} {picture=0} {picture_inline=0} {debug=0} {ocr_allowed=1} {max_pages=8} {name_space=0} {charset=} {hrxml_upgrade_edu_hist=0}{hrxml_add_languages_section=1}{spool=} {docID=} {user=pulsifi} ',
            ParserRelease: '0.29.0.69788',
            ParserReleaseDate: '2020-10-14',
            ConverterReleaseDate: '2020-10-14',
            ParserSchema: '2.0.38',
        },
    };
}
