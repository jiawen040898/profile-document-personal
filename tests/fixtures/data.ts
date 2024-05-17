/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { UploadingFileResponseDto } from '@pulsifi/interfaces';
import { S3Event } from 'aws-lambda';

import { testUtil } from '../setup';
import jsonResumeFile from './jsonResumeFile.json';

const getItemExampleOutput: GetObjectCommandOutput = {
    ...jsonResumeFile,
    // @ts-ignore
    LastModified: new Date(jsonResumeFile.LastModified),
    // @ts-ignore
    Body: Buffer.from(jsonResumeFile.Body.data),
};

const exampleDaxtraOutput = {
    Resume: {
        StructuredResume: {
            ContactMethod: {
                InternetEmailAddress_main: 'nazrinaye109@gmail.com',
                PostalAddress_main: {
                    Municipality: 'Banting',
                    Region: 'Selangor',
                    CountryCode: 'MY',
                },
                InternetWebAddress: [
                    {
                        content:
                            'https://www.linkedin.com/in/nazrin-aye-b0b295a8',
                        type: 'linkedin',
                    },
                    {
                        content: 'https://sites.google.com/view/munawhere/home',
                        type: 'website',
                    },
                ],
                Telephone_mobile: '+60 17 4234634',
            },
            ExecutiveSummary:
                "I am a highly driven and detail-oriented Industrial Design graduate, po\u0000ssessing an unwavering passion for innovation and a profound fascination with the design industry. My proven ability to envision and meticulously refine designs and my natural leadership skills enable me to excel in collaborative environments, where I inspire and guide cross-functional teams to achieve excellence. I am readily available with just 1 month's notice, eager to relocate for the right opportunity, and committed to bringing my dynamic and confident approach to Design Professional world, always striving to push the boundaries of creativity and functionality while making a substantial impact on any project.",
            PersonName: {
                FormattedName: 'Muhammad Nazrin Bin Ramlan',
                FamilyName: 'Bin Ramlan',
                GivenName: 'Muhammad',
                MiddleName: ['Nazrin'],
                sex: 'Male',
            },
            lang: 'en',
            Competency: [
                {
                    skillLevel: 99,
                    skillName: 'Human Factors and Ergo\u0000nomics',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 17,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'health-safety > misc',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: [
                        'Human Factors and Ergonomics',
                        'ergonomic',
                        'ergonomics',
                    ],
                },
                {
                    skillLevel: 98,
                    skillName: 'Entrepreneurship',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 7,
                        type: 'Months',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Entrepreneurship'],
                },
                {
                    skillLevel: 98,
                    skillName: 'optimal support',
                    description: 'Skill',
                    auth: false,
                    skillUsed: {
                        value: 12,
                        type: 'Months',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['optimal support'],
                },
                {
                    skillLevel: 97,
                    skillName: 'Marketing',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 7,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'marketing',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Marketing', 'marketing,'],
                },
                {
                    skillLevel: 96,
                    skillName: 'Budgets & Budgeting > Budget Management',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 7,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'accountancy',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: [
                        'Budgets & Budgeting > Budget Management',
                        'budget management',
                    ],
                },
                {
                    skillLevel: 96,
                    skillName: 'Community Engagement',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 7,
                        type: 'Months',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Community Engagement'],
                },
                {
                    skillLevel: 96,
                    skillName: 'Customer Satisfaction',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'customer-service > measure-test',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Customer Satisfaction'],
                },
                {
                    skillLevel: 96,
                    skillName: 'Customer Service',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 2,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'customer-service > misc',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: ['Customer Service'],
                },
                {
                    skillLevel: 96,
                    skillName: 'Eye for Detail',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 18,
                        type: 'Months',
                    },
                    lastUsed: '2023',
                    skillProficiency: 'EXCELLENT',
                    skillAliasArray: [
                        'Eye for Detail',
                        'detail-oriented',
                        'attention to detail',
                        'meticulous',
                    ],
                },
                {
                    skillLevel: 70,
                    skillName: 'Inventory Management',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 15,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'transport > warehousing',
                    },
                    lastUsed: '2020',
                    skillProficiency: 'GOOD',
                    skillAliasArray: [
                        'Inventory Management',
                        'inventory control',
                    ],
                },
                {
                    skillLevel: 70,
                    skillName: 'Operations Management',
                    description: 'Skill',
                    auth: true,
                    skillUsed: {
                        value: 9,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'banking-finance',
                    },
                    lastUsed: '2021',
                    skillProficiency: 'GOOD',
                    skillAliasArray: [
                        'Operations Management',
                        'Operational Management',
                    ],
                },
                {
                    skillLevel: 68,
                    skillName: 'Mastered coffee preparation',
                    description: 'Skill',
                    auth: false,
                    skillUsed: {
                        value: 6,
                        type: 'Months',
                    },
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'accountancy',
                    },
                    lastUsed: '2020',
                    skillProficiency: 'GOOD',
                    skillAliasArray: ['Mastered coffee preparation'],
                },
                {
                    auth: true,
                    skillLevel: 23,
                    skillName: 'Adobe After Effects',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > graphics-package',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: [
                        'Adobe After Effects',
                        'Adobe After Effects ( Basic)',
                    ],
                    skillProficiency: 'BASIC',
                },
                {
                    auth: true,
                    skillLevel: 23,
                    skillName: 'Autodesk Revit',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it > graphics-package-eng',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['Autodesk Revit', 'Revit (Basic)'],
                    skillProficiency: 'BASIC',
                },
                {
                    auth: true,
                    skillLevel: 23,
                    skillName: 'CAD/CAM > CAM',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['CAD/CAM > CAM', 'CAM (Basic)'],
                    skillProficiency: 'BASIC',
                },
                {
                    auth: true,
                    skillLevel: 23,
                    skillName: 'Fusion',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['Fusion'],
                    skillProficiency: 'BASIC',
                },
                {
                    auth: true,
                    skillLevel: 23,
                    skillName: 'SketchUp',
                    TaxonomyId: {
                        idOwner: 'DAXTRA',
                        description: 'it',
                    },
                    description: 'Skill > IT',
                    skillAliasArray: ['SketchUp', 'SketchUp (Basic)'],
                    skillProficiency: 'BASIC',
                },
            ],
            EmploymentHistory: [
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: 'Present',
                    EmployerOrgName: 'Blaupunkt Manufacturing',
                    Title: ['PRO\u0000DUCT DESIGNER'],
                    OrgName: 'Blaupunkt Manufacturing',
                    OrgIndustry: {
                        primaryIndicator: true,
                        IndustryDescription: 'company',
                    },
                    JobArea: 'engineering',
                    StartDate: '2023-09',
                    Description:
                        '* Multifaceted Design Skills, Proficiently designed pro\u0000duct packaging, 3D projects, and social posters, combining creativity with functionality to meet industry standards.\n    *Collaborative Teamwork, Work closely with cross-functional teams to ensure product designs align with technical feasibility and marketing goals.\n    * Innovation and Sustainability, Incorporate innovative design solutions and sustainable principles into product designs, focusing on user experience and environmental responsibility.\n    * Project Management, Manage end-to-end design projects, from concept to completion, adhering to deadlines and maintaining quality standards while adapting to evolving requirements.',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2023-04',
                    MonthsOfWork: 2,
                    Title: ['RETAIL SALES ASSISTANT'],
                    PositionType: 'CONTRACT',
                    JobArea: 'retail',
                    JobGrade: 'joblevel-nonmanager-low',
                    StartDate: '2023-03',
                    Description:
                        "Provided exceptional customer service by assisting sho\u0000ppers with inquiries, locating merchandise, and ensuring a high level of customer satisfaction.\n    * Actively participated in visual merchandising tasks, contributing to an attractive store layout and product displays that enhanced the overall shopping experience. \n    * Handled cash transactions with precision and efficiency, showcasing strong attention to detail and reliability in financial matters. \n    * Collaborated effectively with colleagues to achieve and exceed sales targets, maintaining the store's reputation for excellence in customer service and sales performance. \n    * Gained valuable experience in retail operations, further developing my interpersonal and organizational skills while contributing to the store's daily operations and success",
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2022-12',
                    PositionType: 'CO\u0000NTRACT',
                    JobArea: 'it',
                    StartDate: '2022-12',
                    Description:
                        "MARCH 2023 (4 MONTHS)\n-------\nMaju Home Concept\n\n    *AR Content Creation, Designed and developed interactive 3D models and AR content to enhance the user experience within the Maju Home Concept application.\n    * Product Visualization, Transformed physical products into AR-ready digital representations, allowing customers to visualize furniture and decor items in their real-world environment. \n    * Optimization and Integration, Ensured seamless integration of 3D assets into the AR application's user interface while optimizing assets for optimal performance across various devices. \n    * Customization and Quality Assurance, Enabled customization options for users to tailor the appearance and placement of virtual items and conducted thorough testing to ensure a glitch free experience. \n    * Collaboration and Innovation , Worked closely with cross-functional teams, staying updated with emerging AR technologies and delivering exceptional AR experiences that met or exceeded client expectations",
                    Title: ['3D DESIGNER'],
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2023-03',
                    MonthsOfWork: 7,
                    LocationSummary: {
                        CountryCode: 'MY',
                    },
                    EmployerOrgName: 'the Entrepreneurship Club',
                    Title: ['President', 'President'],
                    OrgName: 'the Entrepreneurship Club',
                    PositionType: 'CO\u0000NTRACT',
                    JobArea: 'senior',
                    JobGrade: 'joblevel-management-senior',
                    StartDate: '2022-09',
                    Description:
                        "President of ENTREPRENEURSHIP CLUB 2022    SEPTEMBER 2022 - MARCH 2023 ( 6 MONTHS)\n the University of Putra Malaysia  from September 2022 to\n    March 2023 , I led the club with a strategic vision, fostering a culture of entrepreneurship on campus. I built a dedicated team , organized impactful events, facilitated workshops, and created opportunities for networking and mentorship. Through effective marketing, budget management, and community engagement, I enhanced the club's influence and provided valuable resources for aspiring student\n-------\nentrepreneurs\n\n PROJECT AND INVOLVEMENTS",
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2023-08',
                    MonthsOfWork: 12,
                    EmployerOrgName:
                        'S PROJECT COLLOBRATE WITH LONGE MEDIKAL SDN BHD',
                    OrgName:
                        'S PROJECT CO\u0000LLOBRATE WITH LONGE MEDIKAL SDN BHD',
                    PositionType: 'PERMANENT',
                    JobArea: 'medicine',
                    StartDate: '2022-09',
                    Description:
                        "BACHELOR DEGREE' 2022 - AUGUST 2023  ( 1 YEARS)\n-------\n* Collaborated with Longe Medikal Sdn Bhd on a year-long project to develop an exoskeleton bone support system for upper limb disorders. \n  * Conducted extensive research to identify the challenges individuals with upper limb disorders face, shaping project objectives. \n  * Utilized innovative lattice design techniques to create a lightweight and efficient exoskeleton that provided optimal support and comfort.\n    Actively oversaw the prototyping phase, ensuring the exoskeleton's functionality and real-world effectiveness\n\n  * Conducted in-depth technical research into materials, biomechanics, and ergonomics to inform design decisions.\n\n    Rigorously tested the exoskeleton with users, iteratively improving its usability based on feedback. \n    Maintained detailed project records for transparency and accountability. \n  * Presented project updates and findings to academic advisors and industry partners. Demonstrated adaptability and creative problem-solving in overcoming design challenges. \n  * Collaborated with a multidisciplinary team, incorporating diverse perspectives into the project.\n  * Ensured ethical compliance, meeting safety and regulatory standards. \n    Successfully delivered  a functional exoskeleton, potentially benefiting  individuals with upper limb disorders.",
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2022-07',
                    MonthsOfWork: 5,
                    EmployerOrgName: 'TT Racing Sdn Bhd',
                    Title: ['JUNIOR DESIGNER'],
                    OrgName: 'TT Racing Sdn Bhd',
                    PositionType: 'INTERNSHIP PROGRAM',
                    JobArea: 'marketing',
                    JobGrade: 'joblevel-nonmanager-low',
                    StartDate: '2022-03',
                    Description:
                        "* Product Design and Development: During my internship, I worked closely with the team on a unique project, collaborating with Disney to create a product centered around the Marvel theme. I actively contributed to the product design process, helping to conceptualize, sketch, and develop 3D models of innovative and captivating merchandise that adhered to Disney's high-quality standards. \n    * Packaging Design: Besides product design, I gained valuable experience in packaging design. I was responsible for creating visually appealing and  informative packaging designs that showcased the Marvel-themed product effectively and ensured the product's safety and integrity during transit.\n    * Graphic Design: My internship also allowed me to enhance my graphic design skills. I was involved in creating marketing collateral, promotional materials, and digital assets that effectively communicated the Marvel-themed product's features and benefits to potential customers.\n    Research and Development: I actively participated in research efforts on the MDEC Global Technology\n    Grant for smart ergonomic solutions. This included conducting market research, gathering data, and assisting in developing concepts for smart ergonomic seats, smart ergonomic desks, and smart monitor arms. My research contributions played a crucial role in shaping the direction of these projects.\n    * Collaborative Environment:  Throughout my internship, I  collaborated with a  diverse team of professionals, including product managers, graphic designers, engineers, and researchers. This experience allowed  me to work in  a  dynamic, cross-functional environment where I learned the importance of effective communication and teamwork in achieving project goals",
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2021-03',
                    MonthsOfWork: 31,
                    EmployerOrgName: 'Saha Coffee Sdn Bhd',
                    OrgName: 'Saha Co\u0000ffee Sdn Bhd',
                    PositionType: 'COLLECTIVE',
                    Description:
                        'MULTIPLE POSITION     SEPTEMBER 2018 - MARCH 2021  ( 2 YEARS 6 MONTHS)',
                    StartDate: '2018-09',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2019-12',
                    MonthsOfWork: 16,
                    EmployerOrgName: 'Saha Coffee Sdn Bhd',
                    Title: ['Waiter'],
                    OrgName: 'Exceptional Customer Service',
                    PositionType: 'PERMANENT',
                    JobArea: 'catering',
                    JobGrade: 'joblevel-nonmanager-low',
                    StartDate: '2018-09',
                    Description:
                        'Saha Coffee Sdn Bhd\n\n: Provided outstanding service by taking orders, ensuring order accuracy and creating memorable dining experiences.\n-------\n* Team Collaboration: Worked seamlessly with colleagues and kitchen staff to maintain smooth dining operations.\n    * Detail-oriented: Paid meticulous attention to customer requests and dietary needs.\n    * Sales and Promotion: Actively promoted menu items and contributed to increased sales.',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2020-06',
                    MonthsOfWork: 6,
                    EmployerOrgName: 'Saha Coffee Sdn Bhd',
                    Title: ['Barista'],
                    OrgName: 'Saha Coffee Sdn Bhd',
                    PositionType: 'PERMANENT',
                    JobArea: 'catering',
                    StartDate: '2020-01',
                    Description:
                        '* Coffee Expertise: Mastered coffee preparation, consistently delivering high-quality beverages.\n    * Equipment Proficiency: Operated and maintained coffee equipment for optimal performance.\n    * Customization: Personalized coffee orders and honed latte art skills\n\n    * Inventory Management: Assisted in managing coffee inventory and supplies efficiently.',
                },
                {
                    employerOrgType: 'soleEmployer',
                    EndDate: '2021-03',
                    MonthsOfWork: 9,
                    EmployerOrgName: 'Saha Coffee Sdn Bhd',
                    Title: ['Store Manager'],
                    OrgName: 'Saha Coffee Sdn Bhd',
                    PositionType: 'PERMANENT',
                    JobArea: 'retail',
                    JobGrade: 'joblevel-management-low',
                    StartDate: '2020-07',
                    Description:
                        '* Leadership: Provided guidance and support to the team , fostering a motivated work environment. Operational Management: Oversaw daily operations, staff scheduling, and inventory control.\n    * Customer Relations: Cultivated strong customer relationships and addressed feedback. Quality Assurance: Maintained high standards of food safety and hygiene.\n    * Profitability: Implemented cost-effective measures and optimized pricing for increased revenue.\n\n LEADERSHIP EXPERIENCES\n\n President of International SEED Show Case 2023    SEPTEMBER 2022 - AUGUST 2023 ( 1 YEARS)\n In my role as the President of the Showcase Department at Universiti Putra Malaysia for the "International\n SEED Showcase 2023," I:\n\n  * Developed the theme "Enhancing Hyper Customization through Circular Design."\n    Coordinated 39 final-year projects in collaboration with 17 industry companies. \n    Facilitated participation from three international universities. \n    Managed the event budget effectively.\n    Led a diverse team , overseeing various aspects of the event.\n    Ensured a seamless event planning and execution process. \n    Launched a comprehensive promotional campaign. \n  * Organized engaging activities for attendees. \n    Adapted quickly to address unforeseen challenges. \n  * Gathered valuable feedback post-event for future improvements.',
                },
            ],
            Languages: [
                {
                    Speak: true,
                    Proficiency: 'EXCELLENT',
                    LanguageCode: 'en',
                    Write: true,
                    Read: true,
                },
                {
                    Speak: true,
                    Proficiency: 'EXCELLENT',
                    LanguageCode: 'ms',
                    Write: true,
                    Read: true,
                },
            ],
            EducationHistory: [
                {
                    EndDate: '2023-07',
                    Comments:
                        "CGPA: 3.514\n\n  * Dean's List Award for Undergraduate Study in 2 Semesters\n  * Leadership Achievement Award for undergraduate study in 8 consecutive semesters\n  * Graduate with Second Class Upper Honours",
                    Major: 'Industrial Design',
                    MeasureValue: 'GPA: 3.867',
                    schoolType: 'university',
                    Degree: {
                        degreeType: 'bachelors',
                        DegreeName: 'Bachelors Degree',
                        DegreeDate: '2023-07',
                    },
                    StartDate: '2018-09',
                    SchoolName: 'UNIVERSITI PUTRA MALAYSIA (UPM)',
                },
            ],
        },
        ExperienceSummary: {
            HighestEducationalLevel: 'bachelors',
            TotalYearsOfManagementWorkExperience: 1.3,
            TotalYearsOfSeniorManagementWorkExperience: 0.5,
            TotalYearsOfLowLevelManagementWorkExperience: 0.7,
            TotalMonthsOfWorkExperience: 50,
            TotalMonthsOfSeniorManagementWorkExperience: 7,
            ExecutiveBrief:
                'Muhammad Nazrin Bin Ramlan is a resident of Banting, Selangor, MY. He has been working in the Engineering occupational sector for more than 4 years. Currently he is employed as a Product Designer at Blaupunkt Manufacturing. Muhammad has some experience in management (16 months) with exposure to senior management positions.',
            TotalMonthsOfLowLevelManagementWorkExperience: 9,
            TotalMonthsOfManagementWorkExperience: 16,
            TotalYearsOfWorkExperience: 4,
            ManagementRecord:
                'Since 2022-09, for a total duration of 7 months, this candidate had experience at a senior management level working as a President/President at the Entrepreneurship Club.\nSince 2020-07, for a total duration of 9 months, this candidate had experience at a lower grade management level working as a Store Manager at Saha Coffee Sdn Bhd.\n',
        },
        FileStruct: {
            attachment: [
                {
                    conv: 'yes',
                    lang: 'EN',
                    doc_type: 'cv',
                    fname: '0108217874678612',
                    content: '/tmp/soap_925804862377362',
                    ftype: 'PDF_GRAPHICS',
                },
            ],
            filename: '/tmp/soap_925804862377362',
        },
        src: 'DAXTRA-CVX schema:2.0.40 release:0.32.0.81887 rdate:2023-09-28',
        TextResume:
            "\n\nMUHAMMAD NAZRIN BIN RAMLAN\n\n                     FRESH GRADUATE INDUSTRIAL DESIGN\n                   Address:  Banting, Selangor Malaysia\n                   Mobile:   017-4234634\n\n\n                   Email:    nazrinaye109@gmail.com\n                   Linkedin:  https://www.linkedin.com/in/nazrin-aye-b0b295a8/\n                   Portfolio:  https://sites.google.com/view/munawhere/home    LINKEDIN PROFILE\n\n PROFESSIONAL SUMMARY\n\n I am a highly driven and detail-oriented Industrial Design graduate, possessing an unwavering passion for innovation and a profound fascination with the design industry. My proven ability to envision and meticulously refine designs and my natural leadership skills enable me to excel in collaborative environments, where I inspire and guide cross-functional teams to achieve excellence. I am readily available with just 1 month's notice, eager to relocate for the right opportunity, and committed to bringing my dynamic and confident approach to Design Professional world, always striving to push the boundaries of creativity and functionality while making a substantial impact on any project.\n\n EDUCATIONAL BACKGROUND\n\n UNIVERSITI PUTRA MALAYSIA (UPM), SERDANG       SEPT 2018 - JULY 2023\n Bachelors of Industrial Design\n\n Latest GPA: 3.867\n\n CGPA: 3.514\n\n  * Dean's List Award for Undergraduate Study in 2 Semesters\n  * Leadership Achievement Award for undergraduate study in 8 consecutive semesters\n  * Graduate with Second Class Upper Honours\n\n WORKING EXPERIENCES\n\n PRODUCT DESIGNER       SEPTEMBER 2023 - PRESENT\n\n Blaupunkt Manufacturing company\n\n   * Multifaceted Design Skills, Proficiently designed product packaging, 3D projects, and social posters, combining creativity with functionality to meet industry standards.\n   *Collaborative Teamwork, Work closely with cross-functional teams to ensure product designs align with technical feasibility and marketing goals.\n   * Innovation and Sustainability, Incorporate innovative design solutions and sustainable principles into product designs, focusing on user experience and environmental responsibility.\n   * Project Management, Manage end-to-end design projects, from concept to completion, adhering to deadlines and maintaining quality standards while adapting to evolving requirements.\n\n RETAIL SALES ASSISTANT       MARCH 2023 - APRIL 2023 (1 MONTHS)\n\n LC Waikiki IOI City Mall\n\n    Provided exceptional customer service by assisting shoppers with inquiries, locating merchandise, and ensuring a high level of customer satisfaction.\n   * Actively participated in visual merchandising tasks, contributing to an attractive store layout and product displays that enhanced the overall shopping experience. \n   * Handled cash transactions with precision and efficiency, showcasing strong attention to detail and reliability in financial matters. \n   * Collaborated effectively with colleagues to achieve and exceed sales targets, maintaining the store's reputation for excellence in customer service and sales performance. \n   * Gained valuable experience in retail operations, further developing my interpersonal and organizational skills while contributing to the store's daily operations and success\n\n 3D DESIGNER       DECEMBER 2022   MARCH 2023 (4 MONTHS)\n\n Maju Home Concept\n\n   *AR Content Creation, Designed and developed interactive 3D models and AR content to enhance the user experience within the Maju Home Concept application.\n   * Product Visualization, Transformed physical products into AR-ready digital representations, allowing customers to visualize furniture and decor items in their real-world environment. \n   * Optimization and Integration, Ensured seamless integration of 3D assets into the AR application's user interface while optimizing assets for optimal performance across various devices. \n   * Customization and Quality Assurance, Enabled customization options for users to tailor the appearance and placement of virtual items and conducted thorough testing to ensure a glitch free experience. \n   * Collaboration and Innovation , Worked closely with cross-functional teams, staying updated with emerging AR technologies and delivering exceptional AR experiences that met or exceeded client expectations\n\n JUNIOR DESIGNER INTERNSHIP PROGRAM       MARCH 2022 - JULY 2022 (6 MONTHS)\n\n TT Racing Sdn Bhd\n\n   * Product Design and Development: During my internship, I worked closely with the team on a unique project, collaborating with Disney to create a product centered around the Marvel theme. I actively contributed to the product design process, helping to conceptualize, sketch, and develop 3D models of innovative and captivating merchandise that adhered to Disney's high-quality standards. \n   * Packaging Design: Besides product design, I gained valuable experience in packaging design. I was responsible for creating visually appealing and  informative packaging designs that showcased the Marvel-themed product effectively and ensured the product's safety and integrity during transit.\n   * Graphic Design: My internship also allowed me to enhance my graphic design skills. I was involved in creating marketing collateral, promotional materials, and digital assets that effectively communicated the Marvel-themed product's features and benefits to potential customers.\n    Research and Development: I actively participated in research efforts on the MDEC Global Technology\n    Grant for smart ergonomic solutions. This included conducting market research, gathering data, and assisting in developing concepts for smart ergonomic seats, smart ergonomic desks, and smart monitor arms. My research contributions played a crucial role in shaping the direction of these projects.\n   * Collaborative Environment:  Throughout my internship, I  collaborated with a  diverse team of professionals, including product managers, graphic designers, engineers, and researchers. This experience allowed  me to work in  a  dynamic, cross-functional environment where I learned the importance of effective communication and teamwork in achieving project goals\n\n MULTIPLE POSITION       SEPTEMBER 2018 - MARCH 2021 ( 2 YEARS 6 MONTHS)\n\n Saha Coffee Sdn Bhd\n\n Position: Waiter (September 2018 - December 2019)\n   * Exceptional Customer Service: Provided outstanding service by taking orders, ensuring order accuracy and creating memorable dining experiences.\n   * Team Collaboration: Worked seamlessly with colleagues and kitchen staff to maintain smooth dining operations.\n   * Detail-oriented: Paid meticulous attention to customer requests and dietary needs.\n   * Sales and Promotion: Actively promoted menu items and contributed to increased sales.\n Position: Barista (January 2020 - June 2020)\n   * Coffee Expertise: Mastered coffee preparation, consistently delivering high-quality beverages.\n   * Equipment Proficiency: Operated and maintained coffee equipment for optimal performance.\n   * Customization: Personalized coffee orders and honed latte art skills\n\n   * Inventory Management: Assisted in managing coffee inventory and supplies efficiently. \n Position: Store Manager (July 2020 - March 2021)\n   * Leadership: Provided guidance and support to the team , fostering a motivated work environment. Operational Management: Oversaw daily operations, staff scheduling, and inventory control.\n   * Customer Relations: Cultivated strong customer relationships and addressed feedback. Quality Assurance: Maintained high standards of food safety and hygiene.\n   * Profitability: Implemented cost-effective measures and optimized pricing for increased revenue.\n\n LEADERSHIP EXPERIENCES\n\n President of International SEED Show Case 2023       SEPTEMBER 2022 - AUGUST 2023 ( 1 YEARS)\n In my role as the President of the Showcase Department at Universiti Putra Malaysia for the \"International\n SEED Showcase 2023,\" I:\n\n  * Developed the theme \"Enhancing Hyper Customization through Circular Design.\"\n    Coordinated 39 final-year projects in collaboration with 17 industry companies. \n    Facilitated participation from three international universities. \n    Managed the event budget effectively.\n    Led a diverse team , overseeing various aspects of the event.\n    Ensured a seamless event planning and execution process. \n    Launched a comprehensive promotional campaign. \n  * Organized engaging activities for attendees. \n    Adapted quickly to address unforeseen challenges. \n  * Gathered valuable feedback post-event for future improvements.\n\n President of ENTREPRENEURSHIP CLUB 2022       SEPTEMBER 2022 - MARCH 2023 ( 6 MONTHS)\n    As President of the Entrepreneurship Club at the University of Putra Malaysia from September 2022 to\n    March 2023, I led the club with a strategic vision, fostering a culture of entrepreneurship on campus. I built a dedicated team , organized impactful events, facilitated workshops, and created opportunities for networking and mentorship. Through effective marketing, budget management, and community engagement, I enhanced the club's influence and provided valuable resources for aspiring student\n\n    entrepreneurs\n\n PROJECT AND INVOLVEMENTS\n\n BACHELOR DEGREE'S PROJECT COLLOBRATE WITH LONGE MEDIKAL SDN BHD       SEPTEMBER\n 2022 - AUGUST 2023 ( 1 YEARS)\n\n  * Collaborated with Longe Medikal Sdn Bhd on a year-long project to develop an exoskeleton bone support system for upper limb disorders. \n  * Conducted extensive research to identify the challenges individuals with upper limb disorders face, shaping project objectives. \n  * Utilized innovative lattice design techniques to create a lightweight and efficient exoskeleton that provided optimal support and comfort.\n    Actively oversaw the prototyping phase, ensuring the exoskeleton's functionality and real-world effectiveness\n\n  * Conducted in-depth technical research into materials, biomechanics, and ergonomics to inform design decisions.\n\n    Rigorously tested the exoskeleton with users, iteratively improving its usability based on feedback. \n    Maintained detailed project records for transparency and accountability. \n  * Presented project updates and findings to academic advisors and industry partners. Demonstrated adaptability and creative problem-solving in overcoming design challenges. \n  * Collaborated with a multidisciplinary team, incorporating diverse perspectives into the project.\n  * Ensured ethical compliance, meeting safety and regulatory standards. \n    Successfully delivered  a functional exoskeleton, potentially benefiting  individuals with upper limb disorders.\n\n SKILLS & CERTIFICATE\n\n Software:\n\n AutoCAD (Advance), SolidWorks (Advance), SketchUp (Basic), Rhino (Basic), Adobe Creative Suite (Advance),\n KeyShot Advance), and Fusion 360 (Basic). Microsoft Office Suite (Advance), AutoDesk Inventor (Advance),\n 3ds Max (Advance), Revit (Basic), Adobe After Effects ( Basic) and Fusion 360 CAM (Basic).\n Language:\n Malay language (Fluent, English (Fluent).\n\n",
        ParserInfo: {
            ConverterRelease: '0.25.0.81853',
            ParserConfiguration:
                '{max_len=30000} {tel_flag=} {send_zip=} {fast_conv=} {DEF_LOCAL=} {sdate=0} {no_email_body=0} {do_clever_zoning=0} {keep_zone_span=0} {keep_span=1} {complex=0} {accept_langs=} {not_accept_langs=} {prefer_lang_cv=} {pers_only=0} {projects_off=0} {tree_search_on=0} {all_skills=1} {turbo=0} {known_layouts_only=0} {split_language=0} {picture=0} {picture_inline=0} {debug=0} {ocr_allowed=1} {max_pages=8} {geo_allowed=0} {geo_service=daxtra} {jss_model_addr=r-and-d-test.daxtra.com:5026} {pdf_model_addr=r-and-d-test.daxtra.com:5025} {vs_model_host=0.0.0.0:80} {name_space=0} {charset=} {hrxml_upgrade_edu_hist=0}{hrxml_add_languages_section=1}{spool=} {docID=} {user=API_TEST} ',
            ParserRelease: '0.32.0.81887',
            ParserReleaseDate: '2023-09-28',
            ConverterReleaseDate: '2023-09-27',
            ParserSchema: '2.0.40',
        },
    },
};

