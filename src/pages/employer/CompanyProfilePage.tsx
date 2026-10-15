import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { SelectInput } from '../../components/inputs/SelectInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { employerPortalService, CompanyProfile, CompanyBrandAsset } from '../../services/employerPortalService';
import { useAuth } from '../../context/AuthContext';
import { useJobContext } from '../../context/JobContext';
import { EMPLOYER_POSITIONS } from '../../types/user';
import { HiringCampaign } from '../../types/campaign';
import {
  readAndOptimizeImage,
  readLocalSourceFile,
  PRESET_COMPANY_BANNERS,
  PRESET_COMPANY_LOGOS,
  BRAND_ACCENTS,
} from '../../utils/fileUpload';
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
  Calendar,
  Sparkles,
  Palette,
  FileText,
  Download,
  Image as ImageIcon,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompanyProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { jobs } = useJobContext();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [campaigns, setCampaigns] = useState<HiringCampaign[]>([]);
  const [activeTab, setActiveTab] = useState<'edit' | 'assets' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingSourceFile, setIsUploadingSourceFile] = useState(false);

  // Hidden File Inputs
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);

  // Recruiter fields
  const [recruiterName, setRecruiterName] = useState(user?.displayName || '');
  const [employerPosition, setEmployerPosition] = useState<string>((user as any)?.employerPosition || 'HR Manager');
  const [department, setDepartment] = useState<string>((user as any)?.department || 'People & Talent');
  const [professionalTitle, setProfessionalTitle] = useState<string>((user as any)?.professionalTitle || 'Senior Recruiter');

  // Company Form states
  const [name, setName] = useState(user?.companyName || '');
  const [tagline, setTagline] = useState('Leading the future of technology & talent');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80');
  const [coverBanner, setCoverBanner] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80');
  const [customAccentColor, setCustomAccentColor] = useState('blue');
  const [industry, setIndustry] = useState(user?.industry || 'Software & Technology');
  const [size, setSize] = useState(user?.companySize || '50 - 200 Employees');
  const [headquarters, setHeadquarters] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.companyWebsite || user?.website || 'https://company.io');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || '');
  const [foundedYear, setFoundedYear] = useState<string>(String((user as any)?.foundedYear || '2021'));
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || '');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState(user?.githubUrl || '');
  const [description, setDescription] = useState(user?.bio || 'Building cutting-edge engineering and digital products with autonomous teams.');
  const [mission, setMission] = useState('To build extraordinary technology that empowers businesses and individuals worldwide.');
  const [vision, setVision] = useState('To be the premier engineering-led innovation benchmark in the software industry.');
  const [culture, setCulture] = useState('Autonomy, craftsmanship, continuous learning, and open collaboration.');
  const [benefits, setBenefits] = useState<string[]>(['100% Health & Dental Coverage', 'Flexible Remote Stipend', 'Learning & Conference Budget', 'Annual Equity Grants', 'Unlimited PTO']);
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [brandAssets, setBrandAssets] = useState<CompanyBrandAsset[]>([]);

  useEffect(() => {
    employerPortalService.getCompanyProfile().then((data) => {
      setProfile(data);
      if (data.name) setName(data.name);
      if (data.tagline) setTagline(data.tagline);
      if (data.logo) setLogo(data.logo);
      if (data.coverBanner) setCoverBanner(data.coverBanner);
      if (data.customAccentColor) setCustomAccentColor(data.customAccentColor);
      if (data.industry) setIndustry(data.industry);
      if (data.size) setSize(data.size);
      if (data.headquarters) setHeadquarters(data.headquarters);
      if (data.website) setWebsite(data.website);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
      if (data.socialLinks?.linkedin) setLinkedin(data.socialLinks.linkedin);
      if (data.socialLinks?.twitter) setTwitter(data.socialLinks.twitter);
      if (data.socialLinks?.github) setGithub(data.socialLinks.github);
      if (data.description) setDescription(data.description);
      if (data.mission) setMission(data.mission);
      if (data.vision) setVision(data.vision);
      if (data.culture) setCulture(data.culture);
      if (data.benefits && data.benefits.length > 0) setBenefits(data.benefits);
      if (data.brandAssets && data.brandAssets.length > 0) setBrandAssets(data.brandAssets);
    });

    employerPortalService.getCampaigns().then(setCampaigns);
  }, [user]);

  // Handle Local File Upload for Banner
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBanner(true);
      const dataUrl = await readAndOptimizeImage(file, 1600, 800, 0.85);
      setCoverBanner(dataUrl);

      // Also add to source files list as an asset
      const newAsset: CompanyBrandAsset = {
        id: `banner_${Date.now()}`,
        name: file.name,
        url: dataUrl,
        type: file.type || 'image/jpeg',
        size: `${Math.round(file.size / 1024)} KB`,
        category: 'banner',
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setBrandAssets((prev) => [newAsset, ...prev]);
    } catch (err) {
      console.error('Error reading local banner file:', err);
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
    }
  };

  // Handle Local File Upload for Logo
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const dataUrl = await readAndOptimizeImage(file, 400, 400, 0.9);
      setLogo(dataUrl);

      const newAsset: CompanyBrandAsset = {
        id: `logo_${Date.now()}`,
        name: file.name,
        url: dataUrl,
        type: file.type || 'image/png',
        size: `${Math.round(file.size / 1024)} KB`,
        category: 'logo',
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setBrandAssets((prev) => [newAsset, ...prev]);
    } catch (err) {
      console.error('Error reading local logo file:', err);
    } finally {
      setIsUploadingLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  // Handle Local Source Files Upload (Brand Assets, Banners, Guidelines)
  const handleSourceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingSourceFile(true);
      const newAssets: CompanyBrandAsset[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await readAndOptimizeImage(file, 1600, 1000, 0.85);
          newAssets.push({
            id: `asset_${Date.now()}_${i}`,
            name: file.name,
            url: dataUrl,
            type: file.type,
            size: `${Math.round(file.size / 1024)} KB`,
            category: 'source_file',
            uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          });
        } else {
          const fileData = await readLocalSourceFile(file);
          newAssets.push({
            id: fileData.id,
            name: fileData.name,
            url: fileData.dataUrl,
            type: fileData.type,
            size: fileData.size,
            category: 'document',
            uploadedAt: fileData.uploadedAt,
          });
        }
      }

      setBrandAssets((prev) => [...newAssets, ...prev]);
    } catch (err) {
      console.error('Error reading local source files:', err);
    } finally {
      setIsUploadingSourceFile(false);
      if (sourceFileInputRef.current) sourceFileInputRef.current.value = '';
    }
  };

  const handleRemoveAsset = (id: string) => {
    setBrandAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetAsBanner = (url: string) => {
    setCoverBanner(url);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

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
      await updateUserProfile({
        displayName: recruiterName,
        employerPosition,
        department,
        professionalTitle,
        companyName: name,
        companyLogo: logo,
        industry,
        companySize: size,
        companyWebsite: website,
        website,
        location: headquarters,
        phone,
        phoneNumber: phone,
        linkedinUrl: linkedin,
        githubUrl: github,
        bio: description,
        foundedYear: parseInt(foundedYear, 10) || 2021,
      });

      const updated = await employerPortalService.updateCompanyProfile({
        name,
        tagline,
        logo,
        coverBanner,
        customAccentColor,
        industry,
        size,
        headquarters,
        website,
        email,
        phone,
        socialLinks: { linkedin, twitter, github },
        description,
        mission,
        vision,
        culture,
        benefits,
        brandAssets,
      });

      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update company profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAccent = BRAND_ACCENTS.find((a) => a.id === customAccentColor) || BRAND_ACCENTS[0];

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Company Profile & Brand Customizer"
          subtitle="Customize your organization's cover banner, corporate media, brand source files, culture, and recruiter credentials."
          badge="Employer Profile"
        />

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-purple-500" />
            Source Files ({brandAssets.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            Live Preview
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          Company profile and brand assets saved successfully! Changes are live across job postings and company search.
        </div>
      )}

      {/* Hidden File Inputs for Local Device Upload */}
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />
      <input
        type="file"
        ref={logoFileInputRef}
        onChange={handleLogoFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />
      <input
        type="file"
        ref={sourceFileInputRef}
        onChange={handleSourceFileChange}
        multiple
        accept="image/*,.pdf,.zip,.svg,.doc,.docx"
        className="hidden"
      />

      {/* TAB 1: EDIT PROFILE */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: COVER BANNER & LOGO CUSTOMIZER (FROM LOCAL) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  Custom Brand Banner & Logo (Local Upload)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload custom high-resolution banner images and logos directly from your device.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  disabled={isUploadingBanner}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingBanner ? 'Processing...' : 'Upload Banner from Local'}
                </button>
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {isUploadingLogo ? 'Processing...' : 'Upload Logo'}
                </button>
              </div>
            </div>

            {/* Visual Cover Banner with Overlay */}
            <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm bg-slate-100 dark:bg-slate-800">
              <img
                src={coverBanner}
                alt="Company Cover Banner"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Logo badge in banner */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-end gap-3.5 z-10">
                <div className="relative group/logo">
                  <img
                    src={logo}
                    alt={name || 'Company Logo'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white dark:bg-slate-800 p-1 border-2 border-white dark:border-slate-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    title="Change Logo from Local File"
                    className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mb-0.5" />
                    Change
                  </button>
                </div>

                <div className="text-white pb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-black drop-shadow-sm">{name || 'Your Company Name'}</h4>
                    <span className="p-0.5 bg-blue-500 text-white rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 drop-shadow-sm line-clamp-1">{tagline || 'Leading innovation & talent'}</p>
                </div>
              </div>

              {/* Quick Banner Replace Button Overlay */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-white/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose Local Banner
                </button>
              </div>
            </div>

            {/* Quick Banner Presets Gallery */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Or Select from Curated Banner Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                {PRESET_COMPANY_BANNERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setCoverBanner(preset.url)}
                    className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      coverBanner === preset.url
                        ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-end p-1">
                      <span className="text-[10px] font-bold text-white line-clamp-1">{preset.label}</span>
                    </div>
                    {coverBanner === preset.url && (
                      <span className="absolute top-1 right-1 p-0.5 bg-blue-600 rounded-full text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Theme Palette */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Company Brand Accent Palette
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {BRAND_ACCENTS.map((accent) => (
                  <button
                    key={accent.id}
                    type="button"
                    onClick={() => setCustomAccentColor(accent.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      customAccentColor === accent.id
                        ? `${accent.border} bg-slate-50 dark:bg-slate-800/80 ring-2 ring-blue-500/10`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${accent.bg}`} />
                    <span>{accent.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: GENERAL ORGANIZATION DETAILS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              General Organization Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Company Name"
                placeholder="e.g. Acro Dynamics Cloud Inc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={Building2}
              />
              <InputField
                label="Tagline / Brand Slogan"
                placeholder="e.g. Next-Gen Cloud & Autonomous Engineering"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                icon={Sparkles}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Industry"
                placeholder="e.g. Software & Technology"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                icon={Layers}
              />

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Official Website URL"
                placeholder="https://company.io"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                icon={Globe}
              />

              <InputField
                label="Corporate Contact Email"
                type="email"
                placeholder="careers@company.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
              />

              <InputField
                label="Contact Phone"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Founded Year"
                type="number"
                placeholder="2021"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                icon={Calendar}
              />

              <InputField
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/company/..."
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                icon={Linkedin}
              />

              <InputField
                label="GitHub Organization URL"
                placeholder="https://github.com/..."
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                icon={Github}
              />
            </div>
          </div>

          {/* SECTION 3: RECRUITER & HIRING LEAD CREDENTIALS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Recruiter & Talent Lead Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Recruiter Full Name"
                placeholder="e.g. sailesh iyyappan"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Department"
                placeholder="e.g. People & Culture / Engineering Talent"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                icon={Layers}
              />

              <InputField
                label="Professional Title"
                placeholder="e.g. Head of Talent Acquisition"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                icon={Briefcase}
              />
            </div>
          </div>

          {/* SECTION 4: CULTURE, MISSION & PERKS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Company Story, Culture & Employee Perks
            </h3>

            <TextareaInput
              label="Company Overview"
              placeholder="Describe your organization's background, core business, and engineering mission..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextareaInput
                label="Mission Statement"
                rows={3}
                placeholder="What is your organization's primary mission?"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
              />
              <TextareaInput
                label="Vision Statement"
                rows={3}
                placeholder="Where is the company heading in the next 5 years?"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
              />
            </div>

            <TextareaInput
              label="Engineering & Cultural Manifesto"
              rows={2}
              placeholder="e.g. High autonomy, continuous deployment, psychological safety, and async communication..."
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
            />

            {/* Benefits & Perks Customizer */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Benefits, Perks & Employee Offerings
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 100% Health Coverage, Remote Stipend, 401k match, Learning Budget..."
                  value={newBenefitInput}
                  onChange={(e) => setNewBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Perk
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="line-clamp-1">{b}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(b)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <SecondaryButton type="button" onClick={() => setActiveTab('assets')}>
              Manage Source Files & Media →
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSaving} icon={CheckCircle2}>
              Save Profile Changes
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* TAB 2: SOURCE FILES & BRAND MEDIA */}
      {activeTab === 'assets' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-purple-600" />
                Brand Source Files & Media Gallery
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload and manage corporate banners, vector brand assets, office photos, and candidate orientation materials from local files.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => sourceFileInputRef.current?.click()}
                disabled={isUploadingSourceFile}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploadingSourceFile ? 'Processing...' : 'Upload Source Files from Device'}
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onClick={() => sourceFileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-purple-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-white">Click to browse or drop local source files here</p>
            <p className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, WebP, SVG, PDF, and ZIP brand bundles</p>
          </div>

          {/* Current Assets List */}
          {brandAssets.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-400">No brand source files uploaded yet.</p>
              <p className="text-[11px] text-slate-400">Click the button above to upload office photos or cover banners from your device.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandAssets.map((asset) => {
                const isImg = asset.type.startsWith('image/') || asset.url.startsWith('data:image/');
                const isCurrentBanner = coverBanner === asset.url;

                return (
                  <div
                    key={asset.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs flex flex-col justify-between group"
                  >
                    {isImg ? (
                      <div className="relative h-32 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {isCurrentBanner && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                            Active Cover Banner
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-32 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <FileText className="w-8 h-8 text-purple-500 mb-1" />
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 line-clamp-1">{asset.name}</span>
                      </div>
                    )}

                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1" title={asset.name}>
                            {asset.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{asset.size} • Uploaded {asset.uploadedAt}</p>
                        </div>
                        <Badge variant="outline" size="sm">{asset.category || 'Source'}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        {isImg && !isCurrentBanner ? (
                          <button
                            type="button"
                            onClick={() => handleSetAsBanner(asset.url)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            Set as Cover Banner
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            {isCurrentBanner ? 'Selected' : 'File Asset'}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <a
                            href={asset.url}
                            download={asset.name}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Download / View"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <SecondaryButton type="button" onClick={() => setActiveTab('edit')}>
              ← Back to Details
            </SecondaryButton>
            <PrimaryButton type="button" onClick={() => handleSave()} isLoading={isSaving} icon={CheckCircle2}>
              Save All Changes
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE PUBLIC PREVIEW */}
      {activeTab === 'preview' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          {/* Hero Banner Header */}
          <div className="relative h-60 sm:h-72 rounded-3xl overflow-hidden shadow-md">
            <img src={coverBanner} alt="Cover Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-end gap-4">
                <img
                  src={logo}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white dark:bg-slate-800 p-1 border-2 border-white dark:border-slate-700 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black">{name || 'Your Company'}</h2>
                    <Badge variant="info" size="sm">Verified Employer</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1">{tagline}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      {industry}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {headquarters}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      {size}
                    </span>
                  </div>
                </div>
              </div>

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 self-start sm:self-auto border border-white/30"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Visit Website
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>
          </div>

          {/* Recruiter Badge Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={user?.photoURL || user?.avatarUrl} name={recruiterName} size="md" className="rounded-xl" />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">{recruiterName}</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  {employerPosition} • {department} {professionalTitle ? `(${professionalTitle})` : ''}
                </p>
              </div>
            </div>
            <Badge variant="accent" size="sm">Hiring Representative</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">About the Organization</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{description}</p>
              </div>

              {mission && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Mission & Values
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{mission}</p>
                  {culture && <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 italic">{culture}</p>}
                </div>
              )}

              {/* Brand Source Files / Photos Gallery Preview */}
              {brandAssets.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-purple-500" />
                    Brand Media & Workplace Photos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {brandAssets.filter((a) => a.type.startsWith('image/')).slice(0, 6).map((imgAsset) => (
                      <div key={imgAsset.id} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                        <img src={imgAsset.url} alt={imgAsset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                          <span className="text-[10px] text-white font-medium line-clamp-1">{imgAsset.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Open Roles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Active Open Positions ({jobs.length})
                  </h3>
                  <Link to="/my-jobs" className="text-xs font-bold text-blue-600 hover:underline">
                    Manage Postings →
                  </Link>
                </div>
                {jobs.length > 0 ? (
                  <div className="space-y-2">
                    {jobs.slice(0, 3).map((j) => (
                      <div key={j.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
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
            </div>

            {/* Sidebar Column: Overview & Perks */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Company Overview</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span>{size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Globe className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <a href={website} target="_blank" rel="noreferrer" className="hover:underline font-semibold text-blue-600 truncate">
                      {website}
                    </a>
                  </div>
                  {email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {foundedYear && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Founded in {foundedYear}</span>
                    </div>
                  )}
                </div>

                {/* Social links */}
                {(linkedin || github || twitter) && (
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                    {linkedin && (
                      <a href={linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {github && (
                      <a href={github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Benefits Box */}
              {benefits.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Perks & Benefits</h4>
                  <div className="space-y-2">
                    {benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
