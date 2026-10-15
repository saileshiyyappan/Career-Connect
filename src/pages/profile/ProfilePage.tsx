import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { EmployerProfilePage } from '../employer/EmployerProfilePage';
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  FileText, 
  Upload, 
  Save, 
  CheckCircle2, 
  Plus,
  Briefcase,
  Phone
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { role, user } = useAuth();
<<<<<<< HEAD
  const isEmp = user?.role === 'employer' || role === 'employer';
=======
  const isEmp = user?.role === 'employer' || role === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';
>>>>>>> origin/main
  const effectiveRole = isEmp ? 'employer' : (user?.role || role);
  const { userProfile, updateProfile } = useJobContext();

  // If authenticated user is an Employer, render the dedicated Employer & Company Profile Suite
  if (effectiveRole === 'employer') {
    return <EmployerProfilePage />;
  }

  const [displayName, setDisplayName] = useState(userProfile.displayName || '');
  const [headline, setHeadline] = useState(userProfile.headline || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [phone, setPhone] = useState(userProfile.phone || userProfile.phoneNumber || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [website, setWebsite] = useState(userProfile.website || userProfile.portfolioUrl || '');
  const [githubUrl, setGithubUrl] = useState(userProfile.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile.linkedinUrl || '');

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(userProfile.skills || []);
  const [resumeName, setResumeName] = useState(userProfile.resumeName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setDisplayName(userProfile.displayName);
      if (userProfile.headline !== undefined) setHeadline(userProfile.headline);
      if (userProfile.location !== undefined) setLocation(userProfile.location);
      if (userProfile.phone || userProfile.phoneNumber) setPhone(userProfile.phone || userProfile.phoneNumber || '');
      if (userProfile.bio !== undefined) setBio(userProfile.bio);
      if (userProfile.website || userProfile.portfolioUrl) setWebsite(userProfile.website || userProfile.portfolioUrl || '');
      if (userProfile.githubUrl !== undefined) setGithubUrl(userProfile.githubUrl);
      if (userProfile.linkedinUrl !== undefined) setLinkedinUrl(userProfile.linkedinUrl);
      if (userProfile.skills) setSkills(userProfile.skills);
      if (userProfile.resumeName) setResumeName(userProfile.resumeName);
    }
  }, [userProfile]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateProfile({
      displayName,
      headline,
      location,
      phone,
      phoneNumber: phone,
      bio,
      website,
      portfolioUrl: website,
      githubUrl,
      linkedinUrl,
      skills,
      resumeName,
      resumeUpdatedAt: new Date().toISOString().split('T')[0],
    });
    setIsSaving(false);
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      <SectionHeader
        title="Candidate Profile & Resume"
        subtitle="Manage your professional background, skill set, and resume attachment for recruiters."
        badge="Candidate Profile"
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={userProfile.avatarUrl || userProfile.photoURL}
              name={displayName || userProfile.displayName || 'Name unavailable'}
              size="xl"
              className="rounded-2xl"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{displayName || userProfile.displayName || 'Name unavailable'}</h2>
              <p className="text-xs text-slate-500 font-medium">{userProfile.email}</p>
              <Badge variant="accent" size="sm" className="mt-2">Verified Profile</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <InputField
              label="Full Display Name"
              placeholder="sailesh iyyappan"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              icon={User}
            />

            <InputField
              label="Professional Headline"
              placeholder="e.g. Senior Frontend Engineer"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              icon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Current Location"
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

            <InputField
              label="Personal Portfolio / Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              icon={Globe}
            />
          </div>

          <TextareaInput
            label="About / Bio Summary"
            placeholder="Briefly describe your career background, expertise, and what you are looking for..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Social Links Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Professional Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              icon={Github}
            />

            <InputField
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              icon={Linkedin}
            />
          </div>
        </div>

        {/* Resume & Skills Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Skills & Resume Attachment
          </h3>

          {/* Skills Tag Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Core Skills & Expertise
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Python)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Primary Resume File
            </label>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{resumeName}</p>
                  <p className="text-xs text-slate-500">Last updated {userProfile.resumeUpdatedAt || 'recently'}</p>
                </div>
              </div>

              <label className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Upload New Resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResumeName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <PrimaryButton type="submit" icon={Save} isLoading={isSaving} size="lg">
            Save Profile Changes
          </PrimaryButton>
        </div>

      </form>
    </PageContainer>
  );
};
