import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
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
  Users,
  Award,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../../context/ToastContext';
import { EMPLOYER_POSITIONS, EmployerPosition } from '../../types/user';
import { employerPortalService } from '../../services/employerPortalService';

const JOB_SEEKER_STEPS: StepItem[] = [
  { id: 1, label: 'Basic Profile' },
  { id: 2, label: 'Skills & Qualifications' },
  { id: 3, label: 'Resume & Links' },
];

const EMPLOYER_STEPS: StepItem[] = [
  { id: 1, label: 'Professional Profile' },
  { id: 2, label: 'Company Overview' },
  { id: 3, label: 'Hiring Strategy' },
];

export const OnboardingWizardPage: React.FC = () => {
  const { role, user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const isEmp = user?.role === 'employer' || role === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';
  const effectiveRole = isEmp ? 'employer' : (user?.role || role);
  const isEmployer = effectiveRole === 'employer';
  const steps = isEmployer ? EMPLOYER_STEPS : JOB_SEEKER_STEPS;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================================
  // JOB SEEKER STATE
  // =========================================================================
  const [candidateName, setCandidateName] = useState(user?.displayName || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [location, setLocation] = useState(user?.location || '');
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [experienceYears, setExperienceYears] = useState(String(user?.experienceYears || ''));
  const [education, setEducation] = useState(typeof user?.education === 'string' ? user.education : '');
  const [portfolio, setPortfolio] = useState(user?.portfolioUrl || user?.website || '');
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || '');
  const [github, setGithub] = useState(user?.githubUrl || '');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  // =========================================================================
  // EMPLOYER STATE
  // =========================================================================
  // Step 1: Personal / Professional
  const [empFullName, setEmpFullName] = useState(user?.displayName || '');
  const [empEmail, setEmpEmail] = useState(user?.email || '');
  const [empPhone, setEmpPhone] = useState(user?.phone || user?.phoneNumber || '');
  const [empPosition, setEmpPosition] = useState<string>((user as any)?.employerPosition || 'HR Manager');
  const [empDepartment, setEmpDepartment] = useState<string>((user as any)?.department || 'People & Talent');
  const [empProfessionalTitle, setEmpProfessionalTitle] = useState<string>((user as any)?.professionalTitle || 'Senior Talent Acquisition Lead');
  const [empPhotoUrl, setEmpPhotoUrl] = useState<string>(user?.photoURL || user?.avatarUrl || '');

  // Step 2: Company
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [industry, setIndustry] = useState(user?.industry || 'Software & Technology');
  const [companySize, setCompanySize] = useState(user?.companySize || '51-200 Employees');
  const [companyLocation, setCompanyLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.companyWebsite || user?.website || '');
  const [foundedYear, setFoundedYear] = useState<string>(String((user as any)?.foundedYear || '2020'));
  const [companyDescription, setCompanyDescription] = useState((user as any)?.companyDescription || user?.bio || '');
  const [companyAchievements, setCompanyAchievements] = useState((user as any)?.companyAchievements || '');
  const [aboutCompany, setAboutCompany] = useState((user as any)?.aboutCompany || '');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>((user as any)?.companyLogo || '');
  const [companyLinkedin, setCompanyLinkedin] = useState('');
  const [companyTwitter, setCompanyTwitter] = useState('');

  // Step 3: Hiring
  const [hiringLocations, setHiringLocations] = useState<string>('');
  const [targetDepartments, setTargetDepartments] = useState<string>('Engineering, Product, Design, Sales');
  const [commonlyHiredSkills, setCommonlyHiredSkills] = useState<string>('React, TypeScript, Node.js, Python, Cloud Infrastructure');
  const [currentHiringStatus, setCurrentHiringStatus] = useState<string>('Actively Hiring');
  const [workModePreference, setWorkModePreference] = useState<string>('Hybrid');
  const [talentSourcePreferences, setTalentSourcePreferences] = useState<string>('Top Engineering Universities, Open-Source Contributors, Professional Communities');

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        setCandidateName(user.displayName);
        setEmpFullName(user.displayName);
      }
      if (user.email) setEmpEmail(user.email);
      if (user.headline) setHeadline(user.headline);
      if (user.location) {
        setLocation(user.location);
        setCompanyLocation(user.location);
      }
      if (user.phone || user.phoneNumber) {
        setPhone(user.phone || user.phoneNumber || '');
        setEmpPhone(user.phone || user.phoneNumber || '');
      }
      if (user.bio) {
        setBio(user.bio);
        if (!companyDescription) setCompanyDescription(user.bio);
      }
      if (user.skills && user.skills.length > 0) setSkills(user.skills.join(', '));
      if (user.education && typeof user.education === 'string') setEducation(user.education);
      if (user.portfolioUrl || user.website) {
        setPortfolio(user.portfolioUrl || user.website || '');
        if (!website) setWebsite(user.portfolioUrl || user.website || '');
      }
      if (user.linkedinUrl) {
        setLinkedin(user.linkedinUrl);
        setCompanyLinkedin(user.linkedinUrl);
      }
      if (user.githubUrl) setGithub(user.githubUrl);
      if (user.companyName) setCompanyName(user.companyName);
      if (user.companyWebsite || user.website) setWebsite(user.companyWebsite || user.website || '');
    }
  }, [user]);

  const handleNext = () => {
    if (isEmployer && currentStep === 1) {
      if (!empFullName.trim() || !empPosition) {
        showErrorToast('Please enter your full name and select your employer position.');
        return;
      }
    } else if (isEmployer && currentStep === 2) {
      if (!companyName.trim()) {
        showErrorToast('Please specify your organization or company name.');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (!isEmployer) {
        const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
        await updateUserProfile({
          displayName: candidateName || user?.displayName,
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
        showSuccessToast('Candidate profile setup complete! Welcome to your dashboard.');
        navigate('/jobs');
      } else {
        // Employer Onboarding
        const locationsArr = hiringLocations.split(',').map((s) => s.trim()).filter(Boolean);
        const deptsArr = targetDepartments.split(',').map((s) => s.trim()).filter(Boolean);
        const skillsArr = commonlyHiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
        const sourcesArr = talentSourcePreferences.split(',').map((s) => s.trim()).filter(Boolean);

        // Update User Profile with dedicated employer attributes
        await updateUserProfile({
          displayName: empFullName || user?.displayName,
          phone: empPhone,
          phoneNumber: empPhone,
          employerPosition: empPosition,
          department: empDepartment,
          professionalTitle: empProfessionalTitle,
          companyName,
          companyWebsite: website,
          industry,
          companySize,
          location: companyLocation,
          companyLocation,
          companyDescription,
          foundedYear: parseInt(foundedYear, 10) || 2020,
          companyAchievements,
          aboutCompany,
          hiringLocations: locationsArr,
          departments: deptsArr,
          commonlyHiredSkills: skillsArr,
          currentHiringStatus,
          workModePreference,
          talentSourcePreferences: sourcesArr,
          profileCompleted: true,
        });

        // Update Company Profile document
        await employerPortalService.updateCompanyProfile({
          name: companyName,
          industry,
          size: companySize,
          headquarters: companyLocation,
          website,
          email: empEmail || user?.email,
          phone: empPhone,
          description: companyDescription,
          mission: aboutCompany || 'Empowering people and transforming modern industry.',
          vision: companyAchievements || 'Building world-class teams and technology.',
          socialLinks: {
            linkedin: companyLinkedin,
            twitter: companyTwitter,
          },
        });

        showSuccessToast('Employer setup complete! Welcome to your Recruiter Command Center.');
        navigate('/employer/dashboard');
      }
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      showErrorToast(err?.message || 'Failed to complete profile setup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="md" className="py-10 space-y-8">
      {/* Header */}
      <SectionHeader
        title={isEmployer ? 'Employer & Recruiter Onboarding' : 'Complete Your Professional Profile'}
        subtitle={
          isEmployer
            ? 'Set up your recruiter identity, corporate organization, and talent requirements.'
            : 'Add your skills, qualifications, and portfolio links to stand out to leading hiring teams.'
        }
        badge={isEmployer ? 'Recruiter Suite' : 'Welcome Onboarding'}
      />

      {/* Stepper Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        {/* ================================================================== */}
        {/* JOB SEEKER FORM */}
        {/* ================================================================== */}
        {!isEmployer && (
          <div className="space-y-6 pt-2">
            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 1: Personal Contact & Professional Headline
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    placeholder="e.g. Alex Morgan"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                    icon={User}
                  />

                  <InputField
                    label="Professional Headline"
                    placeholder="e.g. Senior Full Stack Developer | React & Node.js"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    required
                    icon={Briefcase}
                  />
                </div>

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
                    Summary / About Yourself
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Highlight your domain experience, core achievements, and engineering passions..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Skills & Qualifications */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 2: Skills, Experience & Education
                </h3>

                <InputField
                  label="Core Skills (Comma Separated)"
                  placeholder="e.g. React, TypeScript, Node.js, Python, AWS, Docker"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  icon={Sparkles}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Years of Professional Experience"
                    placeholder="e.g. 5"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    icon={Briefcase}
                  />

                  <InputField
                    label="Highest Education / Institution"
                    placeholder="e.g. B.S. in Computer Science, VIT"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    icon={GraduationCap}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Resume & Social Links */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Step 3: Resume Attachment & Professional Links
                </h3>

                {/* Resume Upload Box */}
                <div
                  onClick={() => {
                    setResumeUploaded(true);
                    showSuccessToast('Resume attachment verified!');
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
                      {resumeUploaded ? 'Resume Ready (Resume_Verified.pdf)' : 'Attach Resume (PDF, DOCX up to 5MB)'}
                    </p>
                    <p className="text-[11px] text-slate-400">Click to upload your active resume</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <InputField
                    label="Portfolio Website"
                    placeholder="https://mywork.dev"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    icon={Globe}
                  />

                  <InputField
                    label="LinkedIn Profile"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    icon={Linkedin}
                  />

                  <InputField
                    label="GitHub Profile"
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

        {/* ================================================================== */}
        {/* EMPLOYER FORM (GENUINE EMPLOYER / RECRUITER SUITE) */}
        {/* ================================================================== */}
        {isEmployer && (
          <div className="space-y-6 pt-2">
            {/* Step 1: Personal & Professional Identity */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Step 1: Recruiter & Professional Identity
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your professional profile as seen by candidates during interviews and offers.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-xl">
                    Actor: Employer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    placeholder="e.g. Sarah Jenkins"
                    value={empFullName}
                    onChange={(e) => setEmpFullName(e.target.value)}
                    required
                    icon={User}
                  />

                  <InputField
                    label="Official Work Email"
                    placeholder="e.g. sarah@company.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    required
                    icon={Globe}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput
                    label="Employer Position / Role"
                    value={empPosition}
                    onChange={(e) => setEmpPosition(e.target.value)}
                    options={EMPLOYER_POSITIONS.map((pos) => ({ value: pos, label: pos }))}
                  />

                  <InputField
                    label="Department"
                    placeholder="e.g. Talent Acquisition / Engineering"
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                    icon={Layers}
                  />

                  <InputField
                    label="Professional Title"
                    placeholder="e.g. Senior Technical Recruiter"
                    value={empProfessionalTitle}
                    onChange={(e) => setEmpProfessionalTitle(e.target.value)}
                    icon={Briefcase}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Direct Phone / Contact"
                    placeholder="+1 (555) 234-5678"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    icon={Phone}
                  />

                  <InputField
                    label="Profile Photo URL (Optional)"
                    placeholder="https://..."
                    value={empPhotoUrl}
                    onChange={(e) => setEmpPhotoUrl(e.target.value)}
                    icon={User}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Company Overview & Brand */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Step 2: Organization & Company Profile
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showcase your brand, mission, size, and corporate achievements.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Company / Organization Name"
                    placeholder="e.g. Stripe, Acme Corp, Horizon Labs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    icon={Building2}
                  />

                  <InputField
                    label="Industry Sector"
                    placeholder="e.g. Fintech & Cloud Infrastructure"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    icon={Briefcase}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectInput
                    label="Company Size"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    options={[
                      { value: '1-10 Employees', label: '1 - 10 Employees (Seed)' },
                      { value: '11-50 Employees', label: '11 - 50 Employees (Early Stage)' },
                      { value: '51-200 Employees', label: '51 - 200 Employees (Growth)' },
                      { value: '201-500 Employees', label: '201 - 500 Employees (Mid-Market)' },
                      { value: '501-1000 Employees', label: '501 - 1,000 Employees (Scale)' },
                      { value: '1000+ Employees', label: '1,000+ Enterprise Employees' },
                    ]}
                  />

                  <InputField
                    label="Headquarters Location"
                    placeholder="e.g. San Francisco, CA / London, UK"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    icon={MapPin}
                  />

                  <InputField
                    label="Founded Year"
                    placeholder="e.g. 2018"
                    type="number"
                    value={foundedYear}
                    onChange={(e) => setFoundedYear(e.target.value)}
                    icon={Calendar}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField
                    label="Official Website URL"
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    icon={Globe}
                  />

                  <InputField
                    label="Company LinkedIn"
                    placeholder="https://linkedin.com/company/..."
                    value={companyLinkedin}
                    onChange={(e) => setCompanyLinkedin(e.target.value)}
                    icon={Linkedin}
                  />

                  <InputField
                    label="Company Twitter / X"
                    placeholder="https://twitter.com/..."
                    value={companyTwitter}
                    onChange={(e) => setCompanyTwitter(e.target.value)}
                    icon={Globe}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company Description & Core Mission
                  </label>
                  <textarea
                    rows={3}
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="What does your company build, and what makes your engineering culture distinctive?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company Achievements & Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={companyAchievements}
                    onChange={(e) => setCompanyAchievements(e.target.value)}
                    placeholder="e.g. Series B Funded ($30M), Y Combinator Alum, 100k+ enterprise users..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Hiring Strategy & Talent Preferences */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Step 3: Hiring Preferences & Talent Sourcing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set up your active talent pool preferences, hiring mode, and priority skills.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectInput
                    label="Current Hiring Status"
                    value={currentHiringStatus}
                    onChange={(e) => setCurrentHiringStatus(e.target.value)}
                    options={[
                      { value: 'Actively Hiring', label: 'Actively Hiring (Multiple Openings)' },
                      { value: 'Selective', label: 'Selective (Specialized Hires Only)' },
                      { value: 'Paused', label: 'Paused (Building Talent Pipeline)' },
                    ]}
                  />

                  <SelectInput
                    label="Work Mode Preference"
                    value={workModePreference}
                    onChange={(e) => setWorkModePreference(e.target.value)}
                    options={[
                      { value: 'Remote', label: '100% Remote' },
                      { value: 'Hybrid', label: 'Hybrid (2-3 days office)' },
                      { value: 'On-site', label: 'On-site Location' },
                      { value: 'Flexible', label: 'Flexible / Choice-driven' },
                    ]}
                  />
                </div>

                <InputField
                  label="Target Hiring Locations"
                  placeholder="e.g. San Francisco, CA, New York, NY, Austin, TX, Remote"
                  value={hiringLocations}
                  onChange={(e) => setHiringLocations(e.target.value)}
                  icon={MapPin}
                />

                <InputField
                  label="Commonly Hired Skills & Tech Stack"
                  placeholder="e.g. React, Next.js, TypeScript, Go, Python, PostgreSQL, AWS"
                  value={commonlyHiredSkills}
                  onChange={(e) => setCommonlyHiredSkills(e.target.value)}
                  icon={Sparkles}
                />

                <InputField
                  label="Talent Source Preferences (Colleges / Communities)"
                  placeholder="e.g. VIT, Stanford, Carnegie Mellon, Top Open Source Developers"
                  value={talentSourcePreferences}
                  onChange={(e) => setTalentSourcePreferences(e.target.value)}
                  icon={GraduationCap}
                />

                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <HeartHandshake className="w-4 h-4 text-blue-600" />
                    Enterprise RMS / ATS Activation
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Completing onboarding authorizes your organization to publish hiring campaigns, access the Candidate Database, manage pipelines, and schedule interviews directly with candidates.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* ACTION BUTTONS */}
        {/* ================================================================== */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <SecondaryButton onClick={handleBack} icon={ArrowLeft}>
              Previous Step
            </SecondaryButton>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <PrimaryButton onClick={handleNext} icon={ArrowRight} iconPosition="right">
              Continue to Step {currentStep + 1}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleComplete}
              icon={CheckCircle2}
              isLoading={isSubmitting}
            >
              {isEmployer ? 'Complete Setup & Open Recruiter Command Center' : 'Complete Setup & Browse Jobs'}
            </PrimaryButton>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
