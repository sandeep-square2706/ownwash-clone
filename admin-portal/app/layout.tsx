import "./globals.css";

export const metadata = {
  title: "Zaapino Admin Portal",
  description: "Zaapino operations and administration portal",
  icons: {
    icon: "/images/logo/zaapino-logo-transparent.png",
    shortcut: "/images/logo/zaapino-logo-transparent.png",
    apple: "/images/logo/zaapino-logo-transparent.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
