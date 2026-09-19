import React from 'react';
import { 
  CheckCircle2, 
  Code, 
  Smartphone, 
  Flame, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createWhatsAppLink, getGeneralWhatsAppMessage } from '../utils/whatsapp';

interface AboutSectionProps {
  settings: WebsiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const whatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppMessage(settings.businessName)
  );

  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>About Shujaat Designs</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Crafting Purpose-Built Websites for Modern Businesses
            </h2>

            <p className="text-base text-slate-700 leading-relaxed font-normal">
              Shujaat Designs creates professional websites and customized digital solutions for businesses. We bridge the gap between design aesthetic and practical commercial functionality.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              Instead of abstract mockups or slow development cycles, we build interactive demo samples across restaurants, clinics, salons, retail, and service businesses. This lets you explore live user journeys, test mobile responsiveness, and understand exact functionality before launching.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Mobile-First Precision</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tested across phone screens for effortless customer browsing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">WhatsApp Integration</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Direct lead generation connecting visitors straight to your chat.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Firebase Cloud Backends</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Secure real-time database, media storage, and quick data syncing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Manager Desks</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Easy control panels to update menus, rates, and projects anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Discuss Your Project With Shujaat Designs
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase Box */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/shujaat-logo.png" 
                    alt="Shujaat Designs" 
                    className="w-7 h-7 rounded-md object-contain bg-slate-950 p-0.5" 
                  />
                  <span className="text-sm font-bold text-slate-900">Shujaat Designs</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">shujaatdesigns.com</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-blue-700 font-bold block mb-1">Architecture</span>
                  <p className="text-sm text-slate-900 font-medium">
                    Modern Stack: React 19, TypeScript, Tailwind CSS & Firebase Cloud Platform
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-emerald-700 font-bold block mb-1">Customer Conversion</span>
                  <p className="text-sm text-slate-900 font-medium">
                    Zero friction WhatsApp routing + instant cloud inquiry notifications
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-indigo-700 font-bold block mb-1">Client Autonomy</span>
                  <p className="text-sm text-slate-900 font-medium">
                    Dedicated Manager Desk for easy content updates without coding
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                Direct Contact: <strong className="text-slate-800">{settings.phone}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
