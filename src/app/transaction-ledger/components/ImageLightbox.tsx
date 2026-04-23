'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

interface Props {
  images: string[];
  onClose: () => void;
}

export default function ImageLightbox({ images, onClose }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(images.length - 1, c + 1));
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-card rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Proof Image {current + 1} of {images.length}
          </p>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-muted aspect-video flex items-center justify-center">
          <AppImage
            src={images[current]}
            alt={`Transaction proof image ${current + 1}`}
            fill
            className="object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="absolute left-2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(images.length - 1, c + 1))}
                disabled={current === images.length - 1}
                className="absolute right-2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-150 ${i === current ? 'bg-[#0f4c81] scale-125' : 'bg-border hover:bg-muted-foreground'}`}
              />
            ))}
          </div>
          <a
            href={images[current]}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download size={13} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}