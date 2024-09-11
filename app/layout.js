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
  title: "MintCode AI | A helpful assistant",
  description:
    "MintCode AI is a helpful assistant that can answer questions and describe images.",
  image: "./mintcode-ai.png",
  url: "https://mintcode-ai.vercel.app",
  type: "website",
  siteName: "MintCode AI",
  locale: "en_US",
   keywords: [
     "mincodeai", "mintcode ai", "Codemint ai", "Ai Chatbot","Nextjs ai", "Github Model ai", "mintcode","vercel ai", "adil sarfraz"
     ],
  openGraph: {
    title: "MintCode AI | A helpful assistant",
    description:
      "MintCode AI is a helpful assistant that can answer questions and describe images.",
         images: [
      {
        url: "https://mintcode-ai.vercel.app//mintcode-ai.png",
        width: 1200,
        height: 630,
        alt: "Mintcode Ai"
      }
    ]
    url: "https://mintcode-ai.vercel.app",
    type: "website",
    siteName: "MintCode AI",
    locale: "en_US",
  },
  twitter: {
    handle: "@adilsarfr00",
    site: "@adilsarfr00",
    card: "summary_large_image",
       title: "MintCode AI | A helpful assistant",
    description:
      "MintCode AI is a helpful assistant that can answer questions and describe images.",
         images: [
      {
        url: "https://mintcode-ai.vercel.app//mintcode-ai.png",
        width: 1200,
        height: 630,
        alt: "Mintcode Ai"
      }
        ]
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
