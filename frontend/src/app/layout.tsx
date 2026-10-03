import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Test Your Go API Without Writing Tests | Keploy Quickstart",
  description:
    "A beginner-friendly tutorial on recording real API traffic and auto-generating regression test suites with Keploy, Gin, and MongoDB.",
  keywords: ["Keploy", "Go", "Golang", "Gin", "MongoDB", "Testing", "DevRel", "eBPF", "Integration Testing"],
  authors: [{ name: "Keploy DevRel Candidate" }],
  openGraph: {
    title: "Test Your Go API Without Writing Tests — Keploy Quickstart",
    description:
      "Learn how Keploy automatically records API traffic, auto-mocks MongoDB dependencies, and replays regression tests with zero code changes.",
    type: "article",
    url: "https://keploy-go-quickstart.vercel.app",
    siteName: "Keploy Quickstart Documentation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Your Go API Without Writing Tests — Keploy Quickstart",
    description:
      "Learn how Keploy automatically records API traffic, auto-mocks MongoDB dependencies, and replays regression tests.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--accent)] focus:text-white focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
