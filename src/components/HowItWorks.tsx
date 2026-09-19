import React from 'react';
import { 
  Eye, 
  MessageCircle, 
  Sliders, 
  Link2, 
  Rocket, 
  ArrowRight 
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Choose a Demo',
    description: 'Explore our curated collection of live website demos and pick the layout that best aligns with your business type.',
    icon: Eye,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    step: '02',
    title: 'Discuss Requirements',
    description: 'Connect with us directly on WhatsApp or submit an inquiry to share your exact branding, content, and feature requirements.',
    icon: MessageCircle,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    step: '03',
    title: 'Customize the Website',
    description: 'We tailor the design, visual assets, color palette, interactive forms, and workflow integrations specifically for your business.',
    icon: Sliders,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    step: '04',
    title: 'Connect Information',
    description: 'We connect your real business details, menu or product catalogs, contact numbers, domain name, and WhatsApp hotline.',
    icon: Link2,
    color: 'from-purple-500 to-pink-500',
  },
  {
    step: '05',
    title: 'Launch Your Website',
    description: 'Your polished, responsive website goes live on high-speed cloud hosting with full mobile optimization and manager access.',
    icon: Rocket,
    color: 'from-emerald-500 to-teal-500',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-3 shadow-xs">
            <span>Simple 5-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Getting a modern website for your business is straightforward and hassle-free from demo selection to final launch.
          </p>
        </div>

        {/* Steps Grid: Responsive stacked on mobile, 5 cols on large desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-widest text-slate-500">
                    STEP {s.step}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
