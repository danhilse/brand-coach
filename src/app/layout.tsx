// layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Act-On Brand Coach",
  description: "Brand voice and messaging evaluation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <div className="layout-container">
          <nav className="side-nav bg-[var(--app-background)] border-r border-[var(--border)]">
            {/* Side navigation content goes here */}
          </nav>
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}