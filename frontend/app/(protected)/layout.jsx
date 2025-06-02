import { PubMedProvider } from "@/contexts/PubMedContext";
import { LLMProvider } from "@/contexts/LLMContext";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import { AnnotationProvider } from "@/contexts/AnnotationContext";
import { UserDocumentProvider } from "@/contexts/UserDocumentContext";

export const metadata = {
  title: "PubAnalyzer",
  description: "Analyze PubMed articles",
};

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <LLMProvider>
        <PubMedProvider>
          <UserDocumentProvider>
            <AnnotationProvider>
              {/* Main page elements are the 'children' */}
              {children}
            </AnnotationProvider>
          </UserDocumentProvider>
        </PubMedProvider>
      </LLMProvider>
    </ProtectedRoute>
  );
}
