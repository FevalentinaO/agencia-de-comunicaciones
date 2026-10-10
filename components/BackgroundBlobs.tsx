export default function BackgroundBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        data-hero-bg-blob
        className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--shadow-light), transparent 70%)",
        }}
      />
      <div
        data-hero-bg-blob
        className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, var(--shadow-dark), transparent 70%)",
        }}
      />
      <div
        data-hero-bg-blob
        className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--shadow-light), transparent 70%)",
        }}
      />
    </div>
  );
}
