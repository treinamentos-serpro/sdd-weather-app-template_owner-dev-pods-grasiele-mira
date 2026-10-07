interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/65">{hint}</p>
    </div>
  );
}
