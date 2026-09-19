import React from 'react';
import { MessageCircle } from 'lucide-react';
import { createWhatsAppLink, getGeneralWhatsAppMessage } from '../utils/whatsapp';
import { WebsiteSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: WebsiteSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const whatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppMessage(settings.businessName)
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 group">
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-600/40 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with Shujaat Designs on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current text-white" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
          Chat on WhatsApp
        </span>
        <span className="relative flex h-2.5 w-2.5 sm:hidden">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200" />
        </span>
      </a>
    </div>
  );
};
