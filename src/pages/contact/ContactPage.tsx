import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Badge } from '../../components/common/Badge';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2, Globe2, Building2 } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showSuccessToast('Thank you for reaching out! Your message has been sent successfully.');
  };

  return (
    <PageContainer className="py-10 space-y-12">
      <SectionHeader
        title="Get in Touch with CareerConnect"
        subtitle="Have a question about candidate profiles, recruiter subscriptions, or platform security? We are here to help."
        badge="Contact Us"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-md">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reach out directly to our candidate support, employer relations, or media teams.
            </p>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-400">Headquarters</h4>
                  <p className="text-slate-200 mt-0.5">VIT-AP University</p>
                  <p className="text-slate-200">Amaravati, Andhra Pradesh 522237, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-400">Phone Support</h4>
                  <p className="text-slate-200 mt-0.5">+91 (863) 2377000</p>
                  <p className="text-xs text-slate-400">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-400">Email Inquiries</h4>
                  <p className="text-slate-200 mt-0.5">support@careerconnect.in</p>
                  <p className="text-slate-200">employers@careerconnect.in</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Campus Infrastructure Note:</span> Developed and demonstrated using the high-speed campus Wi-Fi infrastructure of VIT-AP University.
            </div>
          </div>

          {/* Google Map Placeholder */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-500" />
                Primary Headquarters
              </span>
              <Badge variant="info" size="sm">VIT-AP Campus</Badge>
            </div>
            <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-center p-4 space-y-2">
              <Building2 className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">VIT-AP Technology & Innovation Hub</p>
              <p className="text-[11px] text-slate-400">Amaravati • Andhra Pradesh • India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          {isSubmitted ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for contacting CareerConnect. One of our support representatives will respond to your inquiry at <strong>{formData.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send Us a Direct Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  label="Full Name" 
                  placeholder="e.g. Alex Morgan" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
                <InputField 
                  label="Email Address" 
                  type="email" 
                  placeholder="alex@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required 
                />
              </div>

              <InputField 
                label="Subject" 
                placeholder="e.g. General Inquiry / Employer Subscription / Technical Support" 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required 
              />

              <TextareaInput 
                label="Message" 
                placeholder="Please describe your question or inquiry in detail..." 
                rows={5} 
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required 
              />

              <PrimaryButton type="submit" icon={Send} size="lg" className="w-full">
                Send Message
              </PrimaryButton>
            </form>
          )}
        </div>

      </div>
    </PageContainer>
  );
};
