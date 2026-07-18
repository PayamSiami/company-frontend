// frontend-company/src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CompanyLayout } from './components/common/Layout/CompanyLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { JobsAnalyticsPage, JobsPage } from './pages/Jobs';
import { ApplicationsPage } from './pages/Applications';
import { CandidatesPage } from './pages/Candidates';
import { SettingsPage } from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import CandidateRecommendations from './pages/Candidates/CandidateRecommendations';
import { AIAnalyticsPage, AIPage } from './pages/AI';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard/Index'));
const JobDetailPage = React.lazy(() => import('./pages/Jobs/[id]'));
const ApplicationDetailPage = React.lazy(() => import('./pages/Applications/[id]'));
const ScreeningPage = React.lazy(() => import('./pages/Applications/Screening'));
const CandidateProfilePage = React.lazy(() => import('./pages/Candidates/[id]'));
const AIScreeningPage = React.lazy(() => import('./pages/AI/Screening'));
const AIAssistantPage = React.lazy(() => import('./pages/AI/Assistant'));
const CompanyProfilePage = React.lazy(() => import('./pages/Company/Profile'));
const LoginPage = React.lazy(() => import('./pages/Auth/Login'));

export const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Company Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Job Routes */}
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="jobs/analytics" element={<JobsAnalyticsPage />} />

          {/* Application Routes */}
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="applications/screening" element={<ScreeningPage />} />

          {/* Candidate Routes */}
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/recommendations" element={<CandidateRecommendations />} />
          <Route path="candidates/:id" element={<CandidateProfilePage />} />

          {/* AI Routes */}
          <Route path="ai" element={<AIPage />} />
          <Route path="ai/screening" element={<AIScreeningPage />} />
          <Route path="ai/assistant" element={<AIAssistantPage />} />
          <Route path="ai/analytics" element={<AIAnalyticsPage />} />

          {/* Company Routes */}
          <Route path="company/profile" element={<CompanyProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </React.Suspense>
  );
};