import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  CheckCircle, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { DemoProject, ProjectCategory, WebsiteSettings } from '../types';
import { submitInquiry } from '../services/dbService';
import { 
  createWhatsAppLink, 
  getGeneralWhatsAppMessage, 
  getFormSubmissionWhatsAppMessage 
} from '../utils/whatsapp';

interface ContactSectionProps {
  settings: WebsiteSettings;
  projects: DemoProject[];
  prefilledProject?: string;
}

const CATEGORIES: ProjectCategory[] = [
  'Restaurant',
  'Clinic',
  'Salon',
  'Hotel',
  'Education',
  'Portfolio',
  'E-commerce',
  'Business',
  'Real Estate',
  'Appointment Booking',
  'Other',
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  projects,
  prefilledProject = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    mobile: '',
    email: '',
    category: 'Business',
    interestedProject: prefilledProject || '',
    requirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update if prefilled project prop changes
  React.useEffect(() => {
    if (prefilledProject) {
      setFormData((prev) => ({ ...prev, interestedProject: prefilledProject }));
    }
  }, [prefilledProject]);

  const generalWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppMessage(settings.businessName)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.mobile.trim() || !formData.requirements.trim()) {
      setErrorMessage('Please fill in your Name, Mobile Number, and Requirements.');
      return;
    }

    setLoading(true);
    try {
      await submitInquiry({
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        category: formData.category,
        interestedProject: formData.interestedProject,
        requirements: formData.requirements.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setErrorMessage('Unable to submit inquiry at this moment. Please reach out to us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const forwardToWhatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getFormSubmissionWhatsAppMessage(formData, settings.businessName)
  );

  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct WhatsApp & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct WhatsApp & Inquiries</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Let's Discuss Your New Website
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Have a question about a demo website or want a custom quotation for your business? Connect directly with us on WhatsApp or submit your project requirements below.
            </p>

            {/* Direct WhatsApp Callout Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Instant WhatsApp Chat</h4>
                  <p className="text-xs text-emerald-700 font-semibold">Average reply time: under 15 mins</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with Shujaat Designs on WhatsApp to share your ideas, discuss pricing, or schedule a walkthrough.
              </p>

              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp ({settings.whatsappNumber})
              </a>
            </div>

            {/* Contact Details List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{settings.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-md">
              {submitted ? (
                /* Success Confirmation View */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Inquiry Received!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your inquiry has been saved to our system. We will review your requirements and reach out to you shortly.
                  </p>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <p className="text-xs text-blue-700 font-bold">
                      Want faster assistance? Send this inquiry directly via WhatsApp:
                    </p>
                    <a
                      href={forwardToWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Forward Inquiry to WhatsApp
                    </a>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          businessName: '',
                          mobile: '',
                          email: '',
                          category: 'Business',
                          interestedProject: '',
                          requirements: '',
                        });
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Fields */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-200 pb-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Send an Inquiry</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill in your details and requirements. Saved securely to our database.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Bella Italia Bistro"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@business.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Business Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Business Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interested Website */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Interested Demo Website
                      </label>
                      <select
                        value={formData.interestedProject}
                        onChange={(e) => setFormData({ ...formData, interestedProject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      >
                        <option value="">-- General Website Inquiries --</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Requirements & Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Describe what pages, features, or timeline you have in mind..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                    />
                  </div>

                  {/* Submit Button & Optional WhatsApp forward */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving Inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Inquiry
                        </>
                      )}
                    </button>

                    <a
                      href={forwardToWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      Send Directly on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
