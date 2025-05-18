import NavBar from "@/components/NavBar";
import VisitorRoute from "@/contexts/VisitorRoute";
import ModeToggle from "@/components/ModeToggle";

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default function Layout({ children }) {
  return (
    <VisitorRoute>
      <div className="bg-background min-h-screen font-roboto">
        <NavBar />
        {/* Main page elements are the 'children' */}
        <div className="px-4">{children}</div>

        {/* Mode toggle positioned in bottom left corner */}
        <div className="fixed bottom-4 left-4 z-50">
          <ModeToggle />
        </div>
      </div>
    </VisitorRoute>
  );
}
