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
  image:
    "https://img.playbook.com/OWvUgCQ3-IG1atVeSvx6_yIzlll-TBxnaXlS5Ih7hEE/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzRhOGI4NTc5/LTc1NmQtNDExOC05/YzJhLTc1MDQwODgy/YzQ2Yw",
  url: "https://mintcode-ai.vercel.app",
  type: "website",
  siteName: "MintCode AI",
  locale: "en_US",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
