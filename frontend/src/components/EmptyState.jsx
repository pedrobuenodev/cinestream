import Link from 'next/link';

export default function EmptyState({
  icon = '🎬',
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionHref,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400 text-sm max-w-md mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-cine-red hover:bg-cine-red-hover text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
