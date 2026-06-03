interface OGPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
}

export default function OGPreview({ title, description, imageUrl }: OGPreviewProps) {
  return (
    <div>
      <p className="text-caption font-medium text-text-muted uppercase tracking-wider mb-3">
        Aperçu Open Graph
      </p>
      {/* OG card in 1200:630 aspect ratio */}
      <div className="rounded-xl overflow-hidden border border-border bg-[#1a1d26]" style={{ aspectRatio: '1200/630' }}>
        {imageUrl ? (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="OG preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
              <p className="text-white font-heading font-bold text-body leading-tight line-clamp-2">{title}</p>
              {description && (
                <p className="text-white/70 text-caption mt-1 line-clamp-1">{description}</p>
              )}
              <p className="text-white/50 text-[10px] mt-2 uppercase tracking-wider">eventzone.pro</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-caption text-text-muted">Uploadez une image OG (1200×630)</p>
          </div>
        )}
      </div>
    </div>
  );
}
