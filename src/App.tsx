import React, { useState, useEffect, useCallback } from 'react';
import { 
  DemoProject, 
  Inquiry, 
  ServiceItem, 
  TestimonialItem, 
  WebsiteSettings, 
  AuthSession 
} from './types';
import { 
  subscribeProjects, 
  subscribeInquiries, 
  subscribeServices, 
  subscribeTestimonials, 
  subscribeSettings, 
  seedInitialDataIfEmpty 
} from './services/dbService';
import { getCurrentUser } from './services/authService';
import { DEFAULT_SETTINGS, INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_TESTIMONIALS } from './data/initialData';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedDemos } from './components/FeaturedDemos';
import { DemosSection } from './components/DemosSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { ManagerLoginModal } from './components/ManagerDesk/ManagerLoginModal';
import { ManagerDashboard } from './components/ManagerDesk/ManagerDashboard';
import { DeveloperLoginModal } from './components/DeveloperDesk/DeveloperLoginModal';
import { DeveloperDashboard } from './components/DeveloperDesk/DeveloperDashboard';
import { AlertTriangle, Wrench } from 'lucide-react';

export default function App() {
  // Application Data States
  const [projects, setProjects] = useState<DemoProject[]>(INITIAL_PROJECTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);

  // Navigation & View Mode: 'public' | 'manager' | 'developer'
  const [viewMode, setViewMode] = useState<'public' | 'manager' | 'developer'>('public');

  // Auth States
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const [isManagerLoginOpen, setIsManagerLoginOpen] = useState(false);
  const [isDeveloperLoginOpen, setIsDeveloperLoginOpen] = useState(false);

  // Active Project Details Modal
  const [selectedProject, setSelectedProject] = useState<DemoProject | null>(null);

  // Contact Form Prefill State
  const [prefilledProject, setPrefilledProject] = useState<string>('');

  // Initial Database Seeding & Listener Setup
  useEffect(() => {
    // Check and seed initial demo data if Firestore is empty
    seedInitialDataIfEmpty(false).catch((err) => {
      console.warn('Initial data seeding notice:', err);
    });

    // Check user session
    setCurrentUser(getCurrentUser());

    // Setup real-time Firestore listeners
    const unsubProjects = subscribeProjects((data) => {
      if (data) {
        setProjects(data);
      }
    }, false);

    const unsubInquiries = subscribeInquiries((data) => {
      if (data) {
        setInquiries(data);
      }
    });

    const unsubServices = subscribeServices((data) => {
      if (data) {
        setServices(data);
      }
    }, false);

    const unsubTestimonials = subscribeTestimonials((data) => {
      if (data) {
        setTestimonials(data);
      }
    }, false);

    const unsubSettings = subscribeSettings((data) => {
      if (data) {
        setSettings(data);
      }
    });

    return () => {
      unsubProjects();
      unsubInquiries();
      unsubServices();
      unsubTestimonials();
      unsubSettings();
    };
  }, []);

  // Sync hash routing (e.g. #manager, #developer)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const user = getCurrentUser();
      setCurrentUser(user);

      if (hash === '#manager') {
        if (user?.role === 'manager') {
          setViewMode('manager');
        } else {
          setIsManagerLoginOpen(true);
        }
      } else if (hash === '#developer') {
        if (user?.role === 'developer') {
          setViewMode('developer');
        } else {
          setIsDeveloperLoginOpen(true);
        }
      } else {
        setViewMode('public');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Smooth scroll helper
  const handleScrollToSection = useCallback((sectionId: string) => {
    if (viewMode !== 'public') {
      setViewMode('public');
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [viewMode]);

  // Trigger inquiry with project prefilled
  const handleInquireProject = useCallback((projectName: string) => {
    setPrefilledProject(projectName);
    handleScrollToSection('contact');
  }, [handleScrollToSection]);

  // Auth actions
  const handleManagerLoginSuccess = () => {
    setCurrentUser(getCurrentUser());
    setViewMode('manager');
    window.location.hash = '#manager';
  };

  const handleDeveloperLoginSuccess = () => {
    setCurrentUser(getCurrentUser());
    setViewMode('developer');
    window.location.hash = '#developer';
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('public');
    window.location.hash = '';
  };

  // Switch back to public site
  const handleBackToPublicWebsite = () => {
    setViewMode('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Force re-fetch trigger
  const handleRefreshData = () => {
    // listeners will handle automatically, but we can also re-check currentUser
    setCurrentUser(getCurrentUser());
  };

  // If Manager View is active and authenticated
  if (viewMode === 'manager' && currentUser?.role === 'manager') {
    return (
      <ManagerDashboard
        projects={projects}
        inquiries={inquiries}
        services={services}
        testimonials={testimonials}
        settings={settings}
        onLogout={handleLogout}
        onBackToWebsite={handleBackToPublicWebsite}
        onRefreshData={handleRefreshData}
      />
    );
  }

  // If Developer View is active and authenticated
  if (viewMode === 'developer' && currentUser?.role === 'developer') {
    return (
      <DeveloperDashboard
        projects={projects}
        settings={settings}
        onLogout={handleLogout}
        onBackToWebsite={handleBackToPublicWebsite}
        onRefreshData={handleRefreshData}
      />
    );
  }

  // Main Customer-Facing Website
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600/20 selection:text-blue-900">
      {/* Maintenance Mode Alert Banner if enabled by Developer */}
      {settings.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <Wrench className="w-4 h-4 text-slate-950" />
          <span>Notice: Shujaat Designs is currently performing scheduled system updates. All live demos remain accessible.</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        settings={settings}
        onNavigate={handleScrollToSection}
        onOpenInquiry={() => handleScrollToSection('contact')}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          settings={settings}
          totalProjects={projects.filter((p) => p.published).length}
          onExploreDemos={() => handleScrollToSection('demos')}
          onOpenInquiry={() => handleScrollToSection('contact')}
        />

        {/* Featured Demo Websites Section */}
        <FeaturedDemos
          projects={projects.filter((p) => p.published)}
          settings={settings}
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAllDemos={() => handleScrollToSection('demos')}
        />

        {/* Full Demo Websites Portfolio Section with Search & Categories */}
        <DemosSection
          projects={projects.filter((p) => p.published)}
          settings={settings}
          onSelectProject={(project) => setSelectedProject(project)}
        />

        {/* Agency Services Section */}
        <ServicesSection
          services={services.filter((s) => s.published)}
          settings={settings}
          onSelectService={(serviceName) => {
            setPrefilledProject(serviceName);
            handleScrollToSection('contact');
          }}
        />

        {/* How It Works Section */}
        <HowItWorks />

        {/* About Shujaat Designs Section */}
        <AboutSection settings={settings} />

        {/* Client Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} />

        {/* Contact & Inquiry Form Section */}
        <ContactSection
          settings={settings}
          projects={projects.filter((p) => p.published)}
          prefilledProject={prefilledProject}
        />
      </main>

      {/* Footer with Subtle Manager & Developer Desk Links */}
      <Footer
        settings={settings}
        onNavigate={handleScrollToSection}
        onOpenManagerLogin={() => {
          if (currentUser?.role === 'manager') {
            setViewMode('manager');
            window.location.hash = '#manager';
          } else {
            setIsManagerLoginOpen(true);
          }
        }}
        onOpenDeveloperLogin={() => {
          if (currentUser?.role === 'developer') {
            setViewMode('developer');
            window.location.hash = '#developer';
          } else {
            setIsDeveloperLoginOpen(true);
          }
        }}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Interactive Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        settings={settings}
        onClose={() => setSelectedProject(null)}
        onInquire={handleInquireProject}
      />

      {/* Manager Login Modal */}
      <ManagerLoginModal
        isOpen={isManagerLoginOpen}
        onClose={() => setIsManagerLoginOpen(false)}
        onLoginSuccess={handleManagerLoginSuccess}
      />

      {/* Developer Login Modal */}
      <DeveloperLoginModal
        isOpen={isDeveloperLoginOpen}
        onClose={() => setIsDeveloperLoginOpen(false)}
        onLoginSuccess={handleDeveloperLoginSuccess}
      />
    </div>
  );
}
