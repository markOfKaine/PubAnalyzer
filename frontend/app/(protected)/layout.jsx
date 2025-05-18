import { PubMedProvider } from "@/contexts/PubMedContext";
import ProtectedRoute from "@/contexts/ProtectedRoute";

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <PubMedProvider>
        {/* Main page elements are the 'children' */}
        {children}
      </PubMedProvider>
    </ProtectedRoute>
  );
}
