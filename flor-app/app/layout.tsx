import type { Metadata } from "next";
export const metadata: Metadata = { title: "Flor for Nurses" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
