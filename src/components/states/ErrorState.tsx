interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-white/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-white/15 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        Tentar novamente
      </button>
    </div>
  );
}
