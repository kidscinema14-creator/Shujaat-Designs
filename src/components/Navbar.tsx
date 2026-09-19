import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  MessageCircle, 
  ChevronRight, 
  Globe 
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createWhatsAppLink, getGeneralWhatsAppMessage } from '../utils/whatsapp';
import { SHUJAAT_LOGO_URL } from '../assets/logo';

interface NavbarProps {
  settings: WebsiteSettings;
  onOpenInquiry: (projectName?: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenInquiry, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Demo Websites', id: 'demos' },
    { name: 'Services', id: 'services' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const whatsAppLink = createWhatsAppLink(
    settings.whatsappNumber, 
    getGeneralWhatsAppMessage(settings.businessName)
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={SHUJAAT_LOGO_URL} 
              alt={`${settings.businessName} Logo`}
              className="w-11 h-11 rounded-xl object-contain shadow-sm border border-slate-200 bg-slate-950 p-0.5 group-hover:scale-105 transition-transform duration-200"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                {settings.businessName}
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Web Development Agency
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('demos')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              View Demo Websites
            </button>
            <button
              onClick={() => onOpenInquiry()}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              Get Your Website
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              aria-label="WhatsApp Shujaat Designs"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="w-full text-left px-4 py-3 text-base font-semibold text-slate-800 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('demos');
              }}
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              View Demo Websites
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              Get Your Website
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Discuss on WhatsApp ({settings.whatsappNumber})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
