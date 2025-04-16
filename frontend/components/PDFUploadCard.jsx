"use client";
import { Upload } from "lucide-react";
import CardBackground from "./CardBackground";
import { useRef } from "react";

function PDFUploadCard() {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    console.log("File Uploaded");
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Process your file here
    }
  };

  const handleDivClick = () => {
    // Programmatically click the file input when div is clicked
    fileInputRef.current.click();
  };

  return (
    <CardBackground className="px-4 ">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Upload PDF
      </h2>
      <form className="space-y-4">
        <div
          className="inset-shadow-sm inset-shadow-bg-input border-2 border-dashed border-input rounded-md p-6 text-center hover:bg-accent/50 transition"
          onClick={handleDivClick}
        >
          <Upload size={36} className="mx-auto mb-3 text-muted-foreground" />
          {/* TODO: TW - Propogate PDF to the PDF Viewer - Maybe make a submit button appear once file uploaded. */}
          <p className="text-muted-foreground mb-4">
            Drag and drop a PDF file or click to browse
          </p>

          <input
            type="file"
            id="pdfUpload"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
          />

          <label
            htmlFor="pdfUpload"
            className="inline-block bg-input hover:bg-input/50 text-card-foreground py-2 px-4 rounded-md
              cursor-pointer transition"
            onClick={(e) => e.stopPropagation()}
          >
            Browse Files
          </label>
        </div>
      </form>
    </CardBackground>
  );
}

export default PDFUploadCard;
