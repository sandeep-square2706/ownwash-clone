import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export function PartnerLogo() {
  return (
    <Link href="/partner" className="cp-logo" aria-label="Zaapino Partner home">
      <span className="cp-logo-mark">
        <Image src="/images/logo/zaapino-logo-transparent.png" alt="Zaapino" width={56} height={56} priority />
      </span>
      <span>Zaap<span className="cp-logo-accent">ino</span><small>PARTNER PORTAL</small></span>
    </Link>
  );
}

export function PartnerPublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="cp-public-shell">
      <header className="cp-public-header">
        <PartnerLogo />
        <nav className="cp-public-links">
          <Link href="/">Customer website</Link>
          <Link href="/partner/login">Partner login</Link>
        </nav>
      </header>
      {children}
      <footer className="cp-public-footer">© {new Date().getFullYear()} Zaapino · Cleaning Partner Network</footer>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  href,
  variant = "primary",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const className = `cp-button cp-button-${variant}`;
  if (href) return <Link className={className} href={href}>{children}</Link>;
  return <button type={type} className={className} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <label className="cp-field">
      <span>{label}{required ? <b className="cp-required"> *</b> : null}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="cp-field">
      <span>{label}{required ? <b className="cp-required"> *</b> : null}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} required={required}>
        <option value="">Select…</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function Stepper({ current, total = 7 }: { current: number; total?: number }) {
  return (
    <div className="cp-stepper" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <div className="cp-step-wrap" key={index}>
          <span className={`cp-step-dot ${index + 1 <= current ? "active" : ""}`}>{index + 1}</span>
          <span className={`cp-step-line ${index + 1 < current ? "active" : ""}`} />
        </div>
      ))}
    </div>
  );
}

export function StatusPill({ value }: { value?: string }) {
  const status = (value || "PENDING").replaceAll("_", " ");
  const tone = /APPROVED|COMPLETED|PAID|ACCEPTED|ARRIVED/.test(status)
    ? "good"
    : /REJECTED|FAILED|CANCELLED|SUSPENDED|ISSUE/.test(status)
      ? "bad"
      : "warning";
  return <span className={`cp-status cp-status-${tone}`}>{status}</span>;
}

export function Panel({ title, subtitle, children, action }: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="cp-panel">
      <div className="cp-panel-head"><div><h2>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>{action}</div>
      {children}
    </section>
  );
}
