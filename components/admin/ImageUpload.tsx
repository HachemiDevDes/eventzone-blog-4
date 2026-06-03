'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: '16/9' | '1/1' | '1200/630';
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  hint,
  aspectRatio = '16/9',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setError('');
    setUploading(true);

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  };

  const aspectClass = aspectRatio === '16/9' ? 'aspect-video' : aspectRatio === '1/1' ? 'aspect-square' : 'aspect-[1200/630]';

  return (
    <div>
      {label && (
        <label className="block text-body-sm font-medium text-text-secondary mb-2">{label}</label>
      )}
      <div
        className={`relative ${aspectClass} rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/50 ${uploading ? 'opacity-70' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-body-sm font-medium">Changer l&apos;image</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
            {uploading ? (
              <>
                <svg className="w-8 h-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span className="text-body-sm text-text-muted">Chargement...</span>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-body-sm text-text-secondary">Glissez une image ou <span className="text-primary">cliquez pour parcourir</span></p>
                  {hint && <p className="text-caption text-text-muted mt-1">{hint}</p>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-caption text-danger">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
    </div>
  );
}
