import React, { useState } from 'react';

interface ImageWithPlaceholderProps {
  src?: string | null;
  alt: string;
  slotLabel?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1';
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  slotLabel,
  aspectRatio = '4/3',
  width = 600,
  height = 450,
  className = '',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : 'aspect-[4/3]';

  if (!src || hasError) {
    return (
      <div
        className={`relative w-full ${aspectClass} bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center p-6 text-center overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #E32636 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Clean automotive fuel pump line-art icon */}
        <svg
          className="w-16 h-16 text-neutral-600 mb-3 shrink-0"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Cylindrical electric fuel pump body */}
          <rect x="20" y="16" width="24" height="32" rx="4" />
          {/* Top electrical connector neck & terminals */}
          <path d="M26 16V10H38V16" />
          <circle cx="29" cy="8" r="1.5" fill="currentColor" />
          <circle cx="35" cy="8" r="1.5" fill="currentColor" />
          {/* Fuel outlet nipple */}
          <path d="M38 12H44V15H38" />
          {/* Bottom fuel inlet port and strainer sock mesh */}
          <path d="M28 48V52H36V48" />
          <path d="M16 52H48C49 52 50 53 49 55L45 58C44 59 43 59 42 59H22C21 59 20 59 19 58L15 55C14 53 15 52 16 52Z" strokeDasharray="2 2" />
          {/* Internal direction flow arrow */}
          <path d="M32 40V24M28 28L32 24L36 28" />
        </svg>

        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
          {slotLabel || 'Product Photo Slot'}
        </span>
        <span className="text-[11px] text-[#777777] max-w-xs font-mono">
          Product photo placeholder: replace in site.ts
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-neutral-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};
