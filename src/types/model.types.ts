// frontend-company/src/types/model.types.ts

// ==================== ENUMS ====================

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  HIRED = "hired",
}

export const enum JobStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED",
  FILLED = "FILLED",
}

export const enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  REMOTE = "REMOTE",
}

export const enum WorkMode {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ON_SITE = "ON_SITE",
}

export const enum ExperienceLevel {
  ENTRY = "ENTRY",
  JUNIOR = "JUNIOR",
  MID_LEVEL = "MID_LEVEL",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
  EXECUTIVE = "EXECUTIVE",
}

export const enum UserRole {
  EMPLOYER = "employer",
}

export const enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export const enum ResumeTemplate {
  CLASSIC = "CLASSIC",
  MODERN = "MODERN",
  CREATIVE = "CREATIVE",
  MINIMAL = "MINIMAL",
  PROFESSIONAL = "PROFESSIONAL",
}

export const enum ResumeVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  LINK_ONLY = "LINK_ONLY",
}

export const enum ProficiencyLevel {
  BEGINNER = "BEGINNER",
  ELEMENTARY = "ELEMENTARY",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export const enum CompanyStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export const enum NotificationType {
  APPLICATION_STATUS = "APPLICATION_STATUS",
  JOB_POSTING = "JOB_POSTING",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  SYSTEM = "SYSTEM",
}

export const enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// ==================== MODEL INTERFACES ====================

// ✅ EXPORT ALL INTERFACES WITH 'export' keyword

export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  status: UserStatus;
  lastLogin?: Date | string;
  companyId?: string;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICompany {
  _id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  status: CompanyStatus;
  verified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IJob {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  companyId: string;
  employerId: string;
  category?: string;
  skills: string[];
  tags: string[];
  location: string;
  salaryRange: {
    min: number;
    max: number;
    currency?: string;
    period?: "YEARLY" | "MONTHLY" | "HOURLY";
  };
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  openings: number;
  applicationDeadline?: Date | string;
  expiresAt?: Date | string;
  isActive: boolean;
  publishedAt?: Date | string;
  closedAt?: Date | string;
  views: number;
  applications: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  applicationCount?: number;
  company: string;
}

export interface IApplication {
  _id: string;
  candidateId: string;
  jobId: string;
  resumeId: string;
  coverLetter?: string;
  expectedSalary?: number;
  availableFrom?: Date | string;
  status: ApplicationStatus;
  aiScore?: number;
  userId: any;
  aiScreeningData?: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    overallMatch: number;
    suggestions: string[];
    screenedAt: Date | string;
  };
  notes?: string;
  statusHistory: {
    status: ApplicationStatus;
    changedBy: string;
    notes?: string;
    timestamp: Date | string;
  }[];
  interviewDetails?: {
    scheduledDate: Date | string;
    duration?: number;
    location?: string;
    meetingLink?: string;
    interviewerId?: string;
    notes?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICandidate {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  location?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate: Date | string;
    endDate?: Date | string;
    description?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: Date | string;
    endDate?: Date | string;
  }[];
  resumes: {
    _id: string;
    title: string;
    isDefault: boolean;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IResume {
  _id: string;
  candidateId: string;
  title: string;
  template: ResumeTemplate;
  visibility: ResumeVisibility;
  isDefault: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    headline?: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    websiteUrl?: string;
  };
  summary?: string;
  workExperience: {
    companyName: string;
    companyLogo?: string;
    jobTitle: string;
    employmentType: JobType;
    location?: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentJob: boolean;
    description?: string;
    technologies: string[];
    displayOrder: number;
  }[];
  education: {
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startDate: Date | string;
    endDate?: Date | string;
    isCurrentlyStudying: boolean;
    description?: string;
    displayOrder: number;
  }[];
  skills: {
    skillName: string;
    proficiency: ProficiencyLevel;
    yearsOfExperience?: number;
    displayOrder: number;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    projectUrl?: string;
    sourceCodeUrl?: string;
    startDate: Date | string;
    endDate?: Date | string;
    isOngoing: boolean;
    displayOrder: number;
  }[];
  certifications: {
    name: string;
    issuingOrganization: string;
    issueDate: Date | string;
    expirationDate?: Date | string;
    credentialId?: string;
    credentialUrl?: string;
    displayOrder: number;
  }[];
  awards: {
    title: string;
    awardedBy: string;
    awardedDate: Date | string;
    description?: string;
    displayOrder: number;
  }[];
  languages: {
    languageName: string;
    proficiency: string;
    displayOrder: number;
  }[];
  completionScore: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: NotificationPriority;
  createdAt: Date | string;
  updatedAt: Date | string;
}
