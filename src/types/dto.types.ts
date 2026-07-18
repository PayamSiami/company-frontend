// frontend-company/src/types/dto.types.ts

// ==================== AUTH DTOs ====================

export interface LoginDto {
  email: string;
  password: string;
}

export type ResumeTemplate = 
  | "professional"
  | "modern"
  | "creative"
  | "minimal"
  | "executive"
  | "technical";

export type ResumeVisibility = 
  | "public"
  | "private"
  | "employers-only";
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: "EMPLOYER" | "CANDIDATE";
  companyName?: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken?: string;
  user: {
    _id: string;
    email: string;
    fullName: string;
    role: "employer";
    companyId?: string;
    phone?: string;
    profileImage?: string;
    emailVerified?: boolean;
    createdAt: string;
  };
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResendVerificationDto {
  email: string;
}

export interface SocialLoginDto {
  provider: "google" | "linkedin";
  token: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  profileImage?: string;
}

// ==================== COMPANY DTOs ====================

export interface CreateCompanyDto {
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  status?: string;
}

export interface CompanyResponseDto {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  status: string;
  verified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== JOB DTOs ====================

export interface CreateJobDto {
  title: string;
  company: string; // ✅ Added - required by backend
  description: string;
  location: string; // ✅ Changed from object to string
  salary?: number; // ✅ Added - optional
  minSalary?: number; // ✅ Added - optional
  maxSalary?: number; // ✅ Added - optional
  requirements?: string; // ✅ Changed from array to string
  responsibilities?: string; // ✅ Changed from array to string
  benefits?: string; // ✅ Changed from array to string
  skills?: string[]; // ✅ Optional
  tags?: string[]; // ✅ Optional
  jobType?: string; // ✅ Optional
  workMode?: string; // ✅ Optional
  experienceLevel?: string; // ✅ Optional
  openings?: number; // ✅ Optional
  applicationDeadline?: string; // ✅ Optional
  expiresAt?: string;
  postedBy?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
  status?: string;
  isActive?: boolean;
}

export interface JobFiltersDto {
  status?: string;
  isActive?: boolean;
  jobType?: string;
  workMode?: string;
  experienceLevel?: string;
  minSalary?: number;
  maxSalary?: number;
  location?: string;
  skills?: string[];
}

// ==================== APPLICATION DTOs ====================

export interface CreateApplicationDto {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
  expectedSalary?: number;
  availableFrom?: string;
}

export interface UpdateApplicationStatusDto {
  status: string;
  notes?: string;
  interviewDetails?: {
    scheduledDate: string;
    duration?: number;
    location?: string;
    meetingLink?: string;
    notes?: string;
  };
}

export interface ApplicationFiltersDto {
  status?: string;
  jobId?: string;
  minScore?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface BulkApplicationUpdateDto {
  ids: string[];
  status: string;
  notes?: string;
}

// ==================== DASHBOARD DTOs ====================

export interface DashboardStatsDto {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  shortlistedCandidates: number;
  rejectedCandidates: number;
  aiScreenedCount: number;
  screeningCoverage: number;
  recentActivities: {
    id: string;
    candidateName: string;
    jobTitle: string;
    status: string;
    timestamp: string;
    aiScore?: number;
  }[];
}

export interface AIScreeningDataDto {
  screeningCoverage: number;
  totalCandidatesScreened: number;
  candidatesNotScreened: number;
  screeningHistory: {
    jobId: string;
    jobTitle: string;
    totalApplicants: number;
    screenedCount: number;
    avgScore: number;
    postedDate: string;
  }[];
  pendingScreening: {
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedDate: string;
  }[];
}

export interface ApplicationStatsDto {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  rejected: number;
  hired: number;
  interviewScheduled: number;
  averageAIScore: number;
  screeningCoverage: number;
}

export interface RecentActivityDto {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  timestamp: string;
  aiScore?: number;
}

// ==================== AI DTOs ====================

export interface AIJobGenerationDto {
  jobTitle: string;
  companyName?: string;
  field:
    | "description"
    | "requirements"
    | "responsibilities"
    | "benefits"
    | "skills"
    | "summary";
}

export interface AIScreeningRequestDto {
  applicationId: string;
}

export interface AIScreeningResponseDto {
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  overallMatch: number;
  suggestions: string[];
  screenedAt: string;
}

export interface AISalarySuggestionDto {
  jobTitle: string;
  location?: string;
  experienceLevel?: string;
}

export interface AISalarySuggestionResponseDto {
  min: number;
  max: number;
  currency: string;
  period: "YEARLY" | "MONTHLY" | "HOURLY";
  confidence: number;
  marketData: {
    average: number;
    range: {
      low: number;
      high: number;
    };
  };
}

export interface AIResumeAnalysisDto {
  resumeId: string;
  jobId: string;
}

export interface AIResumeAnalysisResponseDto {
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  overallMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  summary: string;
}

export interface AIInterviewQuestionsDto {
  jobId: string;
  candidateId: string;
  count?: number;
}

export interface AIInterviewQuestionsResponseDto {
  questions: {
    category: "technical" | "behavioral" | "general";
    question: string;
    difficulty: "easy" | "medium" | "hard";
    expectedAnswer?: string;
    tips?: string;
  }[];
}

// ==================== CANDIDATE DTOs ====================

export interface CandidateResponseDto {
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
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }[];
  resumes: {
    _id: string;
    title: string;
    isDefault: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateFiltersDto {
  search?: string;
  skills?: string[];
  location?: string;
  minExperience?: number;
  maxExperience?: number;
}

// ==================== RESUME DTOs ====================

export interface CreateResumeDto {
  title: string;
  template: string;
  visibility: string;
  isDefault?: boolean;
}

export interface UpdateResumeDto {
  title?: string;
  template?: string;
  visibility?: string;
  isDefault?: boolean;
  personalInfo?: {
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
}

export interface ResumeResponseDto {
  _id: string;
  candidateId: string;
  title: string;
  template: string;
  visibility: string;
  isDefault: boolean;
  personalInfo?: {
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
    employmentType: string;
    location?: string;
    startDate: string;
    endDate?: string;
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
    startDate: string;
    endDate?: string;
    isCurrentlyStudying: boolean;
    description?: string;
    displayOrder: number;
  }[];
  skills: {
    skillName: string;
    proficiency: string;
    yearsOfExperience?: number;
    displayOrder: number;
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    projectUrl?: string;
    sourceCodeUrl?: string;
    startDate: string;
    endDate?: string;
    isOngoing: boolean;
    displayOrder: number;
  }[];
  certifications: {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    displayOrder: number;
  }[];
  awards: {
    title: string;
    awardedBy: string;
    awardedDate: string;
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
  createdAt: string;
  updatedAt: string;
}

// ==================== NOTIFICATION DTOs ====================

export interface NotificationResponseDto {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface NotificationFiltersDto {
  type?: string;
  read?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ==================== PAGINATION DTOs ====================

export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParamsDto {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
