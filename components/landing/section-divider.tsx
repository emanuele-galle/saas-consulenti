export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div
        className="h-px w-16 sm:w-24"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--theme-color, #c21d17))",
          opacity: 0.3,
        }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, var(--theme-color, #c21d17), var(--generali-gold, #D4A537))",
        }}
      />
      <div
        className="h-px w-16 sm:w-24"
        style={{
          background:
            "linear-gradient(90deg, var(--theme-color, #c21d17), transparent)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
