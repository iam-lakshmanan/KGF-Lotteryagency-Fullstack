import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KGF LOTTERY AGENCY",
  description: "KGF லாட்டரி ஏஜென்சி - வெற்றி வேண்டுமா? எங்களைத் தேர்வுசெய்யவும்!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar/>

        {children}

      <Footer/>
      </body>
    </html>
  );
}
