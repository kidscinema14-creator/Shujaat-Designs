import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Activity, 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Loader2, 
  AlertTriangle, 
  Globe, 
  LogOut, 
  HardDrive, 
  Server, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { DemoProject, WebsiteSettings } from '../../types';
import { seedInitialDataIfEmpty, saveSettings, saveProject } from '../../services/dbService';
import { getFirebaseStatus } from '../../lib/firebase';
import { changePassword, logoutUser } from '../../services/authService';

interface DeveloperDashboardProps {
  projects: DemoProject[];
  settings: WebsiteSettings;
  onLogout: () => void;
  onBackToWebsite: () => void;
  onRefreshData: () => void;
}

type DevTabType = 'status' | 'maintenance' | 'data' | 'notes' | 'account';

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  projects,
  settings,
  onLogout,
  onBackToWebsite,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<DevTabType>('status');
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode ?? false);
  const [devNotes, setDevNotes] = useState(settings.developerNotes || 'Shujaat Designs production release v1.0.0. Realtime Firestore sync enabled.');
  const [savingNotes, setSavingNotes] = useState(false);
  const [resettingData, setResettingData] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Import JSON state
  const [importJsonText, setImportJsonText] = useState('');
  const [importing, setImporting] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fbStatus = getFirebaseStatus();

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async (enabled: boolean) => {
    setMaintenanceMode(enabled);
    try {
      await saveSettings({
        ...settings,
        maintenanceMode: enabled,
      });
      showNotice(`Website Maintenance Mode ${enabled ? 'ENABLED' : 'DISABLED'}.`);
      onRefreshData();
    } catch (err: any) {
      showNotice('Error updating maintenance mode: ' + err.message, 'error');
    }
  };

  // Save Developer Notes
  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await saveSettings({
        ...settings,
        developerNotes: devNotes,
      });
      showNotice('Developer technical notes saved.');
      onRefreshData();
    } catch (err: any) {
      showNotice('Error saving notes: ' + err.message, 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  // Reset Demo Data Execution
  const executeResetDemoData = async () => {
    setResettingData(true);
    try {
      await seedInitialDataIfEmpty(true);
      showNotice('Successfully restored default demo samples into Firestore.');
      setConfirmResetOpen(false);
      onRefreshData();
    } catch (err: any) {
      showNotice('Failed to reset demo data: ' + err.message, 'error');
    } finally {
      setResettingData(false);
    }
  };

  // Export JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shujaat_designs_demos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice('Exported demo websites JSON file.');
  };

  // Import JSON
  const handleImportData = async () => {
    if (!importJsonText.trim()) {
      showNotice('Please paste a valid JSON array of demo projects.', 'error');
      return;
    }

    setImporting(true);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be a JSON array of projects.');
      }

      for (const item of parsed) {
        if (item.name) {
          await saveProject({
            ...item,
            id: item.id || 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      showNotice(`Successfully imported ${parsed.length} projects to Firestore!`);
      setImportJsonText('');
      onRefreshData();
    } catch (err: any) {
      showNotice('Import failed: ' + err.message, 'error');
    } finally {
      setImporting(false);
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
      const res = await changePassword('developer', currentPassword, newPassword);
      if (res.success) {
        setPasswordStatus({ type: 'success', message: 'Developer password updated successfully!' });
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Dev Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/shujaat-logo.png" 
              alt="Shujaat Designs" 
              className="w-10 h-10 rounded-xl object-contain border border-slate-200 bg-slate-950 p-0.5 shadow-xs" 
            />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Developer Desk</h2>
              <span className="text-[11px] font-mono text-cyan-600 font-bold">System Console</span>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'status'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>System & Cloud Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Maintenance Mode</span>
            </div>
            {maintenanceMode && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                ACTIVE
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'data'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Data Operations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Developer Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'account'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-cyan-600" />
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
            Logout from Dev Desk
          </button>
        </div>
      </aside>

      {/* Main Dev Content Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto min-h-screen bg-slate-50">
        {actionNotice && (
          <div className={`px-4 py-3 text-xs font-semibold text-center flex items-center justify-center gap-2 sticky top-0 z-30 shadow-sm ${
            actionNotice.type === 'error' ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-white'
          }`}>
            {actionNotice.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{actionNotice.message}</span>
          </div>
        )}

        <div className="p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* TAB: SYSTEM STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">System & Cloud Infrastructure</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time telemetry for Firebase Firestore, Firebase Storage, and WebSocket connections.
                </p>
              </div>

              {/* Status Indicator Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Firestore Status */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-600" />
                      Firebase Firestore
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${fbStatus.firestoreInitialized ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {fbStatus.firestoreInitialized ? 'Connected & Active' : 'Initializing'}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Realtime sync active across {projects.length} demo records
                  </div>
                </div>

                {/* Storage Status */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-600" />
                      Firebase Storage
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${fbStatus.storageInitialized ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {fbStatus.storageInitialized ? 'Ready & Available' : 'Local Fallback'}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Image uploads enabled for screenshots & media
                  </div>
                </div>

                {/* Auth Status */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Security & Auth
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xl font-extrabold text-slate-900">Dual-Desk RBAC</div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Separate Manager & Developer desk session tokens
                  </div>
                </div>
              </div>

              {/* Technical Telemetry Panel */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-600" />
                  Firebase Environment Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">PROJECT ID</span>
                    <span className="text-cyan-700 font-bold">{fbStatus.projectId}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">STORAGE BUCKET</span>
                    <span className="text-cyan-700 font-bold">{fbStatus.storageBucket || 'Default Cloud Bucket'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">APP RUNTIME</span>
                    <span className="text-slate-800 font-semibold">React 19 + Vite + Tailwind CSS</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">SYNC ARCHITECTURE</span>
                    <span className="text-emerald-700 font-bold">onSnapshot WebSocket stream</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MAINTENANCE MODE */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Website Maintenance Mode</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Toggle maintenance mode for public visitors while performing critical updates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Maintenance Mode Status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      When enabled, a maintenance banner will be displayed at the top of the customer website.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => handleToggleMaintenance(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>

                <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
                  maintenanceMode
                    ? 'bg-amber-50 border border-amber-200 text-amber-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-600'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <strong className="block text-slate-900 font-bold">
                      {maintenanceMode ? 'Maintenance Mode is ACTIVE' : 'Maintenance Mode is OFF'}
                    </strong>
                    <span className="mt-0.5 block">
                      {maintenanceMode
                        ? 'Visitors will see an advisory notice at the top of the website indicating active system updates.'
                        : 'The public website is operating normally with all interactive features enabled.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATA OPERATIONS & BACKUP */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Data Operations & Backup</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Reset demo data to curated defaults, export project JSON backups, or import project catalogs.
                </p>
              </div>

              {/* Reset Demo Data Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      Restore Curated Website Demo Samples
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                      Re-seeds the Firestore database with curated, ready-made demo websites across Restaurant, Clinic, Salon, Hotel, Education, and E-commerce categories.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    disabled={resettingData}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs shrink-0"
                  >
                    {resettingData ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Restore Demo Samples
                  </button>
                </div>
              </div>

              {/* Export & Import Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Download className="w-4 h-4 text-cyan-600" />
                      Export Demo Websites
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Download a complete JSON backup of all {projects.length} demo websites currently stored in Firestore.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-cyan-600" />
                    Download JSON Backup ({projects.length} projects)
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      Import Demo Websites
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Paste a JSON array of demo projects to import them directly into Firestore.
                    </p>
                  </div>
                  <textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='[{"name": "New Project", "category": "Restaurant", ...}]'
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-cyan-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleImportData}
                    disabled={importing}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Import to Firestore
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEVELOPER NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Developer Technical Notes</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Record release documentation, integration secrets notes, and architecture reminders.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <textarea
                  rows={8}
                  value={devNotes}
                  onChange={(e) => setDevNotes(e.target.value)}
                  placeholder="Enter developer documentation or handover notes..."
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
                >
                  {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Notes
                </button>
              </div>
            </div>
          )}

          {/* TAB: DEVELOPER ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Developer Security Account</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Update developer password and access credentials.
                </p>
              </div>

              {passwordStatus && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
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
                  Change Developer Password
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Developer Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Developer Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                  >
                    {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Terminal className="w-3.5 h-3.5" />}
                    Update Developer Credentials
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* IN-APP RESET DATA CONFIRMATION MODAL */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Restore Curated Demo Samples?</h3>
                <p className="text-xs text-slate-500">This will repopulate clean initial demo websites in Firestore.</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Are you sure you want to reset all website demos to default showcase data? This will ensure all categories (Restaurant, Clinic, Salon, Hotel, Education, etc.) have rich, live preview entries.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={resettingData}
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resettingData}
                onClick={executeResetDemoData}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {resettingData ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                Confirm & Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
