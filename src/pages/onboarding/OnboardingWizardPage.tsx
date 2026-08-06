import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { ProgressStepper, StepItem } from '../../components/auth/ProgressStepper';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Github,
  Linkedin,
  FileText,
  Building2,
  Users
} from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';

const JOB_SEEKER_STEPS: StepItem[] = [
  { id: 1, label: 'Basic Profile' },
  { id: 2, label: 'Skills & Experience' },
  { id: 3, label: 'Resume & Links' },
];

const EMPLOYER_STEPS: StepItem[] = [
  { id: 1, label: 'Company Info' },
  { id: 2, label: 'Details & Logo' },
  { id: 3, label: 'Hiring Goals' },
];

export const OnboardingWizardPage: React.FC = () => {
  const { role, user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const isEmployer = role === 'employer';
  const steps = isEmployer ? EMPLOYER_STEPS : JOB_SEEKER_STEPS;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Job Seeker Form State
  const [headline, setHeadline] = useState(user?.headline || 'Senior Full Stack Software Engineer');
  const [location, setLocation] = useState(user?.location || 'San Francisco, CA');
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || '+1 (555) 019-2834');
  const [bio, setBio] = useState(user?.bio || 'Passionate about building scalable modern web applications with React, TypeScript, Node.js and Tailwind CSS.');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || 'React, TypeScript, Node.js, Tailwind CSS, GraphQL, PostgreSQL');
  const [experienceYears, setExperienceYears] = useState(String(user?.experienceYears || '5'));
  const [education, setEducation] = useState(typeof user?.education === 'string' ? user.education : 'B.S. in Computer Science - Stanford University');
  const [portfolio, setPortfolio] = useState(user?.portfolioUrl || user?.website || 'https://alexmorgan.dev');
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || 'https://linkedin.com/in/alexmorgan');
  const [github, setGithub] = useState(user?.githubUrl || 'https://github.com/alexmorgan');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  // Employer Form State
  const [companyName, setCompanyName] = useState(user?.companyName || 'TechCorp Solutions');
  const [industry, setIndustry] = useState('Software & Cloud Services');
  const [companySize, setCompanySize] = useState('250-500 Employees');
  const [website, setWebsite] = useState(user?.companyWebsite || user?.website || 'https://techcorp.example.com');
  const [companyLocation, setCompanyLocation] = useState(user?.location || 'San Francisco, CA');
  const [description, setDescription] = useState(user?.bio || 'Leading enterprise cloud platform delivering real-time intelligent workflow systems.');
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [hiringGoal, setHiringGoal] = useState('Hiring 5-10 Software Engineers this quarter');

  React.useEffect(() => {
    if (user) {
      if (user.headline) setHeadline(user.headline);
      if (user.location) setLocation(user.location);
      if (user.phone || user.phoneNumber) setPhone(user.phone || user.phoneNumber || '');
      if (user.bio) setBio(user.bio);
      if (user.skills && user.skills.length > 0) setSkills(user.skills.join(', '));
      if (user.education && typeof user.education === 'string') setEducation(user.education);
      if (user.portfolioUrl || user.website) setPortfolio(user.portfolioUrl || user.website || '');
      if (user.linkedinUrl) setLinkedin(user.linkedinUrl);
      if (user.githubUrl) setGithub(user.githubUrl);
      if (user.companyName) setCompanyName(user.companyName);
      if (user.companyWebsite || user.website) setWebsite(user.companyWebsite || user.website || '');
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (!isEmployer) {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        await updateUserProfile({
          headline,
          location,
          phone,
          phoneNumber: phone,
          bio,
          skills: skillsArray,
          experienceYears: parseInt(experienceYears, 10) || 0,
          education,
          portfolioUrl: portfolio,
          website: portfolio,
          linkedinUrl: linkedin,
          githubUrl: github,
          profileCompleted: true,
        });
      } else {
        await updateUserProfile({
          companyName,
          industry,
          companySize,
          companyWebsite: website,
          website,
          location: companyLocation,
          bio: description,
          profileCompleted: true,
        });
      }
      showSuccessToast('Profile setup complete! Welcome to your dashboard.');
      navigate(isEmployer ? '/dashboard' : '/jobs');
    } catch (err) {
      console.error('Error completing onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="md" className="py-10 space-y-8">
      
      {/* Header */}
      <SectionHeader
        title={isEmployer ? 'Complete Employer Profile' : 'Complete Your Professional Profile'}
        subtitle={isEmployer ? 'Set up your company workspace to start posting jobs and reviewing candidates.' : 'Add your skills, experience, and links to get 3x more recruiter profile views.'}
        badge="Welcome Onboarding"
      />

      {/* Stepper Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        
        <ProgressStepper steps={steps} currentStep={currentStep} />

        {/* JOB SEEKER FORM */}
        {!isEmployer && (
          <div className="space-y-6 pt-4">

            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 1: Contact & Headline
                </h3>

                <InputField
                  label="Professional Headline"
                  placeholder="e.g. Senior Full Stack Developer | React & Node.js"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                  icon={Briefcase}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Current Location"
                    placeholder="e.g. San Francisco, CA (or Remote)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    icon={MapPin}
                  />

                  <InputField
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={Phone}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    About Yourself (Summary)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly highlight your experience, key strengths, and career aspirations..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Skills & Experience */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 2: Skills & Qualifications
                </h3>

                <InputField
                  label="Technical Skills (Comma Separated)"
                  placeholder="e.g. React, TypeScript, Python, Docker, AWS"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  icon={Sparkles}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Years of Experience"
                    placeholder="e.g. 5"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    icon={Briefcase}
                  />

                  <InputField
                    label="Highest Education"
                    placeholder="e.g. B.S. Computer Science"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    icon={GraduationCap}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Resume & Social Links */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 3: Resume Upload & Profiles
                </h3>

                {/* Resume Dropzone */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload Resume (PDF / DOCX)
                  </label>
                  <div
                    onClick={() => {
                      setResumeUploaded(true);
                      showSuccessToast('Resume uploaded: Alex_Morgan_Resume_2026.pdf');
                    }}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer space-y-2 ${
                      resumeUploaded
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center mx-auto">
                      {resumeUploaded ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Upload className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {resumeUploaded ? 'Alex_Morgan_Resume_2026.pdf uploaded' : 'Click to select or drop your resume here'}
                      </p>
                      <p className="text-[11px] text-slate-400">PDF, DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <InputField
                    label="Portfolio Website URL"
                    placeholder="https://yourportfolio.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    icon={Globe}
                  />
                  <InputField
                    label="LinkedIn Profile URL"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    icon={Linkedin}
                  />
                  <InputField
                    label="GitHub Profile URL"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    icon={Github}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* EMPLOYER FORM */}
        {isEmployer && (
          <div className="space-y-6 pt-4">

            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 1: Company Profile
                </h3>

                <InputField
                  label="Company Name"
                  placeholder="e.g. TechCorp Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  icon={Building2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Industry Sector"
                    placeholder="e.g. Software & Artificial Intelligence"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    icon={Briefcase}
                  />

                  <InputField
                    label="Company Size"
                    placeholder="e.g. 50-200 Employees"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    icon={Users}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Official Website"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    icon={Globe}
                  />

                  <InputField
                    label="Headquarters Location"
                    placeholder="e.g. San Francisco, CA"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    icon={MapPin}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Description & Logo */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 2: Branding & Description
                </h3>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company Overview & Mission
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your company culture, main product, and why candidates should join..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>

                {/* Company Logo Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company Brand Logo
                  </label>
                  <div
                    onClick={() => {
                      setLogoUploaded(true);
                      showSuccessToast('Company logo updated!');
                    }}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer space-y-2 ${
                      logoUploaded
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 flex items-center justify-center mx-auto">
                      {logoUploaded ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Upload className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {logoUploaded ? 'Company Logo Uploaded' : 'Upload SVG, PNG or JPG Logo (Min 200x200)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Hiring Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 3: Immediate Hiring Needs
                </h3>

                <InputField
                  label="Quarterly Hiring Target"
                  placeholder="e.g. Hiring 5 Software Engineers & 2 Product Managers"
                  value={hiringGoal}
                  onChange={(e) => setHiringGoal(e.target.value)}
                  icon={Briefcase}
                />

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Verified Employer Status
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Once completed, your profile will display a Verified Employer badge on all posted jobs, granting access to direct candidate applications and search filters.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <SecondaryButton onClick={handleBack} icon={ArrowLeft}>
              Previous
            </SecondaryButton>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <PrimaryButton onClick={handleNext} icon={ArrowRight} iconPosition="right">
              Continue
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleComplete}
              icon={CheckCircle2}
              isLoading={isSubmitting}
            >
              Complete Setup & Enter Dashboard
            </PrimaryButton>
          )}
        </div>

      </div>

    </PageContainer>
  );
};
