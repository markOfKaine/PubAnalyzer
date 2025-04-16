import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

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
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <div className="bg-primary-bg min-h-screen font-roboto">
          <NavBar />
          {/* Main page elements are the 'children' */}
          <div className="px-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
