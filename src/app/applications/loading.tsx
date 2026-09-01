export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-xs text-zinc-400 font-medium">Loading applications...</p>
      </div>
    </div>
  );
}
