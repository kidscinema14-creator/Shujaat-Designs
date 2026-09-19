import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Check, 
  Layers, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Share2, 
  Copy, 
  CheckCheck 
} from 'lucide-react';
import { DemoProject, WebsiteSettings } from '../types';
import { createWhatsAppLink, getDemoInquiryWhatsAppMessage } from '../utils/whatsapp';

interface ProjectDetailsModalProps {
  project: DemoProject | null;
  settings: WebsiteSettings;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  settings,
  onClose,
  onInquire,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compile full list of screenshots for the gallery
  const allImages = React.useMemo(() => {
    if (!project) return [];
    const list: { url: string; caption: string; type: string }[] = [];

    if (project.desktopScreenshot) {
      list.push({
        url: project.desktopScreenshot,
        caption: 'Desktop Overview',
        type: 'desktop',
      });
    }

    if (project.mobileScreenshot) {
      list.push({
        url: project.mobileScreenshot,
        caption: 'Mobile Responsive View',
        type: 'mobile',
      });
    }

    if (project.screenshots && project.screenshots.length > 0) {
      project.screenshots.forEach((s) => {
        // avoid immediate exact duplicates
        if (!list.some((item) => item.url === s.url)) {
          list.push({
            url: s.url,
            caption: s.caption || 'Project Showcase',
            type: s.type || 'gallery',
          });
        }
      });
    }

    if (list.length === 0) {
      list.push({
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Website Preview',
        type: 'desktop',
      });
    }

    return list;
  }, [project]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const currentImage = allImages[activeImageIndex] || allImages[0];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const whatsAppUrl = createWhatsAppLink(
    settings.whatsappNumber,
    getDemoInquiryWhatsAppMessage(project.name, settings.businessName)
  );

  const handleCopyDemoLink = () => {
    if (project.demoUrl) {
      navigator.clipboard.writeText(project.demoUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured Demo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.demoUrl && (
              <button
                type="button"
                onClick={handleCopyDemoLink}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Copy Demo Link"
                aria-label="Copy demo link"
              >
                {copiedLink ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Main Screenshot Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center group">
              <img
                src={currentImage?.url}
                alt={currentImage?.caption || project.name}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                  currentImage?.type === 'mobile' ? 'max-h-[85%] rounded-lg shadow-xl' : 'w-full h-full object-cover object-top'
                }`}
              />

              {/* Caption Overlay */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-xs text-white border border-slate-800 pointer-events-none">
                {currentImage?.caption} ({activeImageIndex + 1} of {allImages.length})
              </div>

              {/* Next / Previous Controls */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/90 hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-300 transition-colors shadow-md active:scale-95"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/90 hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-300 transition-colors shadow-md active:scale-95"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden border shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Live Demo URL Badge if available */}
            {project.demoUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-bold text-slate-900">Live Prototype URL:</span>
                  <span className="text-blue-700 font-medium truncate max-w-xs sm:max-w-md">
                    {project.demoUrl}
                  </span>
                </div>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                >
                  Visit Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Features & Available Functionality */}
            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Available Functionality & Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar (3 Primary Requested Actions) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                Open Live Demo
              </a>
            )}
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(project.name);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95 text-center"
            >
              Get This Website
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Discuss Custom Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
