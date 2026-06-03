interface SERPPreviewProps {
  title: string;
  description: string;
  slug: string;
}

export default function SERPPreview({ title, description, slug }: SERPPreviewProps) {
  const maxTitle = 60;
  const maxDesc = 160;
  const displayUrl = `eventzone.pro › blog › ${slug || 'article-titre'}`;
  const truncTitle = title.length > maxTitle ? title.slice(0, maxTitle) + '…' : title;
  const truncDesc = description.length > maxDesc ? description.slice(0, maxDesc) + '…' : description;

  return (
    <div>
      <p className="text-caption font-medium text-text-muted uppercase tracking-wider mb-3">
        Aperçu Google
      </p>
      <div className="bg-[#1a1d26] rounded-xl p-4 font-body">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-surface border border-border flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary">E</span>
          </div>
          <div>
            <p className="text-[11px] text-text-secondary leading-none">Eventzone Blog</p>
            <p className="text-[11px] text-[#8ab4f8] leading-none">{displayUrl}</p>
          </div>
        </div>
        <p className={`text-[18px] leading-snug mb-1 ${title.length > maxTitle ? 'text-warning' : 'text-[#8ab4f8]'}`}>
          {truncTitle || 'Titre de l\'article'}
        </p>
        <p className={`text-[13px] leading-relaxed ${description.length > maxDesc ? 'text-warning' : 'text-[#bdc1c6]'}`}>
          {truncDesc || 'La méta-description apparaîtra ici. Elle doit faire entre 130 et 160 caractères pour un résultat optimal dans les moteurs de recherche.'}
        </p>
      </div>

      {/* Char counters */}
      <div className="flex justify-between mt-2 text-caption">
        <span className={title.length < 40 || title.length > 60 ? 'text-warning' : 'text-success'}>
          Titre : {title.length}/60 {title.length < 40 ? '(trop court)' : title.length > 60 ? '(trop long)' : '✓'}
        </span>
        <span className={description.length < 130 || description.length > 160 ? 'text-warning' : 'text-success'}>
          Description : {description.length}/160 {description.length > 160 ? '(trop long)' : ''}
        </span>
      </div>
    </div>
  );
}
