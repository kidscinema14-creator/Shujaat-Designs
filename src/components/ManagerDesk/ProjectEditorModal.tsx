import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Globe, 
  Monitor, 
  Smartphone, 
  Layers, 
  Check, 
  Loader2, 
  AlertCircle, 
  Image as ImageIcon 
} from 'lucide-react';
import { DemoProject, ProjectCategory, ProjectScreenshot } from '../../types';
import { saveProject, uploadImageFile } from '../../services/dbService';

interface ProjectEditorModalProps {
  project?: DemoProject | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES: ProjectCategory[] = [
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

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(project?.id);

  const [name, setName] = useState(project?.name || '');
  const [category, setCategory] = useState<ProjectCategory | string>(project?.category || 'Business');
  const [description, setDescription] = useState(project?.description || '');
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || '');
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [displayOrder, setDisplayOrder] = useState(project?.displayOrder ?? 1);
  
  // Features list
  const [features, setFeatures] = useState<string[]>(
    project?.features?.length ? [...project.features] : ['Mobile Responsive Layout', 'WhatsApp Integration']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Tech stack
  const [techStack, setTechStack] = useState<string[]>(
    project?.techStack?.length ? [...project.techStack] : ['React', 'Tailwind CSS']
  );
  const [newTechInput, setNewTechInput] = useState('');

  // Screenshots
  const [desktopScreenshot, setDesktopScreenshot] = useState(project?.desktopScreenshot || '');
  const [mobileScreenshot, setMobileScreenshot] = useState(project?.mobileScreenshot || '');
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>(
    project?.screenshots ? [...project.screenshots] : []
  );

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Sync state whenever project prop or isOpen changes
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setCategory(project.category || 'Business');
      setDescription(project.description || '');
      setDemoUrl(project.demoUrl || '');
      setFeatured(project.featured ?? false);
      setPublished(project.published ?? true);
      setDisplayOrder(project.displayOrder ?? 1);
      setFeatures(project.features?.length ? [...project.features] : ['Mobile Responsive Layout', 'WhatsApp Integration']);
      setTechStack(project.techStack?.length ? [...project.techStack] : ['React', 'Tailwind CSS']);
      setDesktopScreenshot(project.desktopScreenshot || '');
      setMobileScreenshot(project.mobileScreenshot || '');
      setScreenshots(project.screenshots ? [...project.screenshots] : []);
    } else {
      setName('');
      setCategory('Business');
      setDescription('');
      setDemoUrl('');
      setFeatured(false);
      setPublished(true);
      setDisplayOrder(1);
      setFeatures(['Mobile Responsive Layout', 'WhatsApp Integration']);
      setTechStack(['React', 'Tailwind CSS']);
      setDesktopScreenshot('');
      setMobileScreenshot('');
      setScreenshots([]);
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  // Handlers for features
  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Handlers for tech
  const handleAddTech = () => {
    if (newTechInput.trim()) {
      setTechStack([...techStack, newTechInput.trim()]);
      setNewTechInput('');
    }
  };

  const handleRemoveTech = (idx: number) => {
    setTechStack(techStack.filter((_, i) => i !== idx));
  };

  // File Upload Handlers with Firebase Storage
  const handleUploadDesktop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDesktop(true);
    try {
      const url = await uploadImageFile(file, 'projects/desktop');
      setDesktopScreenshot(url);
    } catch (err: any) {
      setError('Failed to upload desktop image: ' + err.message);
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleUploadMobile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMobile(true);
    try {
      const url = await uploadImageFile(file, 'projects/mobile');
      setMobileScreenshot(url);
    } catch (err: any) {
      setError('Failed to upload mobile image: ' + err.message);
    } finally {
      setUploadingMobile(false);
    }
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const newItems: ProjectScreenshot[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageFile(file, 'projects/gallery');
        newItems.push({
          id: 'scr_' + Date.now() + '_' + i,
          url,
          caption: file.name.split('.')[0] || 'Gallery View',
          type: 'gallery',
          order: screenshots.length + i + 1,
        });
      }
      setScreenshots([...screenshots, ...newItems]);
    } catch (err: any) {
      setError('Failed to upload gallery images: ' + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots(screenshots.filter((s) => s.id !== id));
  };

  const handleMoveScreenshot = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === screenshots.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...screenshots];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setScreenshots(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }

    setSaving(true);
    try {
      const projectId = project?.id || 'proj_' + Date.now();
      const payload: DemoProject = {
        id: projectId,
        name: name.trim(),
        category,
        description: description.trim(),
        demoUrl: demoUrl.trim(),
        featured,
        published,
        displayOrder: Number(displayOrder) || 1,
        features,
        techStack,
        desktopScreenshot: desktopScreenshot.trim() || undefined,
        mobileScreenshot: mobileScreenshot.trim() || undefined,
        screenshots,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveProject(payload);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError('Failed to save demo project: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {isEditing ? `Edit Demo: ${project?.name}` : 'Add New Demo Website'}
            </h3>
            <p className="text-xs text-slate-500">
              Changes sync directly to Firebase Firestore in real-time
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Name, Category, Order */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Website Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saffron Bistro & Lounge"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 shadow-xs font-bold"
              />
            </div>
          </div>

          {/* Row 2: Live Demo URL & Visibility Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Live Demo Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://preview.yourdemowebsite.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-5 flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">Published (Visible on site)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Short Description & Value Proposition
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the website layout, purpose, and key customer benefits..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-xs leading-relaxed"
            />
          </div>

          {/* Features Builder */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Features & Functionality Checklist
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. Interactive Food Menu with Dietary Filters"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Feature
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-800 font-medium"
                >
                  <span className="truncate pr-2">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Technologies Used
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTechInput}
                onChange={(e) => setNewTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="e.g. Next.js, Firebase, WhatsApp API"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tech
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Screenshots Management (Firebase Storage) */}
          <div className="border-t border-slate-200 pt-5 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Screenshots & Media
              </h4>
              <span className="text-[11px] text-slate-500">
                Upload image files or paste image URLs
              </span>
            </div>

            {/* Desktop & Mobile Screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Desktop Screenshot */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    Desktop Screenshot
                  </span>
                  {uploadingDesktop && (
                    <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  )}
                </div>

                {desktopScreenshot ? (
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-xs">
                    <img
                      src={desktopScreenshot}
                      alt="Desktop preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => setDesktopScreenshot('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500 font-medium">No desktop screenshot uploaded</p>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    value={desktopScreenshot}
                    onChange={(e) => setDesktopScreenshot(e.target.value)}
                    placeholder="Or paste Desktop Image URL..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <label className="block text-center py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-xs">
                    Upload From Computer
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadDesktop}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Mobile Screenshot */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    Mobile Screenshot
                  </span>
                  {uploadingMobile && (
                    <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  )}
                </div>

                {mobileScreenshot ? (
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-xs flex items-center justify-center">
                    <img
                      src={mobileScreenshot}
                      alt="Mobile preview"
                      className="max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setMobileScreenshot('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center p-4 text-center">
                    <Smartphone className="w-6 h-6 text-slate-400 mb-1" />
                    <p className="text-xs text-slate-500 font-medium">No mobile screenshot uploaded</p>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    value={mobileScreenshot}
                    onChange={(e) => setMobileScreenshot(e.target.value)}
                    placeholder="Or paste Mobile Image URL..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <label className="block text-center py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-xs">
                    Upload From Computer
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadMobile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Screenshots / Gallery */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Additional Gallery Screenshots ({screenshots.length})
                </span>
                <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                  {uploadingGallery ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  Add Screenshots
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadGallery}
                    className="hidden"
                  />
                </label>
              </div>

              {screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {screenshots.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-xs"
                    >
                      <img
                        src={item.url}
                        alt={item.caption || 'Screenshot'}
                        className="w-full aspect-[16/10] object-cover"
                      />
                      <div className="p-1.5 text-[10px] text-slate-600 truncate bg-slate-50 border-t border-slate-100">
                        {item.caption || `Image ${idx + 1}`}
                      </div>
                      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleMoveScreenshot(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg bg-white/90 text-slate-700 hover:text-slate-950 disabled:opacity-30 shadow-xs"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveScreenshot(idx, 'down')}
                          disabled={idx === screenshots.length - 1}
                          className="p-1 rounded-lg bg-white/90 text-slate-700 hover:text-slate-950 disabled:opacity-30 shadow-xs"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(item.id)}
                          className="p-1 rounded-lg bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white shadow-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">
                  No additional gallery screenshots added. Click 'Add Screenshots' to upload.
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving to Firestore...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {isEditing ? 'Save Changes' : 'Publish Demo Website'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
