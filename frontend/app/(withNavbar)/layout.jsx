import { Roboto } from "next/font/google";
import "../globals.css";
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

export default function Layout({ children }) {
  return (
    <div className="bg-background min-h-screen font-roboto">
      <NavBar />
      {/* Main page elements are the 'children' */}
      <div className="px-4">{children}</div>
    </div>
  );
}
