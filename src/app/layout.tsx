import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});



export const metadata: Metadata = {
  title: "RunMeCV - AI Resume Generator",
  description: "Generate professional resumes with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        {children}</body>
    </html>
  );
}
