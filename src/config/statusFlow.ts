// frontend-company/src/config/statusFlow.ts
import { ApplicationStatus } from "../types";
import {
  Clock,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  UserMinus,
  Eye,
} from "lucide-react";

export interface StatusFlowConfig {
  label: string;
  labelFa: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  descriptionFa: string;
  nextStatuses: ApplicationStatus[];
  transitionMessage: string;
  transitionMessageFa: string;
  stage: "initial" | "review" | "shortlist" | "interview" | "final";
  progress: number;
}

export const STATUS_FLOW: Record<ApplicationStatus, StatusFlowConfig> = {
  [ApplicationStatus.PENDING]: {
    label: "Pending",
    labelFa: "در انتظار بررسی",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    description: "Application is waiting for review",
    descriptionFa: "درخواست جدید دریافت شده و در انتظار بررسی",
    nextStatuses: [
      ApplicationStatus.REVIEWING,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ],
    transitionMessage: "Application moved to review",
    transitionMessageFa: "درخواست وارد مرحله بررسی شد",
    stage: "initial",
    progress: 0,
  },

  [ApplicationStatus.REVIEWING]: {
    label: "Reviewing",
    labelFa: "در حال بررسی",
    icon: Eye,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
    description: "Application is being reviewed by the hiring team",
    descriptionFa: "درخواست در حال بررسی توسط تیم استخدام",
    nextStatuses: [
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ],
    transitionMessage: "Application reviewed and shortlisted",
    transitionMessageFa: "داوطلب انتخاب شد",
    stage: "review",
    progress: 25,
  },

  [ApplicationStatus.SHORTLISTED]: {
    label: "Shortlisted",
    labelFa: "انتخاب شده",
    icon: Star,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    description: "Candidate has been shortlisted for the next round",
    descriptionFa: "داوطلب برای مرحله بعدی انتخاب شده است",
    nextStatuses: [
      ApplicationStatus.INTERVIEWING,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ],
    transitionMessage: "Candidate shortlisted for interview",
    transitionMessageFa: "داوطلب برای مصاحبه انتخاب شد",
    stage: "shortlist",
    progress: 50,
  },

  [ApplicationStatus.INTERVIEWING]: {
    label: "Interviewing",
    labelFa: "در حال مصاحبه",
    icon: Calendar,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
    description: "Candidate is in the interview process",
    descriptionFa: "داوطلب در فرآیند مصاحبه قرار دارد",
    nextStatuses: [
      ApplicationStatus.HIRED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ],
    transitionMessage: "Candidate hired after interview",
    transitionMessageFa: "داوطلب استخدام شد",
    stage: "interview",
    progress: 75,
  },

  [ApplicationStatus.HIRED]: {
    label: "Hired",
    labelFa: "استخدام شده",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-700 dark:text-emerald-300",
    description: "Candidate has been hired",
    descriptionFa: "داوطلب استخدام شده است",
    nextStatuses: [],
    transitionMessage: "Candidate hired successfully",
    transitionMessageFa: "داوطلب با موفقیت استخدام شد",
    stage: "final",
    progress: 100,
  },

  [ApplicationStatus.REJECTED]: {
    label: "Rejected",
    labelFa: "رد شده",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    description: "Application has been rejected",
    descriptionFa: "درخواست داوطلب رد شده است",
    nextStatuses: [],
    transitionMessage: "Application rejected",
    transitionMessageFa: "درخواست رد شد",
    stage: "final",
    progress: 100,
  },

  [ApplicationStatus.WITHDRAWN]: {
    label: "Withdrawn",
    labelFa: "انصراف داده",
    icon: UserMinus,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-700",
    textColor: "text-gray-700 dark:text-gray-300",
    description: "Candidate has withdrawn their application",
    descriptionFa: "داوطلب از ادامه فرآیند انصراف داده است",
    nextStatuses: [],
    transitionMessage: "Application withdrawn by candidate",
    transitionMessageFa: "داوطلب از درخواست انصراف داد",
    stage: "final",
    progress: 100,
  },
};
