import Image from 'next/image';

interface AuthorCardProps {
  name: string;
  avatarUrl?: string | null;
}

export default function AuthorCard({ name, avatarUrl }: AuthorCardProps) {
  return (
    <div className="card p-6 md:p-8 flex items-center gap-5">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={64}
          height={64}
          className="rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-heading font-bold">
            {name[0]?.toUpperCase() || 'E'}
          </span>
        </div>
      )}
      <div>
        <p className="text-caption text-text-muted uppercase tracking-wider mb-1">Écrit par</p>
        <p className="font-heading font-bold text-heading-sm text-text-primary">{name}</p>
        <p className="text-body-sm text-text-muted mt-1">
          Passionné par l&apos;événementiel et les technologies qui transforment l&apos;organisation d&apos;événements.
        </p>
      </div>
    </div>
  );
}
