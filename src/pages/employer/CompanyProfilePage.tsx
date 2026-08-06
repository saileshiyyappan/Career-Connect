import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { SelectInput } from '../../components/inputs/SelectInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { employerPortalService, CompanyProfile } from '../../services/employerPortalService';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  CheckCircle2,
  Upload,
  Sparkles,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.companyName || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [size, setSize] = useState(user?.companySize || '');
  const [headquarters, setHeadquarters] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.companyWebsite || user?.website || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || '');
  const [linkedin, setLinkedin] = useState(user?.linkedinUrl || '');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState(user?.githubUrl || '');
  const [description, setDescription] = useState(user?.bio || '');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [culture, setCulture] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefitInput, setNewBenefitInput] = useState('');

  useEffect(() => {
    employerPortalService.getCompanyProfile().then((data) => {
      setProfile(data);
      if (!user?.companyName) setName(data.name);
      if (!user?.industry) setIndustry(data.industry);
      if (!user?.companySize) setSize(data.size);
      if (!user?.location) setHeadquarters(data.headquarters);
      if (!user?.companyWebsite && !user?.website) setWebsite(data.website);
      if (!user?.email) setEmail(data.email);
      if (!user?.phone && !user?.phoneNumber) setPhone(data.phone);
      if (!user?.linkedinUrl) setLinkedin(data.socialLinks.linkedin || '');
      setTwitter(data.socialLinks.twitter || '');
      if (!user?.githubUrl) setGithub(data.socialLinks.github || '');
      if (!user?.bio) setDescription(data.description);
      setMission(data.mission);
      setVision(data.vision);
      setCulture(data.culture);
      setBenefits(data.benefits || []);
    });
  }, [user]);

  const handleAddBenefit = () => {
    if (newBenefitInput.trim() && !benefits.includes(newBenefitInput.trim())) {
      setBenefits([...benefits, newBenefitInput.trim()]);
      setNewBenefitInput('');
    }
  };

  const handleRemoveBenefit = (bToRemove: string) => {
    setBenefits(benefits.filter(b => b !== bToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    await updateUserProfile({
      companyName: name,
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
    });

    const updated = await employerPortalService.updateCompanyProfile({
      name,
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
      benefits
    });

    setProfile(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!profile) {
    return (
      <PageContainer className="py-12 text-center">
        <p className="text-sm font-semibold text-slate-400">Loading company profile...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Company Profile Management"
          subtitle="Manage your brand presence, cultural values, perks, and public employer page."
          badge="Employer Branding"
        />

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Public Preview
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Company profile updated successfully! Changes are live on your job listings.
        </div>
      )}

      {activeTab === 'edit' ? (
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Header & Logo Upload Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Brand Identity & Media
            </h3>

            {/* Cover Banner Placeholder */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
              <img
                src={profile.coverBanner}
                alt="Cover Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload New Banner Photo
                </button>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Change Logo
                </button>
                <p className="text-[11px] text-slate-400 mt-1">Recommended: 400x400 PNG or SVG with light background.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              General Organization Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Company Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <InputField
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
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
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
              />
              <InputField
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Contact Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Social Profiles & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="LinkedIn Profile URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
              <InputField
                label="Twitter / X Profile URL"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
              />
              <InputField
                label="GitHub Organization URL"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {/* About & Culture */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Culture, Mission & Benefits
            </h3>

            <TextareaInput
              label="Company Overview"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextareaInput
                label="Mission Statement"
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
              />
              <TextareaInput
                label="Vision Statement"
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
              />
            </div>

            <TextareaInput
              label="Work Culture & Team Principles"
              rows={3}
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
            />

            {/* Benefits List */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Employee Benefits & Perks
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 100% Health Coverage, Gym Stipend..."
                  value={newBenefitInput}
                  onChange={(e) => setNewBenefitInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Add Benefit
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

          <div className="flex justify-end gap-3 pt-4">
            <PrimaryButton type="submit" isLoading={isSaving} icon={CheckCircle2}>
              Save Profile Changes
            </PrimaryButton>
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="relative h-56 rounded-3xl overflow-hidden">
            <img src={profile.coverBanner} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-end gap-4 text-white">
              <img
                src={profile.logo}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black">{profile.name}</h2>
                  <Badge variant="info" size="sm">Verified Employer</Badge>
                </div>
                <p className="text-xs text-slate-200">{profile.industry} • {profile.headquarters}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">About Us</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{profile.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Mission</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{profile.mission}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Vision</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{profile.vision}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Perks & Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.benefits.map((b) => (
                    <div key={b} className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Company Details</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{profile.size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <a href={profile.website} target="_blank" rel="noreferrer" className="hover:underline font-semibold text-blue-600">
                      {profile.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
