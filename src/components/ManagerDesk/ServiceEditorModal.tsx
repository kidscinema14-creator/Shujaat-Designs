import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import { ServiceItem } from '../../types';
import { saveService } from '../../services/dbService';

interface ServiceEditorModalProps {
  service?: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const AVAILABLE_ICONS = [
  'Building2',
  'Utensils',
  'Stethoscope',
  'Scissors',
  'CalendarCheck',
  'ShoppingBag',
  'LayoutDashboard',
  'Flame',
  'Code2',
  'CreditCard',
  'MessageSquare',
  'Sparkles',
];

export const ServiceEditorModal: React.FC<ServiceEditorModalProps> = ({
  service,
  isOpen,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(service?.id);

  const [name, setName] = useState(service?.name || '');
  const [description, setDescription] = useState(service?.description || '');
  const [iconName, setIconName] = useState(service?.iconName || 'Building2');
  const [startingPrice, setStartingPrice] = useState(service?.startingPrice || '');
  const [published, setPublished] = useState(service?.published ?? true);
  const [displayOrder, setDisplayOrder] = useState(service?.displayOrder ?? 1);
  const [features, setFeatures] = useState<string[]>(
    service?.features?.length ? [...service.features] : ['Mobile Responsive', 'SEO Optimized']
  );
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name || '');
      setDescription(service.description || '');
      setIconName(service.iconName || 'Building2');
      setStartingPrice(service.startingPrice || '');
      setPublished(service.published ?? true);
      setDisplayOrder(service.displayOrder ?? 1);
      setFeatures(service.features?.length ? [...service.features] : ['Mobile Responsive', 'SEO Optimized']);
    } else {
      setName('');
      setDescription('');
      setIconName('Building2');
      setStartingPrice('');
      setPublished(true);
      setDisplayOrder(1);
      setFeatures(['Mobile Responsive', 'SEO Optimized']);
    }
    setError('');
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a service name.');
      return;
    }

    setSaving(true);
    try {
      const payload: ServiceItem = {
        id: service?.id || 'srv_' + Date.now(),
        name: name.trim(),
        description: description.trim(),
        iconName,
        startingPrice: startingPrice.trim() || undefined,
        published,
        displayOrder: Number(displayOrder) || 1,
        features,
      };

      await saveService(payload);
      onSaved();
      onClose();
    } catch (err: any) {
      setError('Failed to save service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h3 className="text-base font-extrabold text-slate-900">
            {isEditing ? `Edit Service: ${service?.name}` : 'Add New Service'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Restaurant & Cafe Website"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Icon
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              >
                {AVAILABLE_ICONS.map((ico) => (
                  <option key={ico} value={ico}>
                    {ico}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Starting Price (Optional)
              </label>
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="e.g. ₹9,999 or Custom Quote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short overview of what is included in this service..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Key Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add bullet point..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">Published (Visible on site)</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 font-semibold">Order:</label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-16 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
