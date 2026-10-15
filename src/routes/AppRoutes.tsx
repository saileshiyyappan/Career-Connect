import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { UserLayout } from '../layout/UserLayout';
import { EmployerLayout } from '../layout/EmployerLayout';
import { AdminLayout } from '../layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { EmailVerificationPage } from '../pages/auth/EmailVerificationPage';
import { VerificationSuccessPage } from '../pages/auth/VerificationSuccessPage';
import { SessionExpiredPage } from '../pages/auth/SessionExpiredPage';
import { UnauthorizedPage } from '../pages/auth/UnauthorizedPage';
import { OnboardingWizardPage } from '../pages/onboarding/OnboardingWizardPage';
import { JobsPage } from '../pages/jobs/JobsPage';
import { JobDetailsPage } from '../pages/job-details/JobDetailsPage';
import { NewsPage } from '../pages/news/NewsPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

// Employer Portal Pages
import { EmployerDashboardPage } from '../pages/employer/EmployerDashboardPage';
import { CompanyProfilePage } from '../pages/employer/CompanyProfilePage';
import { ManageJobsPage } from '../pages/employer/ManageJobsPage';
import { PostJobPage } from '../pages/employer/PostJobPage';
import { HiringPipelinePage } from '../pages/employer/HiringPipelinePage';
import { EmployerInterviewsPage } from '../pages/employer/EmployerInterviewsPage';
import { OfferManagementPage } from '../pages/employer/OfferManagementPage';
import { EmployerAnalyticsPage } from '../pages/employer/EmployerAnalyticsPage';
import { TeamManagementPage } from '../pages/employer/TeamManagementPage';
import { EmployerSettingsPage } from '../pages/employer/EmployerSettingsPage';
import { EmployerNotificationsPage } from '../pages/employer/EmployerNotificationsPage';
import { CompanyPage } from '../pages/employer/CompanyPage';
import { HiringCampaignsPage } from '../pages/employer/HiringCampaignsPage';
import { EmployerNewsPage } from '../pages/employer/EmployerNewsPage';
import { EmployerProfilePage } from '../pages/employer/EmployerProfilePage';
import { ApplicantsHubPage } from '../pages/employer/ApplicantsHubPage';

// Admin Portal Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { EmployerManagementPage } from '../pages/admin/EmployerManagementPage';
import { JobModerationPage } from '../pages/admin/JobModerationPage';
import { ApplicationMonitoringPage } from '../pages/admin/ApplicationMonitoringPage';
import { ReportsModerationPage } from '../pages/admin/ReportsModerationPage';
import { SystemAnalyticsPage } from '../pages/admin/SystemAnalyticsPage';
import { ContentManagementPage } from '../pages/admin/ContentManagementPage';
import { AnnouncementsPage } from '../pages/admin/AnnouncementsPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

import { ApplicationsPage } from '../pages/applications/ApplicationsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { SavedJobsPage } from '../pages/jobs/SavedJobsPage';
import { JobAlertsPage } from '../pages/alerts/JobAlertsPage';
import { InterviewCenterPage } from '../pages/interviews/InterviewCenterPage';
import { ResumePage } from '../pages/resume/ResumePage';
import { CareerInsightsPage } from '../pages/insights/CareerInsightsPage';
import { JobPreferencesPage } from '../pages/settings/JobPreferencesPage';
import { AboutPage } from '../pages/about/AboutPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { FaqPage } from '../pages/faq/FaqPage';
import { PrivacyPolicyPage } from '../pages/legal/PrivacyPolicyPage';
import { TermsPage } from '../pages/legal/TermsPage';
import { NotFoundPage } from '../pages/not-found/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes Wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/verify-success" element={<VerificationSuccessPage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/onboarding" element={<OnboardingWizardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/job/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/company/:id" element={<CompanyPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Common Authenticated Routes */}
      <Route element={<ProtectedRoute allowedRoles={['job_seeker', 'employer', 'admin']} />}>
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Protected Candidate Workspace Routes */}
      <Route element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
        <Route element={<UserLayout />}>
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
          <Route path="/alerts" element={<JobAlertsPage />} />
          <Route path="/interviews" element={<InterviewCenterPage />} />
          <Route path="/resumes" element={<ResumePage />} />
          <Route path="/insights" element={<CareerInsightsPage />} />
          <Route path="/job-preferences" element={<JobPreferencesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Protected Employer Portal Routes */}
      <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
        <Route element={<EmployerLayout />}>
          <Route path="/dashboard" element={<EmployerDashboardPage />} />
          <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
          <Route path="/employer/applicants" element={<ApplicantsHubPage defaultTab="applicants" />} />
          <Route path="/employer/find-seekers" element={<ApplicantsHubPage defaultTab="find-seekers" />} />
          <Route path="/employer/candidates" element={<ApplicantsHubPage defaultTab="database" />} />
          <Route path="/employer/saved-candidates" element={<ApplicantsHubPage defaultTab="saved" />} />
          <Route path="/employer/talent-sources" element={<ApplicantsHubPage defaultTab="sources" />} />
          <Route path="/employer/campaigns" element={<HiringCampaignsPage />} />
          <Route path="/employer/news" element={<EmployerNewsPage />} />
          <Route path="/employer/profile" element={<EmployerProfilePage />} />
          <Route path="/employer/company" element={<CompanyProfilePage />} />
          <Route path="/my-jobs" element={<ManageJobsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/employer/pipeline" element={<HiringPipelinePage />} />
          <Route path="/employer/interviews" element={<EmployerInterviewsPage />} />
          <Route path="/employer/offers" element={<OfferManagementPage />} />
          <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
          <Route path="/employer/team" element={<TeamManagementPage />} />
          <Route path="/employer/settings" element={<EmployerSettingsPage />} />
          <Route path="/employer/notifications" element={<EmployerNotificationsPage />} />
        </Route>
      </Route>

      {/* Protected Admin Control Center Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/employers" element={<EmployerManagementPage />} />
          <Route path="/admin/jobs" element={<JobModerationPage />} />
          <Route path="/admin/applications" element={<ApplicationMonitoringPage />} />
          <Route path="/admin/moderation" element={<ReportsModerationPage />} />
          <Route path="/admin/analytics" element={<SystemAnalyticsPage />} />
          <Route path="/admin/content" element={<ContentManagementPage />} />
          <Route path="/admin/announcements" element={<AnnouncementsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* 404 Catch All Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
