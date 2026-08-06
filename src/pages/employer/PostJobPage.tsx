import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { SelectInput } from '../../components/inputs/SelectInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { useJobContext } from '../../context/JobContext';
import { EmploymentType, ExperienceLevel } from '../../types';
import {
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Building,
  DollarSign,
  MapPin,
  CheckCircle2,
  FileText,
  Award,
  ShieldCheck,
  Gift
} from 'lucide-react';

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { postJob } = useJobContext();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('TechCorp Global');
  const [category, setCategory] = useState('Engineering');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Senior Level');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [isRemote, setIsRemote] = useState(true);

  // Step 2: Requirements & Skills
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS', 'Node.js']);
  const [qualifications, setQualifications] = useState<string>('B.S. in Computer Science or equivalent software engineering background.');

  // Step 3: Responsibilities & Duties
  const [description, setDescription] = useState('We are seeking a Senior Engineer to architect distributed web interfaces, scale React applications, and partner with product designers.');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState<string[]>(
    ['Architect reusable component systems with React 18 & TypeScript.', 'Maintain 99.9% uptime and low latency for client web apps.', 'Participate in peer code reviews and async design proposals.']
  );
  const [respInput, setRespInput] = useState('');

  // Step 4: Benefits & Perks
  const [benefits, setBenefits] = useState<string[]>([
    'Comprehensive Health, Dental & Vision Insurance (100% Covered)',
    '401(k) Matching up to 6% with immediate vesting',
    '$3,000 Annual Learning & Conference Stipend',
    'Remote Work Flexibility & $1,000 Home Office Budget'
  ]);
  const [benefitInput, setBenefitInput] = useState('');

  // Step 5: Compensation
  const [minSalary, setMinSalary] = useState('140000');
  const [maxSalary, setMaxSalary] = useState('180000');
  const [signingBonus, setSigningBonus] = useState('15000');
  const [equity, setEquity] = useState('10,000 Stock Options');

  // Step 6 & 7: Submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedJobId, setPublishedJobId] = useState<string | null>(null);

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Requirements' },
    { num: 3, title: 'Responsibilities' },
    { num: 4, title: 'Perks & Benefits' },
    { num: 5, title: 'Compensation' },
    { num: 6, title: 'Review & Verify' },
    { num: 7, title: 'Confirmation' },
  ];

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleAddResp = () => {
    if (respInput.trim()) {
      setResponsibilitiesInput([...responsibilitiesInput, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const createdJob = postJob({
        title: title || 'Senior Software Engineer',
        companyName,
        category,
        employmentType,
        experienceLevel,
        salary: {
          min: parseInt(minSalary, 10) || 140000,
          max: parseInt(maxSalary, 10) || 180000,
          currency: 'USD',
          period: 'yearly',
        },
        location: {
          city,
          state,
          country: 'USA',
          isRemote,
        },
        description,
        skillsRequired: skills,
        responsibilities: responsibilitiesInput,
        requirements: [qualifications],
      });

      setIsSubmitting(false);
      setPublishedJobId(createdJob.id);
      setCurrentStep(7);
    }, 600);
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/my-jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>

      <SectionHeader
        title="Multi-Step Job Posting Wizard"
        subtitle="Complete all 7 steps to publish a high-visibility job listing to qualified talent."
        badge="Recruiter Wizard"
      />

      {/* Wizard Progress Steps Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 px-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-bold ${isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {s.title}
                </span>
                {s.num < 7 && <div className="w-4 h-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* STEP 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 1: Role & Organization Basics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Job Position Title"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <InputField
                label="Hiring Company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectInput
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Data & AI', label: 'Data & AI' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Product', label: 'Product' },
                ]}
              />

              <SelectInput
                label="Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                options={[
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                ]}
              />

              <SelectInput
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                options={[
                  { value: 'Entry Level', label: 'Entry Level' },
                  { value: 'Mid Level', label: 'Mid Level' },
                  { value: 'Senior Level', label: 'Senior Level' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <InputField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <InputField label="State" value={state} onChange={(e) => setState(e.target.value)} />
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Remote Work</span>
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Requirements & Skills */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 2: Technical Skills & Qualifications
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Required Technical Skills (Tags)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js, GraphQL..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1">
                    {s}
                    <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="hover:text-rose-500 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                ))}
              </div>
            </div>

            <TextareaInput
              label="Educational & General Qualifications"
              rows={3}
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
            />
          </div>
        )}

        {/* STEP 3: Responsibilities */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 3: Role Description & Key Responsibilities
            </h3>

            <TextareaInput
              label="Role Overview Summary"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Key Deliverables & Responsibilities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add key duty..."
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Add Responsibility
                </button>
              </div>

              <ul className="space-y-2 pt-2">
                {responsibilitiesInput.map((r, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center justify-between">
                    <span>• {r}</span>
                    <button onClick={() => setResponsibilitiesInput(responsibilitiesInput.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer">×</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* STEP 4: Benefits */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 4: Compensation Perks & Employee Benefits
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Add Employer Perks & Benefits
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 100% Health Coverage..."
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Add Perk
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {benefits.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                    <span><CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-2" />{b}</span>
                    <button onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Compensation */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 5: Salary Range & Stock Equity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Min Salary (USD)"
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
              <InputField
                label="Max Salary (USD)"
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Target Signing Bonus (USD)"
                value={signingBonus}
                onChange={(e) => setSigningBonus(e.target.value)}
              />
              <InputField
                label="Stock Equity / Options"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 6: Review */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Step 6: Comprehensive Review & Verification
            </h3>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="accent" size="sm">Listing Preview</Badge>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {title || 'Senior Position'}
                  </h4>
                  <p className="text-xs text-slate-500">{companyName} • {city}, {state} ({isRemote ? 'Remote' : 'On-site'})</p>
                </div>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${parseInt(minSalary).toLocaleString()} - ${parseInt(maxSalary).toLocaleString()} / yr
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <p><strong>Description:</strong> {description}</p>
                <div>
                  <strong>Skills:</strong> {skills.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Confirmation */}
        {currentStep === 7 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Position Published Successfully!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your posting is now active on CareerConnect and visible to verified candidates.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <PrimaryButton onClick={() => navigate(`/jobs/${publishedJobId}`)}>
                View Live Job Listing
              </PrimaryButton>
              <SecondaryButton onClick={() => {
                setCurrentStep(1);
                setTitle('');
              }}>
                Post Another Job
              </SecondaryButton>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        {currentStep < 7 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <SecondaryButton onClick={() => setCurrentStep(currentStep - 1)} icon={ArrowLeft}>
                Previous Step
              </SecondaryButton>
            ) : <div />}

            {currentStep < 6 ? (
              <PrimaryButton onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handlePublish} isLoading={isSubmitting} icon={PlusCircle}>
                Publish Job Position Now
              </PrimaryButton>
            )}
          </div>
        )}

      </div>
    </PageContainer>
  );
};
