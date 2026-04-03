import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title: {
    default: "HitFinds — Discover Movies",
    template: "%s | HitFinds",
  },
  description:
    "Browse, search and explore thousands of movies powered by TMDB.",
  openGraph: {
    siteName: "HitFinds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
