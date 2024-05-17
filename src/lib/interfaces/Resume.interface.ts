/* eslint-disable @typescript-eslint/naming-convention */

export interface Resume {
    src: string;
    TextResume: string;
    ExperienceSummary: ResumeExperienceSummary;
    FileStruct: ResumeFileStruct;
    ParserInfo: ResumeParserInfo;
    TextZones?: Array<ResumeTextZone>;
    StructuredResume: StructuredResume;
    EmailTrackingData?: ResumeEmailTrackingData;
}

export interface ResumeEmailTrackingData {
    EmailData: string;
    EmailSubject: string;
    RecipientsEmail: string;
    SendersEmail: string;
}

export interface ResumeTextZone {
    Header: string;
    content: string;
}

export interface ResumeExperienceSummary {
    ExecutiveBrief: string;
    TotalMonthsOfWorkExperience?: number;
    TotalYearsOfWorkExperience?: number;
    HighestEducationalLevel?: string;
    ManagementRecord?: string;
    TotalMonthsOfLowLevelManagementWorkExperience?: number;
    TotalMonthsOfMidLevelManagementWorkExperience?: number;
    TotalMonthsOfManagementWorkExperience?: number;
    TotalMonthsOfSeniorManagementWorkExperience?: number;
    TotalYearsOfLowLevelManagementWorkExperience?: number;
    TotalYearsOfManagementWorkExperience?: number;
    TotalYearsOfMidLevelManagementWorkExperience?: number;
    TotalYearsOfSeniorManagementWorkExperience?: number;
}

export interface ResumeFileStruct {
    filename: string;
    attachment?: Array<ResumeFileStructAttachment>;
    picture?: {
        content?: string;
        'content-disposition'?: string;
        'content-transfer-encoding'?: string;
        'content-type'?: string;
    };
}

export interface ResumeFileStructAttachment {
    best_cat?: string;
    cat_score?: string;
    conv_msg?: string;
    is_email_body?: string;
    main_cv?: string;
    mime?: string;
    content: string;
    conv?: string;
    doc_type: string;
    fname: string;
    ftype: string;
    lang: string;
}

export interface ResumeParserInfo {
    ConverterRelease: string;
    ConverterReleaseDate: string;
    ParserConfiguration: string;
    ParserRelease: string;
    ParserReleaseDate: string;
    ParserSchema: string;
}

export interface StructuredResume {
    Achievements?: Array<string>;
    Available?: string;
    Competency?: Array<StructuredResumeCompetency>;
    ContactMethod?: StructuredResumeContactMethod;
    DOB?: string;
    EducationHistory?: Array<StructuredResumeEducationHistory>;
    EmploymentHistory?: Array<StructuredResumeEmploymentHistory>;
    ExecutiveSummary?: string;
    Hobbies?: string;
    Languages?: Array<StructuredResumeLanguage>;
    LegalDocuments?: Array<StructuredResumeLegalDocument>;
    LicensesAndCertifications?: Array<StructuredResumeLicenseOrCertification>;
    MaritalStatus?: string;
    Nationality?: Array<string>;
    OtherInfo?: string;
    PatentHistory?: Array<{
        Description: string;
    }>;
    PersonName?: StructuredResumePersonName;
    PlaceOfBirth?: DaxtraLocationSummary;
    PoliticalStatus?: string;
    PreferredLocation?: string;
    PreferredPosition?: string;
    PreferredPositionType?: StructuredResumePreferredPositionType;
    PreferredTypeOfHours?: StructuredResumePreferredTypeOfHours;
    ProjectHistory?: StructuredResumeEmploymentHistory;
    PublicationHistory?: Array<StructuredResumePublicationHistory>;
    Race?: string;
    References?: Array<StructuredResumeReference>;
    RegisteredResidence?: DaxtraLocationSummary;
    Religion?: string;
    RevisionDate?: string;
    Salary_current?: StructuredResumeSalary;
    Salary_desired?: StructuredResumeSalary;
    UserFields?: Array<StructureResumeUserField>;
    WillRelocate?: boolean;
    lang?: string;
}

export interface StructuredResumeCompetency {
    TaxonomyId?: {
        idOwner: string;
        description: string;
    };
    auth: boolean;
    description: string;
    lastUsed?: string;
    skillAliasArray?: Array<string>;
    skillLevel: number;
    skillName: string;
    skillProficiency?: string;
    skillUsed?: {
        value: number;
        type: string;
    };
    skillCount?: number;
    Grade?: string;
    CompetencyId?: {
        idOwner: string;
        id: string;
    };
}