const exampleDataRetrieveFromDaxtraJsonS3 = {
    ...exampleDaxtraOutput.Resume,
};

const fileUploadOutput: UploadingFileResponseDto = {
    bucket_name: 'pulsifi-sandbox-document-upload',
    file_extension: 'png',
    file_name: 'document.png',
    file_path:
        'https://pulsifi-sandbox-document-upload.s3-ap-southeast-1.amazonaws.com/candidate/file_b/document.png',
    key: 'candidate/file_b/document.png',
};

const mockResumeUploadS3Event: S3Event = {
    Records: [
        {
            eventVersion: '2.1',
            eventSource: 'aws:s3',
            awsRegion: 'us-east-1',
            eventTime: '2023-09-29T12:00:00.000Z',
            eventName: 'ObjectCreated:Put',
            userIdentity: {
                principalId: 'AWS:EXAMPLE',
            },
            requestParameters: {
                sourceIPAddress: 'null',
            },
            responseElements: {
                'x-amz-request-id': 'EXAMPLE123456789',
                'x-amz-id-2': 'EXAMPLE123/4567EXAMPLE123456789',
            },
            s3: {
                s3SchemaVersion: '1.0',
                configurationId: 'testConfigRule',
                bucket: {
                    name: 'pulsifi-sandbox-document-upload',
                    ownerIdentity: {
                        principalId: 'A1AWTLIGJ6V9Y7',
                    },
                    arn: 'arn:aws:s3:::pulsifi-sandbox-document-upload',
                },
                object: {
                    key: 'candidate/bd3bfe85-b1cb-47bc-a352-1a3999ccd4e2_3592404140/resume.pdf',
                    size: 534,
                    eTag: 'b28880b44bd66e175a2e0563edadfff9',
                    sequencer: '0065164DA18A778B2D',
                },
            },
        },
    ],
};

