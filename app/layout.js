import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://sdeasfoundation.org"),
  title: {
    default: "SDEAS Foundation | NGO for Youth Empowerment & Skill Development",
    template: "%s | SDEAS Foundation",
  },
  description:
    "SDEAS Foundation is a leading NGO in Rourkela, Odisha, empowering 4000+ youth through skill development, industrial training, education, healthcare camps, and community development programs across India.",
  applicationName: "SDEAS Foundation",
  keywords: [
    "SDEAS Foundation",
    "SDEAS Welfare Foundation",
    "SDEAS Foundation NGO",
    "SDEAS NGO India",
    "NGO SDEAS",
    "NGO Rourkela",
    "NGO Odisha",
    "NGO India",
    "skill development NGO",
    "youth empowerment NGO",
    "youth empowerment NGO India",
    "industrial training NGO",
    "education NGO India",
    "healthcare NGO",
    "community development NGO",
    "CSR NGO India",
    "CSR partnerships NGO",
    "boiler training NGO",
    "nonprofit organization India",
    "social welfare foundation",
    "SDEAS Foundation Rourkela",
  ],
  authors: [{ name: "SDEAS Foundation" }],
  creator: "SDEAS Foundation",
  publisher: "SDEAS Foundation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/NGO%20LOGO.png",
    shortcut: "/NGO%20LOGO.png",
    apple: "/NGO%20LOGO.png",
  },
  openGraph: {
    title: "SDEAS Foundation | NGO for Youth Empowerment & Skill Development",
    description:
      "SDEAS Foundation empowers 4000+ youth through skill development, industrial training, education, healthcare, and community development programs in Rourkela, Odisha.",
    url: "https://sdeasfoundation.org",
    siteName: "SDEAS Foundation",
    images: [
      {
        url: "/NGO%20LOGO.png",
        width: 800,
        height: 800,
        alt: "SDEAS Foundation - NGO for Youth Empowerment",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDEAS Foundation | NGO for Youth Empowerment",
    description:
      "Empowering 4000+ youth through skill development, education, and community programs. India's leading NGO in Rourkela, Odisha.",
    images: ["/NGO%20LOGO.png"],
  },
  alternates: {
    canonical: "https://sdeasfoundation.org",
  },
  category: "Nonprofit",
  verification: {
    google: "taWFZQGMsiO9tfe6wBM1ZxCvULvGSpW4x3z-899JMJM",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "NGO"],
      "@id": "https://sdeasfoundation.org/#organization",
      name: "SDEAS Foundation",
      alternateName: ["SDEAS Welfare Foundation", "SDEAS NGO"],
      url: "https://sdeasfoundation.org",
      logo: {
        "@type": "ImageObject",
        url: "https://sdeasfoundation.org/NGO%20LOGO.png",
        width: 800,
        height: 800,
      },
      image: "https://sdeasfoundation.org/NGO%20LOGO.png",
      description:
        "SDEAS Foundation is a nonprofit NGO in Rourkela, Odisha, dedicated to empowering youth through skill development, industrial training, education, healthcare camps, and community development initiatives across India.",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rourkela",
        addressRegion: "Odisha",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      knowsAbout: [
        "Skill Development",
        "Youth Empowerment",
        "Industrial Training",
        "Community Development",
        "Healthcare Camps",
        "CSR Partnerships",
        "Education",
      ],
      sameAs: [
        "https://www.facebook.com/sdeasfoundation",
        "https://www.instagram.com/sdeasfoundation",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English", "Hindi", "Odia"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://sdeasfoundation.org/#website",
      url: "https://sdeasfoundation.org",
      name: "SDEAS Foundation",
      description:
        "Official website of SDEAS Foundation - NGO for Youth Empowerment and Skill Development in India",
      publisher: {
        "@id": "https://sdeasfoundation.org/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://sdeasfoundation.org/blog?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="taWFZQGMsiO9tfe6wBM1ZxCvULvGSpW4x3z-899JMJM"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
