import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { SelectInput } from '../../components/inputs/SelectInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { employerPortalService, CompanyProfile } from '../../services/employerPortalService';
import { useAuth } from '../../context/AuthContext';
import { useJobContext } from '../../context/JobContext';
import { EMPLOYER_POSITIONS, EmployerPosition } from '../../types/user';
import { HiringCampaign } from '../../types/campaign';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  CheckCircle2,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Linkedin,
  Twitter,
  Github,
  User,
  Briefcase,
  Layers,
  Megaphone,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FolderOpen,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { readAndOptimizeImage, PRESET_COMPANY_BANNERS } from '../../utils/fileUpload';

export const EmployerProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { jobs } = useJobContext();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [campaigns, setCampaigns] = useState<HiringCampaign[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'hiring' | 'preview'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const bannerFileInputRef = React.useRef<HTMLInputElement>(null);
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  // Section 1: Personal & Professional Credentials
  const [recruiterName, setRecruiterName] = useState(user?.displayName || '');
  const [recruiterEmail, setRecruiterEmail] = useState(user?.email || '');
  const [recruiterPhone, setRecruiterPhone] = useState(user?.phone || user?.phoneNumber || '');
  const [employerPosition, setEmployerPosition] = useState<string>((user as any)?.employerPosition || 'HR Manager');
  const [department, setDepartment] = useState<string>((user as any)?.department || '');
  const [professionalTitle, setProfessionalTitle] = useState<string>((user as any)?.professionalTitle || '');
  const [recruiterAvatar, setRecruiterAvatar] = useState(user?.photoURL || user?.avatarUrl || '');

  // Section 2: Company Information
  const [name, setName] = useState(user?.companyName || '');
  const [logo, setLogo] = useState((user as any)?.companyLogo || '');
  const [coverBanner, setCoverBanner] = useState('');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [size, setSize] = useState(user?.companySize || '51 - 200 Employees');
  const [headquarters, setHeadquarters] = useState((user as any)?.companyLocation || user?.location || '');
  const [website, setWebsite] = useState(user?.companyWebsite || user?.website || '');
  const [foundedYear, setFoundedYear] = useState<string>(String((user as any)?.foundedYear || ''));
  const [description, setDescription] = useState((user as any)?.companyDescription || user?.bio || '');
  const [aboutCompany, setAboutCompany] = useState((user as any)?.aboutCompany || '');
  const [companyAchievements, setCompanyAchievements] = useState((user as any)?.companyAchievements || '');
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || '');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState(user?.githubUrl || '');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // Section 3: Hiring Strategy & Needs
  const [hiringLocations, setHiringLocations] = useState<string>(
    Array.isArray((user as any)?.hiringLocations)
      ? (user as any).hiringLocations.join(', ')
      : (user as any)?.hiringLocations || ''
  );
  const [targetDepartments, setTargetDepartments] = useState<string>(
    Array.isArray((user as any)?.departments)
      ? (user as any).departments.join(', ')
      : (user as any)?.departments || ''
  );
  const [commonlyHiredSkills, setCommonlyHiredSkills] = useState<string>(
    Array.isArray((user as any)?.commonlyHiredSkills)
      ? (user as any).commonlyHiredSkills.join(', ')
      : (user as any)?.commonlyHiredSkills || ''
  );
  const [currentHiringStatus, setCurrentHiringStatus] = useState<string>(
    (user as any)?.currentHiringStatus || 'Actively Hiring'
  );
  const [workModePreference, setWorkModePreference] = useState<string>(
    (user as any)?.workModePreference || 'Hybrid'
  );
  const [talentSourcePreferences, setTalentSourcePreferences] = useState<string>(
    Array.isArray((user as any)?.talentSourcePreferences)
      ? (user as any).talentSourcePreferences.join(', ')
      : (user as any)?.talentSourcePreferences || ''
  );

  useEffect(() => {
    employerPortalService.getCompanyProfile().then((data) => {
      setProfile(data);
      if (!name && data.name) setName(data.name);
      if (!logo && data.logo) setLogo(data.logo);
      if (!coverBanner && data.coverBanner) setCoverBanner(data.coverBanner);
      if (!industry && data.industry) setIndustry(data.industry);
      if (!size && data.size) setSize(data.size);
      if (!headquarters && data.headquarters) setHeadquarters(data.headquarters);
      if (!website && data.website) setWebsite(data.website);
      if (!recruiterPhone && data.phone) setRecruiterPhone(data.phone);
      if (!linkedin && data.socialLinks?.linkedin) setLinkedin(data.socialLinks.linkedin);
      if (!twitter && data.socialLinks?.twitter) setTwitter(data.socialLinks.twitter);
      if (!github && data.socialLinks?.github) setGithub(data.socialLinks.github);
      if (!description && data.description) setDescription(data.description);
      if (data.benefits && data.benefits.length > 0 && benefits.length === 0) {
        setBenefits(data.benefits);
      }
    });

    employerPortalService.getCampaigns().then(setCampaigns);
  }, [user]);

  // Sync state if user object updates
  useEffect(() => {
    if (user) {
      if (user.displayName) setRecruiterName(user.displayName);
      if (user.email) setRecruiterEmail(user.email);
      if (user.phone || user.phoneNumber) setRecruiterPhone(user.phone || user.phoneNumber || '');
      if ((user as any).employerPosition) setEmployerPosition((user as any).employerPosition);
      if ((user as any).department) setDepartment((user as any).department);
      if ((user as any).professionalTitle) setProfessionalTitle((user as any).professionalTitle);
      if (user.companyName) setName(user.companyName);
      if ((user as any).companyLogo) setLogo((user as any).companyLogo);
      if (user.industry) setIndustry(user.industry);
      if (user.companySize) setSize(user.companySize);
      if ((user as any).companyLocation || user.location) setHeadquarters((user as any).companyLocation || user.location || '');
      if (user.companyWebsite || user.website) setWebsite(user.companyWebsite || user.website || '');
      if ((user as any).foundedYear) setFoundedYear(String((user as any).foundedYear));
      if ((user as any).companyDescription || user.bio) setDescription((user as any).companyDescription || user.bio || '');
      if ((user as any).aboutCompany) setAboutCompany((user as any).aboutCompany);
      if ((user as any).companyAchievements) setCompanyAchievements((user as any).companyAchievements);
    }
  }, [user]);

  // Calculate Profile Completion
  const calculateEmployerCompletion = () => {
    const checks = [
      Boolean(recruiterName.trim()),
      Boolean(recruiterEmail.trim()),
      Boolean(recruiterPhone.trim()),
      Boolean(employerPosition.trim()),
      Boolean(department.trim()),
      Boolean(professionalTitle.trim()),
      Boolean(name.trim()),
      Boolean(industry.trim()),
      Boolean(size.trim()),
      Boolean(headquarters.trim()),
      Boolean(website.trim()),
      Boolean(description.trim()),
      Boolean(hiringLocations.trim()),
      Boolean(targetDepartments.trim()),
      Boolean(commonlyHiredSkills.trim()),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const completionPercent = calculateEmployerCompletion();
  const isProfileIncomplete = completionPercent < 70;

  const handleAddBenefit = () => {
    if (newBenefitInput.trim() && !benefits.includes(newBenefitInput.trim())) {
      setBenefits([...benefits, newBenefitInput.trim()]);
      setNewBenefitInput('');
    }
  };

  const handleRemoveBenefit = (bToRemove: string) => {
    setBenefits(benefits.filter((b) => b !== bToRemove));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const locationsArr = hiringLocations.split(',').map((s) => s.trim()).filter(Boolean);
      const deptsArr = targetDepartments.split(',').map((s) => s.trim()).filter(Boolean);
      const skillsArr = commonlyHiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const sourcesArr = talentSourcePreferences.split(',').map((s) => s.trim()).filter(Boolean);

      // 1. Update authenticated user document with employer attributes
      await updateUserProfile({
        displayName: recruiterName || user?.displayName,
        phone: recruiterPhone,
        phoneNumber: recruiterPhone,
        employerPosition,
        department,
        professionalTitle,
        companyName: name,
        companyWebsite: website,
        website,
        industry,
        companySize: size,
        location: headquarters,
        companyLocation: headquarters,
        companyLogo: logo,
        companyDescription: description,
        foundedYear: foundedYear ? parseInt(foundedYear, 10) || undefined : undefined,
        companyAchievements,
        aboutCompany,
        hiringLocations: locationsArr,
        departments: deptsArr,
        commonlyHiredSkills: skillsArr,
        currentHiringStatus,
        workModePreference,
        talentSourcePreferences: sourcesArr,
        linkedinUrl: linkedin,
        githubUrl: github,
        bio: description,
        profileCompleted: true,
      });

      // 2. Upsert Company Document
      const updatedComp = await employerPortalService.updateCompanyProfile({
        name: name || 'Company Profile',
        logo: logo || profile?.logo,
        coverBanner: coverBanner || profile?.coverBanner,
        industry: industry || 'Technology',
        size: size || '51 - 200 Employees',
        headquarters: headquarters || 'Remote',
        website,
        email: recruiterEmail || user?.email,
        phone: recruiterPhone,
        socialLinks: {
          linkedin,
          twitter,
          github,
        },
        description,
        mission: aboutCompany || 'Empowering people and driving transformative innovation.',
        vision: companyAchievements || 'Building high-performance, autonomous teams.',
        benefits,
      });

      setProfile(updatedComp);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save employer profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Employer & Company Profile"
          subtitle="Manage your professional recruiter credentials, organization brand, hiring strategy, and talent requirements."
          badge="Employer Profile"
        />

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Professional
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'company'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Company Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hiring')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hiring'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Hiring Needs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Employer Profile Completion
              </span>
              <Badge variant={completionPercent >= 80 ? 'success' : completionPercent >= 50 ? 'warning' : 'accent'} size="sm">
                {completionPercent}% Complete
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isProfileIncomplete
                ? 'Complete your company and professional details to maximize candidate engagement and attract qualified talent.'
                : 'Your employer profile is complete and actively verified across candidate searches and job listings.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PrimaryButton size="sm" onClick={() => handleSave()} isLoading={isSaving} icon={CheckCircle2}>
              Save Profile
            </PrimaryButton>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(completionPercent, 8)}%` }}
          />
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Employer profile and company credentials updated successfully in Firestore!</span>
        </div>
      )}

      {/* TAB 1: PERSONAL & PROFESSIONAL */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Recruiter & Professional Position
            </h3>

            <div className="flex items-center gap-4 pb-2">
              <Avatar
                src={recruiterAvatar}
                name={recruiterName || 'Employer'}
                size="xl"
                className="rounded-2xl"
              />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{recruiterName || 'Your Name'}</p>
                <p className="text-xs text-slate-500">{recruiterEmail}</p>
                <Badge variant="info" size="sm" className="mt-1">{employerPosition || 'Hiring Manager'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                placeholder="sailesh iyyappan"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                required
                icon={User}
              />

              <SelectInput
                label="Employer Position"
                value={employerPosition}
                onChange={(e) => setEmployerPosition(e.target.value)}
                options={EMPLOYER_POSITIONS.map((pos) => ({ value: pos, label: pos }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Email Address"
                type="email"
                placeholder="saileshiyyappan@gmail.com"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                required
                icon={Mail}
              />

              <InputField
                label="Direct Phone Number"
                placeholder="+1 (555) 234-5678"
                value={recruiterPhone}
                onChange={(e) => setRecruiterPhone(e.target.value)}
                icon={Phone}
              />

              <InputField
                label="Profile Photo URL"
                placeholder="https://..."
                value={recruiterAvatar}
                onChange={(e) => setRecruiterAvatar(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Department"
                placeholder="e.g. People & Culture / Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                icon={Layers}
              />

              <InputField
                label="Professional Title"
                placeholder="e.g. Senior Talent Acquisition Lead"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                icon={Briefcase}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <SecondaryButton type="button" onClick={() => setActiveTab('company')}>
              Next: Company Information →
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSaving} icon={CheckCircle2}>
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* TAB 2: COMPANY INFORMATION */}
      {activeTab === 'company' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Company Details & Corporate Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Company Name"
                placeholder="e.g. Acro Dynamics Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={Building2}
              />

              <InputField
                label="Industry"
                placeholder="e.g. Software & Cloud Infrastructure"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                icon={Layers}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectInput
                label="Company Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={[
                  { value: '1 - 10 Employees', label: '1 - 10 Employees' },
                  { value: '11 - 50 Employees', label: '11 - 50 Employees' },
                  { value: '51 - 200 Employees', label: '51 - 200 Employees' },
                  { value: '201 - 500 Employees', label: '201 - 500 Employees' },
                  { value: '500 - 1,000 Employees', label: '500 - 1,000 Employees' },
                  { value: '1,000+ Employees', label: '1,000+ Enterprise Employees' },
                ]}
              />

              <InputField
                label="Headquarters Location"
                placeholder="e.g. San Francisco, CA / Remote"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                icon={MapPin}
              />

              <InputField
                label="Official Website URL"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                icon={Globe}
              />
            </div>

            {/* Brand Banner & Logo Customizer (Local Upload) */}
            <div className="space-y-4 pt-2">
              <input
                type="file"
                ref={bannerFileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setIsUploadingBanner(true);
                    const dataUrl = await readAndOptimizeImage(file, 1600, 800, 0.85);
                    setCoverBanner(dataUrl);
                  } catch (err) {
                    console.error('Error reading banner file:', err);
                  } finally {
                    setIsUploadingBanner(false);
                    if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
                  }
                }}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={logoFileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setIsUploadingLogo(true);
                    const dataUrl = await readAndOptimizeImage(file, 400, 400, 0.9);
                    setLogo(dataUrl);
                  } catch (err) {
                    console.error('Error reading logo file:', err);
                  } finally {
                    setIsUploadingLogo(false);
                    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    Cover Banner & Corporate Media
                  </label>
                  <p className="text-[11px] text-slate-400">Upload your organization banner and logo from local files.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    disabled={isUploadingBanner}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploadingBanner ? 'Processing...' : 'Upload Banner from Local'}
                  </button>
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploadingLogo ? 'Processing...' : 'Upload Logo'}
                  </button>
                </div>
              </div>

              {/* Visual Banner Preview */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 group shadow-xs">
                {coverBanner ? (
                  <img src={coverBanner} alt="Cover Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center text-slate-400 text-xs font-medium">
                    No custom banner selected. Click 'Upload Banner from Local' above.
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-4 flex items-end gap-3 z-10">
                  <img
                    src={logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80'}
                    alt="Logo"
                    className="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-800 p-0.5 border border-white dark:border-slate-700 shadow-md"
                  />
                  <div className="text-white pb-0.5">
                    <p className="text-sm font-black">{name || 'Your Company'}</p>
                    <p className="text-[11px] text-slate-200">{headquarters || 'Remote'}</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <Link
                    to="/employer/company"
                    className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-sm text-white text-[11px] font-bold hover:bg-black/70 transition-colors flex items-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3 text-purple-400" />
                    Manage Source Files & Brand Assets →
                  </Link>
                </div>
              </div>

              {/* Preset Banners */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Quick Presets</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_COMPANY_BANNERS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCoverBanner(preset.url)}
                      className={`relative h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        coverBanner === preset.url ? 'border-purple-600 ring-2 ring-purple-500/20' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      {coverBanner === preset.url && (
                        <span className="absolute top-0.5 right-0.5 p-0.5 bg-purple-600 rounded-full text-white">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <InputField
                label="Founded Year"
                type="number"
                placeholder="2020"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                icon={Calendar}
              />

              <InputField
                label="Company Logo URL (Optional Direct Link)"
                placeholder="https://..."
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />

              <InputField
                label="Cover Banner URL (Optional Direct Link)"
                placeholder="https://..."
                value={coverBanner}
                onChange={(e) => setCoverBanner(e.target.value)}
              />
            </div>

            <TextareaInput
              label="Company Description"
              placeholder="Provide an overview of your organization, mission, and products..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextareaInput
                label="About Company / Mission"
                placeholder="What drives your company culture and purpose?"
                rows={3}
                value={aboutCompany}
                onChange={(e) => setAboutCompany(e.target.value)}
              />

              <TextareaInput
                label="Company Achievements / Highlights"
                placeholder="Recent milestones, awards, notable funding, or scale..."
                rows={3}
                value={companyAchievements}
                onChange={(e) => setCompanyAchievements(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <InputField
                label="LinkedIn Company Page"
                placeholder="https://linkedin.com/company/..."
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                icon={Linkedin}
              />

              <InputField
                label="Twitter / X Profile"
                placeholder="https://twitter.com/..."
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                icon={Twitter}
              />

              <InputField
                label="GitHub Organization"
                placeholder="https://github.com/..."
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                icon={Github}
              />
            </div>

            {/* Benefits & Perks */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Benefits & Employee Perks
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 100% Health Coverage, Remote Stipend, 401(k) Match..."
                  value={newBenefitInput}
                  onChange={(e) => setNewBenefitInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Add Perk
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {b}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(b)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <SecondaryButton type="button" onClick={() => setActiveTab('hiring')}>
              Next: Hiring Strategy →
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSaving} icon={CheckCircle2}>
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* TAB 3: HIRING STRATEGY & NEEDS */}
      {activeTab === 'hiring' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Hiring Strategy, Target Locations & Talent Sourcing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectInput
                label="Current Hiring Status"
                value={currentHiringStatus}
                onChange={(e) => setCurrentHiringStatus(e.target.value)}
                options={[
                  { value: 'Actively Hiring', label: '🔥 Actively Hiring (Multiple Open Roles)' },
                  { value: 'Selective', label: '🔍 Selective Hiring (Specific Positions Only)' },
                  { value: 'Paused', label: '⏸️ Hiring Paused' },
                ]}
              />

              <SelectInput
                label="Work Mode Preference"
                value={workModePreference}
                onChange={(e) => setWorkModePreference(e.target.value)}
                options={[
                  { value: 'Remote', label: '🌐 100% Remote / Distributed' },
                  { value: 'Hybrid', label: '🏢 Hybrid (Remote + Office)' },
                  { value: 'On-site', label: '📍 On-site / Office-based' },
                  { value: 'Flexible', label: '⚡ Flexible' },
                ]}
              />
            </div>

            <InputField
              label="Hiring Locations (comma-separated)"
              placeholder="e.g. San Francisco, CA, Remote, New York, NY, Austin, TX"
              value={hiringLocations}
              onChange={(e) => setHiringLocations(e.target.value)}
              icon={MapPin}
            />

            <InputField
              label="Target Departments (comma-separated)"
              placeholder="e.g. Engineering, Product, Design, Sales, Marketing"
              value={targetDepartments}
              onChange={(e) => setTargetDepartments(e.target.value)}
              icon={Layers}
            />

            <InputField
              label="In-Demand Skills Commonly Hired (comma-separated)"
              placeholder="e.g. React, TypeScript, Node.js, Python, PostgreSQL, AWS"
              value={commonlyHiredSkills}
              onChange={(e) => setCommonlyHiredSkills(e.target.value)}
              icon={Sparkles}
            />

            <InputField
              label="Preferred Talent Sourcing Channels (comma-separated)"
              placeholder="e.g. Engineering Universities, Open-Source Contributors, Tech Communities"
              value={talentSourcePreferences}
              onChange={(e) => setTalentSourcePreferences(e.target.value)}
              icon={Award}
            />
          </div>

          <div className="flex justify-end gap-3">
            <SecondaryButton type="button" onClick={() => setActiveTab('preview')}>
              View Public Preview →
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSaving} icon={CheckCircle2}>
              Save Changes
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* TAB 4: PUBLIC PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <div className="relative h-56 rounded-3xl overflow-hidden bg-slate-900">
              <img
                src={coverBanner || profile?.coverBanner || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'}
                alt="Cover"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-end gap-4 text-white">
                <img
                  src={logo || profile?.logo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80'}
                  alt={name || 'Company'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black">{name || 'Company Name'}</h2>
                    <Badge variant="info" size="sm">Verified Employer</Badge>
                  </div>
                  <p className="text-xs text-slate-200">{industry || 'Industry'} • {headquarters || 'Location'}</p>
                </div>
              </div>
            </div>

            {/* Recruiter Badge Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={recruiterAvatar} name={recruiterName || 'Recruiter'} size="md" className="rounded-xl" />
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{recruiterName || 'Recruiter'}</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    {employerPosition} {department ? `• ${department}` : ''} {professionalTitle ? `• ${professionalTitle}` : ''}
                  </p>
                </div>
              </div>
              <Badge variant="accent" size="sm">Hiring Representative</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">About Organization</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {description || 'Not provided'}
                  </p>
                </div>

                {aboutCompany && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mission & Culture</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{aboutCompany}</p>
                  </div>
                )}

                {companyAchievements && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Key Achievements & Growth</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{companyAchievements}</p>
                  </div>
                )}

                {/* Active Jobs */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Active Open Positions ({jobs.length})
                    </h3>
                    <Link to="/my-jobs" className="text-xs font-bold text-blue-600 hover:underline">
                      Manage Jobs →
                    </Link>
                  </div>
                  {jobs.length > 0 ? (
                    <div className="space-y-2">
                      {jobs.slice(0, 3).map((j) => (
                        <div key={j.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{j.title}</p>
                            <p className="text-[11px] text-slate-500">{typeof j.location === 'object' ? `${j.location.city}, ${j.location.country}` : j.location}</p>
                          </div>
                          <Badge variant="success" size="sm">Active</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No public jobs currently active.</p>
                  )}
                </div>

                {/* Active Hiring Campaigns */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hiring Campaigns ({campaigns.length})
                    </h3>
                    <Link to="/employer/campaigns" className="text-xs font-bold text-blue-600 hover:underline">
                      Manage Campaigns →
                    </Link>
                  </div>
                  {campaigns.length > 0 ? (
                    <div className="space-y-2">
                      {campaigns.slice(0, 2).map((c) => (
                        <div key={c.id} className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{c.positions.join(', ')}</p>
                          </div>
                          <Badge variant="info" size="sm">{c.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No campaigns launched yet.</p>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Company Overview</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{size || 'Not provided'}</span>
                    </div>
                    {website && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <a href={website} target="_blank" rel="noreferrer" className="hover:underline font-semibold text-blue-600 truncate">
                          {website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-purple-500" />
                      <span className="truncate">{recruiterEmail || 'Not provided'}</span>
                    </div>
                    {recruiterPhone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Phone className="w-4 h-4 text-amber-500" />
                        <span>{recruiterPhone}</span>
                      </div>
                    )}
                    {foundedYear && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>Founded {foundedYear}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hiring Specs Box */}
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Hiring Profile</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{currentHiringStatus}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold">Work Mode:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{workModePreference}</p>
                    </div>
                    {hiringLocations && (
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold">Hiring Locations:</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{hiringLocations}</p>
                      </div>
                    )}
                    {commonlyHiredSkills && (
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold">In-Demand Skills:</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{commonlyHiredSkills}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <SecondaryButton type="button" onClick={() => setActiveTab('profile')}>
              Back to Edit Form
            </SecondaryButton>
            <PrimaryButton type="button" onClick={() => handleSave()} isLoading={isSaving} icon={CheckCircle2}>
              Save Profile
            </PrimaryButton>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
