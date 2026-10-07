export default function LoadingState() {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-8 text-white/75">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-white/25 border-t-accent-400"
      />
      <span>Carregando...</span>
    </div>
  );
}
