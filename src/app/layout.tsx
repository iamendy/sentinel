import type { Metadata } from "next";
import localFont from "next/font/local";
//@ts-ignore
import "@/app/globals.css";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

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

export const metadata: Metadata = {
  title: "Sentinel Africa",
  description: "Next gen fraudulent payment prevention APIs for your app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <div className=" pancake relative">
            <Navbar />
            <main className="pt-4 lg:pt-20">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
