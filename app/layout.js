import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";

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
        className={`${geistSans.variable} ${geistMono.variable} containerizing bg-base-classes antialiased`}
      >
        <ThemeProvider
          enableSystem={true}
          defaultTheme="system"
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
