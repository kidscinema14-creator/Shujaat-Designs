import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Star, Upload, Trash2, AlertCircle } from 'lucide-react';
import { TestimonialItem } from '../../types';
import { saveTestimonial, uploadImageFile } from '../../services/dbService';

interface TestimonialEditorModalProps {
  testimonial?: TestimonialItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const TestimonialEditorModal: React.FC<TestimonialEditorModalProps> = ({
  testimonial,
  isOpen,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(testimonial?.id);

  const [name, setName] = useState(testimonial?.name || '');
  const [businessName, setBusinessName] = useState(testimonial?.businessName || '');
  const [review, setReview] = useState(testimonial?.review || '');
  const [rating, setRating] = useState<number>(testimonial?.rating || 5);
  const [photoUrl, setPhotoUrl] = useState(testimonial?.photoUrl || '');
  const [published, setPublished] = useState(testimonial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (testimonial) {
      setName(testimonial.name || '');
      setBusinessName(testimonial.businessName || '');
      setReview(testimonial.review || '');
      setRating(testimonial.rating || 5);
      setPhotoUrl(testimonial.photoUrl || '');
      setPublished(testimonial.published ?? true);
    } else {
      setName('');
      setBusinessName('');
      setReview('');
      setRating(5);
      setPhotoUrl('');
      setPublished(true);
    }
    setError('');
  }, [testimonial, isOpen]);

  if (!isOpen) return null;

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file, 'testimonials');
      setPhotoUrl(url);
    } catch (err: any) {
      setError('Photo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !review.trim()) {
      setError('Please provide the client name and review text.');
      return;
    }

    setSaving(true);
    try {
      const payload: TestimonialItem = {
        id: testimonial?.id || 'test_' + Date.now(),
        name: name.trim(),
        businessName: businessName.trim() || 'Business Owner',
        review: review.trim(),
        rating,
        photoUrl: photoUrl.trim() || undefined,
        published,
        createdAt: testimonial?.createdAt || new Date().toISOString(),
      };

      await saveTestimonial(payload);
      onSaved();
      onClose();
    } catch (err: any) {
      setError('Failed to save testimonial: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h3 className="text-base font-extrabold text-slate-900">
            {isEditing ? `Edit Review from ${testimonial?.name}` : 'Add Testimonial'}
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
              Client Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zubair Ahmad"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Business / Organization Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Saffron Heritage Dining"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Review Quote <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did the client say about Shujaat Designs?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* Photo upload (Firebase Storage) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Client Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute inset-0 bg-slate-900/70 text-rose-400 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    className="hidden"
                  />
                </label>
              )}
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Or paste photo URL..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">Published (Visible publicly)</span>
            </label>
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
              Save Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
