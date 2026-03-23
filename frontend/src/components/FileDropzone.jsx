import { useRef, useState } from "react";

const acceptedTypes = ".pdf,.docx,.txt";

function FileDropzone({ file, onFileSelect, onFileClear }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const selected = files?.[0];
    if (!selected) return;
    onFileSelect(selected);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`rounded-[2rem] border border-dashed p-6 transition duration-200 ${
        isDragging
          ? "border-aqua bg-cyan-400/10 shadow-glow"
          : "border-slate-700/80 bg-slate-950/35"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="flex flex-col items-start gap-3 text-sm text-slate-300">
        <div className="brand-badge text-[11px] text-aqua">
          Upload file
        </div>
        <p className="text-lg font-semibold text-white">
          Drag and drop a PDF, DOCX, or TXT file here
        </p>
        <p className="text-sm text-slate-400">
          Or browse your files for instant text extraction and analysis.
        </p>

        {file ? (
          <div className="mt-2 flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3">
            <div>
              <p className="font-semibold text-white">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={onFileClear}
              className="secondary-btn rounded-full px-3 py-1 text-xs font-medium text-slate-200"
            >
              Remove
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="primary-btn mt-2 rounded-full px-5 py-2 text-sm"
        >
          Choose file
        </button>
      </div>
    </div>
  );
}

export default FileDropzone;
