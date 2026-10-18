type HomeSectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
};

export default function HomeSectionHeading({
  eyebrow,
  title,
  accent,
  align = "left",
}: HomeSectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto text-center" : "text-left"}>
      <div
        className={
          "mb-3 flex items-center gap-3 text-sm font-medium text-slate-700 " +
          (centered ? "justify-center" : "")
        }
      >
        <span>{eyebrow}</span>
        <span className="h-px w-24 bg-[var(--brand-blue)] sm:w-32" aria-hidden="true" />
      </div>
      <h2 className="max-w-3xl text-[34px] font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-[42px]">
        {title}{accent ? <> <span className="text-[var(--brand-blue)]">{accent}</span></> : null}
      </h2>
    </div>
  );
}
