import React from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createWhatsAppLink, getGeneralWhatsAppMessage } from '../utils/whatsapp';

interface HeroProps {
  settings: WebsiteSettings;
  totalProjects: number;
  onExploreDemos: () => void;
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  settings, 
  totalProjects, 
  onExploreDemos, 
  onOpenInquiry 
}) => {
  const whatsAppLink = createWhatsAppLink(
    settings.whatsappNumber, 
    getGeneralWhatsAppMessage(settings.businessName)
  );

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/60 border-b border-slate-200/80">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      
      {/* Soft Glow Ambient Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[40rem] h-[22rem] bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-cyan-200/30 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge with Logo */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-slate-800 mb-8 shadow-xs">
            <img 
              src="/shujaat-logo.png" 
              alt="Shujaat Designs" 
              className="w-5 h-5 rounded-md object-contain bg-slate-950 p-0.5" 
            />
            <span className="text-blue-700">Official Portfolio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 font-medium">{totalProjects} Live Demos Available</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-6">
            {settings.heroHeadline || 'Professional Websites for Your Business'}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            {settings.heroSubheadline || 'Explore our ready-made website demos and get a professional website customized for your business.'}
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onExploreDemos}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5"
            >
              <Eye className="w-5 h-5" />
              Explore Demo Websites
            </button>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-xs flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Discuss on WhatsApp
            </a>
          </div>

          {/* Quality Proof Points Cards */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-left">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Fast Turnaround</h4>
                <p className="text-xs text-slate-500">Launch in days</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
              <Smartphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mobile Optimized</h4>
                <p className="text-xs text-slate-500">100% responsive fluid UI</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">WhatsApp Direct</h4>
                <p className="text-xs text-slate-500">Instant client leads</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Manager Desk</h4>
                <p className="text-xs text-slate-500">Easy client control</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
