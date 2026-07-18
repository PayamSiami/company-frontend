// frontend-company/src/types/index.ts

// ✅ Export all DTOs
export type {
  // Auth DTOs
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ChangePasswordDto,
  ResendVerificationDto,
  SocialLoginDto,
  UpdateProfileDto,
  
  // Company DTOs
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
  
  // Job DTOs
  CreateJobDto,
  UpdateJobDto,
  JobFiltersDto,
  
  // Application DTOs
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  ApplicationFiltersDto,
  BulkApplicationUpdateDto,
  
  // Dashboard DTOs
  DashboardStatsDto,
  AIScreeningDataDto,
  ApplicationStatsDto,
  RecentActivityDto,
  
  // AI DTOs
  AIJobGenerationDto,
  AIScreeningRequestDto,
  AIScreeningResponseDto,
  AISalarySuggestionDto,
  AISalarySuggestionResponseDto,
  AIResumeAnalysisDto,
  AIResumeAnalysisResponseDto,
  AIInterviewQuestionsDto,
  AIInterviewQuestionsResponseDto,
  
  // Candidate DTOs
  CandidateResponseDto,
  CandidateFiltersDto,
  
  // Resume DTOs
  CreateResumeDto,
  UpdateResumeDto,
  ResumeResponseDto,
  
  // Notification DTOs
  NotificationResponseDto,
  NotificationFiltersDto,
  
  // Pagination DTOs
  PaginatedResponseDto,
  PaginationParamsDto,
} from './dto.types';

// ✅ Export all Model Types
export type {
  ICompany,
  IJob,
  IApplication,
  ICandidate,
  IUser,
  IResume,
  INotification,
} from './model.types';

// ✅ Export all Enums (as values, not types)
export {
  ApplicationStatus,
  JobStatus,
  JobType,
  WorkMode,
  ExperienceLevel,
  UserRole,
  UserStatus,
  ResumeTemplate,
  ResumeVisibility,
  ProficiencyLevel,
  CompanyStatus,
} from './model.types';