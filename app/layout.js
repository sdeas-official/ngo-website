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
    default: "SDEAS Foundation",
    template: "%s | SDEAS Foundation",
  },
  description:
    "SDEAS Foundation empowers youth and communities through skill development, education, healthcare initiatives, and social impact programs.",
  applicationName: "SDEAS Foundation",
  keywords: [
    "SDEAS Foundation",
    "Skill Development",
    "Youth Empowerment",
    "NGO India",
    "Community Development",
    "Healthcare Camps",
    "CSR Partnerships",
    "Rourkela",
  ],
  authors: [{ name: "SDEAS Foundation" }],
  creator: "SDEAS Foundation",
  publisher: "SDEAS Foundation",
  icons: {
    icon: "/NGO%20LOGO.png",
    shortcut: "/NGO%20LOGO.png",
    apple: "/NGO%20LOGO.png",
  },
  openGraph: {
    title: "SDEAS Foundation",
    description:
      "Empowering youth through education, industrial training, healthcare, and community development initiatives.",
    url: "https://sdeasfoundation.org",
    siteName: "SDEAS Foundation",
    images: [
      {
        url: "/NGO%20LOGO.png",
        width: 800,
        height: 800,
        alt: "SDEAS Foundation Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SDEAS Foundation",
    description:
      "Empowering youth and communities through impactful social welfare initiatives.",
    images: ["/NGO%20LOGO.png"],
  },
  category: "Nonprofit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="taWFZQGMsiO9tfe6wBM1ZxCvULvGSpW4x3z-899JMJM"
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
