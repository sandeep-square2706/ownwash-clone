import "./globals.css";

export const metadata = {
  title: "CleanKart Admin Portal",
  description: "CleanKart operations and administration portal"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
