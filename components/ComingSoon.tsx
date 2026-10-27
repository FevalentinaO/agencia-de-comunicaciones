import { Seal } from "./Logo";

export default function ComingSoon({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section aria-labelledby="pagina-titulo" className="pt-[4.5rem]">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-center gap-8 px-5 py-24 sm:px-8">
        <div className="flex items-center gap-4">
          <Seal className="h-7 w-auto" />
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <h1 id="pagina-titulo" className="display text-5xl sm:text-7xl">
          {title}
        </h1>
        <hr className="rule max-w-md" />
        <p className="text-lg text-(--text)">Muy pronto.</p>
      </div>
    </section>
  );
}