const mockResumeUploadEvent = {
    resource: '/document/v1.0/resume_upload',
    path: '/document/v1.0/resume_upload',
    httpMethod: 'POST',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '37kzxo',
        authorizer: {
            scope: 'admin',
            principalId: 'cdddc3d2-a840-46ba-b551-374f542df267',
            integrationLatency: 432,
        },
        resourcePath: '/document/v1.0/resume_upload',
        httpMethod: 'POST',
        extendedRequestId: 'M5BrwEetSQ0Fhag=',
        requestTime: '16/Oct/2023:10:54:02 +0000',
        path: '/document/v1.0/resume_upload',
        accountId: '434343955077',
        protocol: 'HTTP/1.1',
        stage: 'sandbox',
        domainPrefix: 'sandbox',
        requestTimeEpoch: 1697453642942,
        requestId: '350cea61-aa1d-45a4-b16a-a5634954a219',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: 'null',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.33.0',
            user: null,
            apiKey: null,
            apiKeyId: null,
            clientCert: null,
        },
        domainName: 'sandbox.api.pulsifi.me',
        apiId: '0ouv5vs49j',
    },
    body: {},
    isBase64Encoded: true,
};

const daxtraAxiosResponse = testUtil.mockAxiosResponse(exampleDaxtraOutput);

export const testData = {
    mockResumeUploadS3Event,
    getItemExampleOutput,
    exampleDaxtraOutput,
    daxtraAxiosResponse,
    fileUploadOutput,
    exampleDataRetrieveFromDaxtraJsonS3,
    mockResumeUploadEvent,
};
