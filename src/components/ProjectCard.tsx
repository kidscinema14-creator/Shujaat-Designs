import React from 'react';
import { 
  ExternalLink, 
  Info, 
  MessageCircle, 
  Check, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { DemoProject, WebsiteSettings } from '../types';
import { createWhatsAppLink, getDemoInquiryWhatsAppMessage } from '../utils/whatsapp';

interface ProjectCardProps {
  project: DemoProject;
  settings: WebsiteSettings;
  onSelectProject: (project: DemoProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  settings, 
  onSelectProject 
}) => {
  const whatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getDemoInquiryWhatsAppMessage(project.name, settings.businessName)
  );

  const primaryImage = project.desktopScreenshot || 
    (project.screenshots && project.screenshots.length > 0 ? project.screenshots[0].url : '') ||
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

  const handleOpenDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.demoUrl) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelectProject(project);
    }
  };

  return (
    <div 
      id={`project-card-${project.id}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500/60 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col overflow-hidden"
    >
      {/* Screenshot & Top Media Banner */}
      <div 
        onClick={() => onSelectProject(project)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={`${project.name} demo screenshot`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges on Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 border border-slate-200/90 shadow-sm">
            {project.category}
          </span>
          
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-800 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Featured
            </span>
          )}
        </div>

        {/* Hover Quick Overlay Action */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/40 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(project);
            }}
            className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-50 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Info className="w-3.5 h-3.5" />
            View Details
          </button>
          {project.demoUrl && (
            <button
              type="button"
              onClick={handleOpenDemo}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <div className="mb-2">
          <h3 
            onClick={() => onSelectProject(project)}
            className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {project.name}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Features Checklist */}
        {project.features && project.features.length > 0 && (
          <div className="my-3 py-3 border-y border-slate-100 space-y-1.5">
            {project.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-medium">{feat}</span>
              </div>
            ))}
            {project.features.length > 3 && (
              <div className="text-[11px] text-blue-600 font-semibold pl-5">
                +{project.features.length - 3} more features included
              </div>
            )}
          </div>
        )}

        {/* Tech Stack Pills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="mt-auto pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenDemo}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              View Demo
            </button>
            <button
              type="button"
              onClick={() => onSelectProject(project)}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-blue-600" />
              View Details
            </button>
          </div>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            Inquire About This Website
          </a>
        </div>
      </div>
    </div>
  );
};
