import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Code2, 
  Star, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Eye, 
  EyeOff, 
  Search, 
  Globe, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  DemoProject, 
  Inquiry, 
  ServiceItem, 
  TestimonialItem, 
  WebsiteSettings, 
  InquiryStatus 
} from '../../types';
import { 
  deleteProject, 
  updateProjectStatus, 
  deleteInquiry, 
  updateInquiryStatus, 
  deleteService, 
  deleteTestimonial, 
  saveSettings 
} from '../../services/dbService';
import { changePassword, logoutUser } from '../../services/authService';
import { ProjectEditorModal } from './ProjectEditorModal';
import { ServiceEditorModal } from './ServiceEditorModal';
import { TestimonialEditorModal } from './TestimonialEditorModal';
import { createWhatsAppLink } from '../../utils/whatsapp';

interface ManagerDashboardProps {
  projects: DemoProject[];
  inquiries: Inquiry[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  settings: WebsiteSettings;
  onLogout: () => void;
  onBackToWebsite: () => void;
  onRefreshData: () => void;
}

type TabType = 'dashboard' | 'demos' | 'inquiries' | 'services' | 'testimonials' | 'settings' | 'account';

interface DeleteTarget {
  type: 'project' | 'inquiry' | 'service' | 'testimonial';
  id: string;
  name: string;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  projects,
  inquiries,
  services,
  testimonials,
  settings,
  onLogout,
  onBackToWebsite,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals state
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);

  const [isServiceEditorOpen, setIsServiceEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [isTestimonialEditorOpen, setIsTestimonialEditorOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // In-App Deletion Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [projectSearch, setProjectSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState<string>('all');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({ ...settings });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Account password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Action notification banner
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Safe In-App Delete Execution
  const confirmExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'project') {
        await deleteProject(deleteTarget.id);
        showNotice(`Deleted demo project "${deleteTarget.name}".`);
      } else if (deleteTarget.type === 'inquiry') {
        await deleteInquiry(deleteTarget.id);
        showNotice(`Deleted inquiry from "${deleteTarget.name}".`);
      } else if (deleteTarget.type === 'service') {
        await deleteService(deleteTarget.id);
        showNotice(`Deleted service "${deleteTarget.name}".`);
      } else if (deleteTarget.type === 'testimonial') {
        await deleteTestimonial(deleteTarget.id);
        showNotice(`Deleted testimonial from "${deleteTarget.name}".`);
      }
      setDeleteTarget(null);
      onRefreshData();
    } catch (err: any) {
      showNotice('Error deleting: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle publish
  const handleTogglePublishProject = async (proj: DemoProject) => {
    try {
      await updateProjectStatus(proj.id, !proj.published, proj.featured);
      showNotice(`"${proj.name}" is now ${!proj.published ? 'Published (Live)' : 'Hidden (Draft)'}.`);
      onRefreshData();
    } catch (err: any) {
      showNotice('Error updating status: ' + err.message, 'error');
    }
  };

  // Toggle featured
  const handleToggleFeaturedProject = async (proj: DemoProject) => {
    try {
      await updateProjectStatus(proj.id, proj.published, !proj.featured);
      showNotice(`"${proj.name}" is now ${!proj.featured ? 'Featured on Homepage' : 'Standard demo'}.`);
      onRefreshData();
    } catch (err: any) {
      showNotice('Error updating featured flag: ' + err.message, 'error');
    }
  };

  // Inquiries management
  const handleInquiryStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateInquiryStatus(id, newStatus);
      showNotice(`Inquiry status updated to "${newStatus}".`);
      onRefreshData();
    } catch (err: any) {
      showNotice('Error updating inquiry: ' + err.message, 'error');
    }
  };

