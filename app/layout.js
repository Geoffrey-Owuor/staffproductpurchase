import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import LoadingLine from "@/components/Reusables/LoadingLine";
import { LoadingLineProvider } from "@/context/LoadingLineContext";
import { ThemeProvider } from "next-themes";
import { LayoutProvider } from "@/context/LayoutContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HAL Purchase Portal",
  description:
    "Hotpoint Staff Purchase Portal for streamlining staff product purchases online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Hotpoint" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-base-classes antialiased`}
      >
        <ThemeProvider
          enableSystem={true}
          defaultTheme="system"
          disableTransitionOnChange={true}
        >
          <LoadingLineProvider>
            <LayoutProvider>
              <LoadingLine />
              <main>{children}</main>
            </LayoutProvider>
          </LoadingLineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
