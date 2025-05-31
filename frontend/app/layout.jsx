import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/UserContext";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
  icons: {
    icon:"/favicon.ico",
 },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="icon" href="/favicon.ico" />
      <title>PubAnalyzer</title>
      <meta name="description" content="Analyze PubMed Articles"/>
    </head>
      <body className={`${roboto.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="bg-background min-h-screen font-roboto">
              {/* Main page elements are the 'children' */}
              {children}
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}