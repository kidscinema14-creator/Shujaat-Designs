import React from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Terminal, 
  ExternalLink 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createWhatsAppLink, getGeneralWhatsAppMessage } from '../utils/whatsapp';
import { SHUJAAT_LOGO_URL } from '../assets/logo';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (sectionId: string) => void;
  onOpenManagerLogin: () => void;
  onOpenDeveloperLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenManagerLogin,
  onOpenDeveloperLogin,
}) => {
  const whatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppMessage(settings.businessName)
  );

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src={SHUJAAT_LOGO_URL} 
                alt="Shujaat Designs" 
                className="w-8 h-8 rounded-lg object-contain bg-slate-950 p-0.5 border border-slate-700" 
              />
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {settings.businessName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.businessDescription || 'Professional web development agency creating interactive demo websites and tailored digital business solutions.'}
            </p>
            <div className="pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/80 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                WhatsApp: {settings.whatsappNumber}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hero')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('demos')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Demo Websites
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About Shujaat Designs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Business Demo Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Demo Categories</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">Restaurant Websites</button></li>
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">Clinic & Healthcare</button></li>
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">Salon & Beauty Studio</button></li>
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">Hotel & Resort Booking</button></li>
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">E-commerce Stores</button></li>
              <li><button onClick={() => onNavigate('demos')} className="hover:text-cyan-400 transition-colors">Real Estate Portals</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Connect</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{settings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{settings.email}</span>
              </p>
              <p className="flex items-start gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Subtle Manager & Developer Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{settings.footerText || `© ${new Date().getFullYear()} Shujaat Designs. All rights reserved.`}</p>

          {/* Small subtle text links for Manager Desk & Developer Desk */}
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={onOpenManagerLogin}
              className="text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1 focus:outline-none"
              title="Secure Manager Login"
            >
              <Shield className="w-3 h-3 text-slate-400" />
              Manager Desk
            </button>
            <span className="text-slate-800">•</span>
            <button
              type="button"
              onClick={onOpenDeveloperLogin}
              className="text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1 focus:outline-none"
              title="Technical Developer Management"
            >
              <Terminal className="w-3 h-3 text-slate-400" />
              Developer Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
