export default function LoadingSpinner({ fullScreen = false }) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-cine-red border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cine-dark flex items-center justify-center z-50">
        {inner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-20">{inner}</div>;
}
