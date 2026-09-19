import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  LayoutGrid, 
  Layers 
} from 'lucide-react';
import { DemoProject, ProjectCategory, WebsiteSettings } from '../types';
import { ProjectCard } from './ProjectCard';

interface DemosSectionProps {
  projects: DemoProject[];
  settings: WebsiteSettings;
  onSelectProject: (project: DemoProject) => void;
}

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Restaurant',
  'Clinic',
  'Salon',
  'Hotel',
  'Education',
  'Portfolio',
  'E-commerce',
  'Business',
  'Real Estate',
  'Appointment Booking',
  'Other',
];

export const DemosSection: React.FC<DemosSectionProps> = ({
  projects,
  settings,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter only published projects for customer website
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.published !== false);
  }, [projects]);

  // Apply search query and category filters
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesName = project.name?.toLowerCase().includes(query);
      const matchesCategoryName = project.category?.toLowerCase().includes(query);
      const matchesDesc = project.description?.toLowerCase().includes(query);
      const matchesFeatures = project.features?.some((f) =>
        f.toLowerCase().includes(query)
      );
      const matchesTech = project.techStack?.some((t) =>
        t.toLowerCase().includes(query)
      );

      return (
        matchesCategory &&
        (matchesName || matchesCategoryName || matchesDesc || matchesFeatures || matchesTech)
      );
    });
  }, [publishedProjects, selectedCategory, searchQuery]);

  return (
    <section id="demos" className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3 shadow-xs">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Interactive Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Explore Demo Websites
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Browse our ready-made website samples across various industries. Click any demo to test the live preview or inquire about tailoring it for your brand.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-10 space-y-5">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search demo websites by name, category, or features..."
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm sm:text-base shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 justify-start md:justify-center px-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm border border-blue-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results Counter / Filter Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredProjects.length}</strong> of{' '}
              {publishedProjects.length} demo websites
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                settings={settings}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No demo websites found</h3>
            <p className="text-sm text-slate-600 mb-6">
              We couldn't find any demo websites matching your criteria. Try adjusting your search or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
