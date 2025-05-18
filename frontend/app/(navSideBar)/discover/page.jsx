import PMCIDForm from '@/components/PMCIDForm';
import PDFUploadCard from '@/components/PDFUploadCard';

function Analyze() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold my-6 text-card-foreground">Analyze PubMed Article</h1>
      <PMCIDForm />
      {/* <PDFUploadCard /> */}
    </div>
  );
}

export default Analyze;
