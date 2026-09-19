import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DemoProject, WebsiteSettings } from '../types';
import { ProjectCard } from './ProjectCard';

interface FeaturedDemosProps {
  projects: DemoProject[];
  settings: WebsiteSettings;
  onSelectProject: (project: DemoProject) => void;
  onViewAllDemos: () => void;
}

export const FeaturedDemos: React.FC<FeaturedDemosProps> = ({
  projects,
  settings,
  onSelectProject,
  onViewAllDemos,
}) => {
  const featured = projects.filter((p) => p.featured && p.published);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-slate-100/50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Handpicked Demonstrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Website Demos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Curated interactive prototypes ready to be customized and launched for your business.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllDemos}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl text-sm font-bold text-blue-700 hover:text-blue-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Browse All {projects.filter((p) => p.published).length} Demos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              settings={settings}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
