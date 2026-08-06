import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthErrorMessage } from '../../components/auth/AuthErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LogIn, Briefcase, Building, UserCheck, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, role: userRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (userRole === 'employer') {
        navigate('/dashboard', { replace: true });
      } else if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, userRole, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password, rememberMe });
      setIsLoading(false);
      
      const userRole = response.user.role;
      showSuccessToast(`Welcome back! Signed in as ${userRole === 'employer' ? 'Employer' : userRole === 'admin' ? 'Admin' : 'Candidate'}.`);
      
      if (userRole === 'employer') {
        navigate('/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/jobs');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to sign in. Please verify your credentials.');
    }
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Sign in to CareerConnect"
        subtitle="Access your job application status, saved roles, or recruiter dashboard."
        icon={Briefcase}
      >
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('job_seeker');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'job_seeker'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Job Seeker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('employer');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedRole === 'employer'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Employer</span>
          </button>
        </div>

        {/* Auth Error Banner */}
        <AuthErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <RouterLink to="/forgot-password" className="font-semibold text-blue-600 hover:underline">
              Forgot password?
            </RouterLink>
          </div>

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              icon={LogIn}
              isLoading={isLoading}
            >
              Sign In as {selectedRole === 'job_seeker' ? 'Candidate' : 'Employer'}
            </PrimaryButton>
          </div>
        </form>

        {/* Link to Register */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <RouterLink to="/register" className="font-bold text-blue-600 hover:underline">
              Create an account
            </RouterLink>
          </p>
        </div>

      </AuthCard>

    </PageContainer>
  );
};
