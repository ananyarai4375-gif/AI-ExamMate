import { FileText, Upload } from "lucide-react";

function UploadCard({ file, setFile }) {
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  return (
    <label className="upload-card">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        hidden
      />

      <div className="upload-icon">
        {file ? <FileText size={30} /> : <Upload size={30} />}
      </div>

      <h3>
        {file ? file.name : "Upload your study material"}
      </h3>

      <p>
        {file
          ? "PDF selected successfully"
          : "Drag & drop or click to choose a PDF"}
      </p>

      {!file && <span className="upload-format">PDF only • Max 10 MB</span>}
    </label>
  );
}

export default UploadCard;