  // Settings save handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      await saveSettings(settingsForm);
      setSettingsSuccess(true);
      showNotice('Website settings updated successfully.');
      onRefreshData();
    } catch (err: any) {
      showNotice('Error saving settings: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changePassword('manager', currentPassword, newPassword);
      if (res.success) {
        setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: res.error || 'Failed to change password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Compute metrics
  const totalProjectsCount = projects.length;
  const publishedProjectsCount = projects.filter((p) => p.published).length;
  const totalInquiriesCount = inquiries.length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xs">
        {/* Desk Header with Official Logo */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/shujaat-logo.png" 
              alt="Shujaat Designs" 
              className="w-10 h-10 rounded-xl object-contain border border-slate-200 bg-slate-950 p-0.5 shadow-xs" 
            />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Manager Desk</h2>
              <span className="text-[11px] font-semibold text-blue-600">{settings.businessName}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('demos')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'demos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Demo Websites</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'demos' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Inquiries</span>
            </div>
            {newInquiriesCount > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                {newInquiriesCount} new
              </span>
            ) : (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'inquiries' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4" />
              <span>Services</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'services' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {services.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'testimonials'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>Testimonials</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'testimonials' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {testimonials.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Website Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'account'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Manager Account</span>
          </button>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            Back to Public Website
          </button>
          <button
            type="button"
            onClick={() => {
              logoutUser();
              onLogout();
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout from Manager Desk
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen bg-slate-50">
        {/* Top bar status alert notice */}
        {actionNotice && (
          <div className={`px-4 py-3 text-xs font-semibold text-center flex items-center justify-center gap-2 sticky top-0 z-30 shadow-sm animate-in slide-in-from-top-2 ${
            actionNotice.type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {actionNotice.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{actionNotice.message}</span>
          </div>
        )}

        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Manager Dashboard</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Live overview of website demos, customer leads, and business operations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsProjectEditorOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Demo Website
                  </button>
                </div>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Total Demo Websites</span>
                    <Layers className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{totalProjectsCount}</div>
                  <div className="text-[11px] font-medium text-slate-500">
                    <span className="text-emerald-600 font-bold">{publishedProjectsCount} Live</span> on public site
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Customer Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{totalInquiriesCount}</div>
                  <div className="text-[11px] font-medium text-emerald-600">
                    {newInquiriesCount} pending new leads
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Active Services</span>
                    <Code2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{services.length}</div>
                  <div className="text-[11px] font-medium text-slate-500">Web development solutions</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>WhatsApp Connected</span>
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">{settings.whatsappNumber}</div>
                  <div className="text-[11px] font-medium text-slate-500">Instant inquiries route here</div>
                </div>
              </div>

              {/* Quick Action Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Inquiries List */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Recent Inquiries ({inquiries.slice(0, 4).length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {inquiries.length > 0 ? (
                    <div className="space-y-2.5">
                      {inquiries.slice(0, 4).map((inq) => (
                        <div
                          key={inq.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{inq.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-600">
                                {inq.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {inq.interestedProject ? `Demo: ${inq.interestedProject}` : inq.requirements}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            inq.status === 'new' 
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No inquiries received yet. Submit a test inquiry on the website!
                    </p>
                  )}
                </div>

                {/* Demo Websites Summary */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Demo Websites Overview
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('demos')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Manage All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {projects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <img
                            src={p.desktopScreenshot || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100'}
                            alt=""
                            className="w-11 h-8 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">{p.name}</span>
                            <span className="text-[10px] font-medium text-slate-500">{p.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {p.featured && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.published 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {p.published ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEMO WEBSITES MANAGEMENT */}
          {activeTab === 'demos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Demo Websites</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Add, edit, delete, publish/unpublish, and manage screenshots for your website demos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectEditorOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Demo Website
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Filter demos by name or category..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              {/* Demos Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Demo Website</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Demo URL</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Featured</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects
                        .filter((p) => {
                          const q = projectSearch.toLowerCase();
                          return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
                        })
                        .map((project) => (
                          <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={project.desktopScreenshot || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100'}
                                  alt=""
                                  className="w-12 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 block">{project.name}</span>
                                  <span className="text-[11px] text-slate-500 line-clamp-1">{project.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                                {project.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {project.demoUrl ? (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1 truncate max-w-[150px]"
                                >
                                  Open Link <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">No URL set</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleTogglePublishProject(project)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                  project.published
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {project.published ? 'Live' : 'Hidden'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleFeaturedProject(project)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                  project.featured
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                <Sparkles className="w-3 h-3" />
                                {project.featured ? 'Featured' : 'Standard'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProject(project);
                                    setIsProjectEditorOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget({ type: 'project', id: project.id, name: project.name })}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Customer Inquiries</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Review customer website inquiries, respond on WhatsApp, and update status.
                  </p>
                </div>
              </div>

              {/* Inquiries Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search client or business name..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <label className="text-xs text-slate-600 font-semibold">Filter Status:</label>
                  <select
                    value={inquiryFilterStatus}
                    onChange={(e) => setInquiryFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-none shadow-xs"
                  >
                    <option value="all">All Inquiries ({inquiries.length})</option>
                    <option value="new">New ({newInquiriesCount})</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Inquiries List */}
              <div className="space-y-3">
                {inquiries
                  .filter((inq) => {
                    if (inquiryFilterStatus !== 'all' && inq.status !== inquiryFilterStatus) return false;
                    const q = inquirySearch.toLowerCase();
                    if (!q) return true;
                    return (
                      inq.name.toLowerCase().includes(q) ||
                      inq.businessName?.toLowerCase().includes(q) ||
                      inq.mobile.includes(q)
                    );
                  })
                  .map((inq) => {
                    const clientWhatsAppLink = createWhatsAppLink(
                      inq.mobile,
                      `Hello ${inq.name}, thank you for inquiring with ${settings.businessName}! We reviewed your request for a ${inq.category} website.`
                    );

                    return (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-base font-extrabold text-slate-900">{inq.name}</h3>
                              {inq.businessName && (
                                <span className="text-xs text-slate-600 font-medium">
                                  ({inq.businessName})
                                </span>
                              )}
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                {inq.category}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(inq.createdAt || inq.date || Date.now()).toLocaleString()}
                            </span>
                          </div>

                          {/* Status Dropdown */}
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-500 font-semibold">Status:</label>
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as InquiryStatus)}
                              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_discussion">In Discussion</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Contact:</span>
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-slate-800">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <strong>Mobile:</strong> {inq.mobile}
                              </p>
                              {inq.email && (
                                <p className="flex items-center gap-1.5 text-slate-800">
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                  <strong>Email:</strong> {inq.email}
                                </p>
                              )}
                              {inq.interestedProject && (
                                <p className="text-slate-800">
                                  <strong className="text-slate-600">Interested Demo:</strong>{' '}
                                  <span className="text-blue-600 font-semibold">{inq.interestedProject}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Requirements:</span>
                            <p className="p-3 rounded-xl bg-slate-50 text-slate-700 text-xs leading-relaxed border border-slate-200">
                              {inq.requirements}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <a
                            href={clientWhatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            Reply on WhatsApp ({inq.mobile})
                          </a>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'inquiry', id: inq.id, name: inq.name })}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Agency Services</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Add, edit, and organize web development services offered to clients.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsServiceEditorOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          srv.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {srv.published ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      {srv.startingPrice && (
                        <p className="text-xs text-blue-600 font-bold mb-2">{srv.startingPrice}</p>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(srv);
                          setIsServiceEditorOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                        title="Edit Service"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'service', id: srv.id, name: srv.name })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Client Testimonials</h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Manage client reviews and ratings displayed on the public site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsTestimonialEditorOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{t.name}</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-blue-600 mb-2">{t.businessName}</p>
                      <p className="text-xs text-slate-600 italic leading-relaxed mb-4">"{t.review}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(t);
                          setIsTestimonialEditorOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                        title="Edit Testimonial"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'testimonial', id: t.id, name: t.name })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Website & Contact Settings</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Update business name, WhatsApp hotline, hero headlines, and public contact information.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Website settings saved successfully to Firestore!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number (Direct inquiries route to this number)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="+919622229622"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-emerald-700 font-mono font-bold text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Format with country code (e.g. +919622229622).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address / Operating Location
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Section Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Section Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubheadline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Website Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: MANAGER ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Manager Security Credentials</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Update your Manager Desk access password.
                </p>
              </div>

              {passwordStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {passwordStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Change Password
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* IN-APP DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Delete {deleteTarget.type === 'project' ? 'Demo Website' : deleteTarget.type === 'inquiry' ? 'Customer Inquiry' : deleteTarget.type === 'service' ? 'Service' : 'Testimonial'}?
                </h3>
                <p className="text-xs text-slate-500">This action permanently deletes the item from Firestore.</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{deleteTarget.name}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmExecuteDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modals */}
      <ProjectEditorModal
        isOpen={isProjectEditorOpen}
        project={editingProject}
        onClose={() => {
          setIsProjectEditorOpen(false);
          setEditingProject(null);
        }}
        onSaved={() => {
          showNotice('Demo project saved to Firestore.');
          onRefreshData();
        }}
      />

      <ServiceEditorModal
        isOpen={isServiceEditorOpen}
        service={editingService}
        onClose={() => {
          setIsServiceEditorOpen(false);
          setEditingService(null);
        }}
        onSaved={() => {
          showNotice('Service saved to Firestore.');
          onRefreshData();
        }}
      />

      <TestimonialEditorModal
        isOpen={isTestimonialEditorOpen}
        testimonial={editingTestimonial}
        onClose={() => {
          setIsTestimonialEditorOpen(false);
          setEditingTestimonial(null);
        }}
        onSaved={() => {
          showNotice('Testimonial saved to Firestore.');
          onRefreshData();
        }}
      />
    </div>
  );
};
