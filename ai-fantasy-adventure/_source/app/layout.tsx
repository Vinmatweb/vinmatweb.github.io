import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-fantasy-adventure.jirik66.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Fantasy Adventure – fantasy RPG s AI Pánem jeskyně",
    template: "%s | AI Fantasy Adventure",
  },
  description:
    "Kooperativní fantasy hra pro děti a rodiče. AI se stane Pánem jeskyně, počítá pravidla a vede dobrodružství – bez kostek, mapy a předchozí znalosti RPG.",
  applicationName: "AI Fantasy Adventure",
  authors: [{ name: "VinMat" }],
  creator: "VinMat",
  keywords: [
    "AI Fantasy Adventure",
    "fantasy hra pro děti",
    "rodinné RPG",
    "AI Pán jeskyně",
    "kooperativní hra",
    "Dračí doupě pro děti",
  ],
  alternates: {
    canonical: "/",
    languages: { "cs-CZ": "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "AI Fantasy Adventure",
    title: "AI Fantasy Adventure",
    description: "Každé rozhodnutí otevírá nový příběh. Rodinné fantasy RPG s AI Pánem jeskyně.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hrdinové světa AI Fantasy Adventure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fantasy Adventure",
    description: "Rodinné fantasy RPG s AI Pánem jeskyně.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Fantasy Adventure",
              url: siteUrl,
              inLanguage: ["cs", "en"],
              description: "Kooperativní fantasy RPG pro děti a rodiče s AI Pánem jeskyně.",
            }),
          }}
        />
      </body>
    </html>
  );
}