export interface StructuredResumeContactMethod {
    InternetWebAddress?: Array<{
        content: string;
        type: string;
    }>;
    InternetEmailAddress_main?: string;
    InternetEmailAddress_alt?: string;
    Telephone_home?: string;
    Telephone_work?: string;
    Telephone_alt?: string;
    Telephone_mobile?: string;
    Pager?: string;
    Fax?: string;
    PostalAddress_main?: DaxtraLocationSummary;
    PostalAddress_alt?: DaxtraLocationSummary;
}

export interface DaxtraLocationSummary {
    CountryCode?: string;
    Municipality?: string;
    Region?: string;
    AddressLine?: string;
    PostalCode?: string;
}

export interface StructuredResumeEducationHistory {
    StartDate?: string;
    EndDate?: string;
    MeasureValue?: string;
    Major?: string;
    SchoolUnit?: string;
    Degree?: {
        degreeType?: string;
        DegreeName?: string;
        DegreeDate?: string;
    };
    LocationSummary?: DaxtraLocationSummary;
    schoolType?: string;
    Comments?: string;
    SchoolName?: string;
}

export interface StructuredResumeEmploymentHistory {
    StartDate?: string;
    EndDate?: string;
    LocationSummary?: DaxtraLocationSummary;
    InternetDomainName?: string;
    EmployerOrgName?: string;
    employerOrgType?: string;
    PositionType?: string;
    MonthsOfWork?: number;
    Timelinenumber?: number;
    Title?: Array<string>;
    ReasonForLeaving?: string;
    OrgIndustry?: {
        IndustryDescription?: string;
        primaryIndicator?: boolean;
    };
    JobArea?: string;
    JobGrade?: string;
    Project?: string;
    OrgName?: string;
    Description?: string;
}

export interface StructuredResumeLanguage {
    CompetencyId?: {
        id?: string;
        idOwner?: string;
    };
    LanguageCode?: string;
    Proficiency?: string;
    Read?: boolean;
    Speak?: boolean;
    Write?: boolean;
}

export interface StructuredResumeLegalDocument {
    IssueAuthority?: string;
    IssueCountryCode?: string;
    IssueDate?: string;
    IssueLocationSummary?: DaxtraLocationSummary;
    number?: string;
    type?: string;
}

export interface StructuredResumeLicenseOrCertification {
    Description?: string;
    EffectiveDate?: {
        ValidFrom?: string;
        ValidTo?: string;
        FirstIssuedDate?: string;
    };
    Id?: string;
    IssuingAuthority?: {
        IssuingAuthorityName?: string;
        countryCode?: string;
    };
    LicensesOrCertificationName?: string;
}

export interface StructuredResumePersonName {
    FormattedName?: string;
    Title?: string;
    Suffix?: string;
    FamilyName?: string;
    GivenName?: string;
    PreferredGivenName?: string;
    sex?: string;
    MiddleName?: Array<string>;
    AlternateScript?: {
        FormattedName?: string;
        Title?: string;
        Suffix?: string;
        FamilyName?: string;
        GivenName?: string;
        PreferredGivenName?: string;
        script?: string;
        MiddleName?: Array<string>;
        sex?: string;
    };
}

export interface StructuredResumePreferredPositionType {
    CONTRACT?: boolean;
    PERMANENT?: boolean;
    TEMPORARY?: boolean;
}

export interface StructuredResumePreferredTypeOfHours {
    FULLTIME?: boolean;
    PARTTIME?: boolean;
}

export interface StructuredResumePublicationHistory {
    Comments?: string;
    content?: Array<string>;
    Issue?: string;
    JournalOrSerialName?: string;
    Volume?: string;
    Pagenumber?: string;
    Name?: Array<{
        FormattedName: string;
        role: string;
    }>;
    Title?: Array<string>;
    PublicationDate?: string;
}

export interface StructuredResumeReference {
    CompanyName?: string;
    ContactMethod?: StructuredResumeContactMethod;
    PersonName?: StructuredResumePersonName;
    PositionTitle?: string;
}

export interface StructuredResumeSalary {
    currency?: string;
    amount?: number;
    hiamount?: number;
    period?: string;
}

export interface StructureResumeUserField {
    FieldName?: string;
    Label?: string;
    Type?: string;
    Value?: string;
}
