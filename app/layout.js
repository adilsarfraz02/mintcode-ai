import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "MintCode AI | Your Helpful Assistant",
  description:
    "MintCode AI is a next-gen assistant that answers questions, describes images, and helps you stay productive.",
  image: "https://mintcode-ai.vercel.app/mintcode-ai.png", // Absolute URL for better SEO
  url: "https://mintcode-ai.vercel.app",
  type: "website",
  siteName: "MintCode AI",
  locale: "en_US",
  keywords: [
    "MintCode AI", "AI chatbot", "AI assistant", "Next.js AI", "Vercel AI", 
    "Adil Sarfraz AI", "MintCode productivity", "image description AI", "AI model"
  ],
  openGraph: {
    title: "MintCode AI | Your Helpful Assistant",
    description:
      "MintCode AI assists you by answering questions and providing image descriptions with state-of-the-art AI technology.",
    images: [
      {
        url: "https://mintcode-ai.vercel.app/mintcode-ai.png",
        width: 1200,
        height: 630,
        alt: "MintCode AI Assistant Logo", // More descriptive alt text for accessibility
      },
    ],
    url: "https://mintcode-ai.vercel.app",
    type: "website",
    siteName: "MintCode AI",
    locale: "en_US",
  },
  twitter: {
    handle: "@adilsarfr00",
    site: "@adilsarfr00",
    card: "summary_large_image",
    title: "MintCode AI | Your Helpful Assistant",
    description:
      "MintCode AI is an innovative assistant that answers questions and describes images using advanced AI models.",
    images: [
      {
        url: "https://mintcode-ai.vercel.app/mintcode-ai.png",
        width: 1200,
        height: 630,
        alt: "MintCode AI Twitter Preview", // SEO-friendly alt text
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
