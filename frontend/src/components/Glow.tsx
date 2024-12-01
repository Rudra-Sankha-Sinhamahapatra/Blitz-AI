
export default function Glow() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[300px] select-none">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-50 dark:opacity-100">
          <div className="absolute -top-48 left-1/2 -translate-x-1/2">
            <div className="h-[600px] w-[900px] bg-gradient-to-b from-blue-500/30 to-purple-500/30 blur-[120px] dark:from-blue-400/40 dark:to-purple-400/40" />
          </div>
        </div>
      </div>
    </div>
  );
}