export function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75"/></>,
    partner: <><circle cx="9" cy="7" r="4"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 11h5M18.5 8.5v5"/></>,
    service: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a2.1 2.1 0 1 0 3 3l6-6a4 4 0 0 0 5.4-5.4l-2.1 2.1-3-3z"/><path d="m15 3 6 6"/></>,
    offer: <><path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3.4 13.6a2 2 0 0 1 0-2.8l7.4-7.4A2 2 0 0 1 12.2 3H20a1 1 0 0 1 1 1v7.8a2 2 0 0 1-.4 1.4z"/><circle cx="16.5" cy="7.5" r="1"/></>,
    banner: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-4.5-4.5L8 19"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    report: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/></>,
    payment: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    review: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/></>,
    settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4V19a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1A2 2 0 0 1 3 14.7l.1-.1A2 2 0 0 0 1.7 11H2a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4L3.5 3.5a2 2 0 0 1 2.8-2.8l.1.1A2 2 0 0 0 9.8 1.4V1a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1A2 2 0 0 0 21.4 9h.2a2 2 0 0 1 0 4h-.2a2 2 0 0 0-2 2z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M21 3v18"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>
  };
  return <svg {...common}>{paths[name] ?? paths.dashboard}</svg>;
}
