import React from 'react';
import { 
  Building2, 
  Utensils, 
  Stethoscope, 
  Scissors, 
  CalendarCheck, 
  ShoppingBag, 
  LayoutDashboard, 
  Flame, 
  Code2, 
  CreditCard, 
  MessageSquare, 
  Sparkles, 
  Check, 
  ArrowRight, 
  MessageCircle 
} from 'lucide-react';
import { ServiceItem, WebsiteSettings } from '../types';
import { createWhatsAppLink, getCategoryWhatsAppMessage } from '../utils/whatsapp';

interface ServicesSectionProps {
  services: ServiceItem[];
  settings: WebsiteSettings;
  onSelectService: (serviceName: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  Utensils,
  Stethoscope,
  Scissors,
  CalendarCheck,
  ShoppingBag,
  LayoutDashboard,
  Flame,
  Code2,
  CreditCard,
  MessageSquare,
  Sparkles,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  settings,
  onSelectService,
}) => {
  const publishedServices = services.filter((s) => s.published !== false);

  return (
    <section id="services" className="py-20 md:py-28 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3 shadow-xs">
            <Code2 className="w-3.5 h-3.5" />
            <span>Tailored Digital Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Services We Provide
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From high-conversion business websites to custom administrative dashboards and WhatsApp ordering channels, we build complete web solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedServices.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Code2;
            const whatsAppUrl = createWhatsAppLink(
              settings.whatsappNumber,
              getCategoryWhatsAppMessage(service.name, settings.businessName)
            );

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center text-white transition-colors duration-200 mb-5 shadow-xs">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title & Starting Price */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    {service.startingPrice && (
                      <span className="inline-block text-xs font-bold text-blue-700 mt-1">
                        Starting from: {service.startingPrice}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-200">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-2 space-y-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Discuss on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.name)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    Inquire via Form
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
