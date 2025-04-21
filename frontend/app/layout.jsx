import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background min-h-screen font-roboto">
            {/* Main page elements are the 'children' */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
