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
      className={`rounded-3xl border border-dashed p-6 transition ${
        isDragging
          ? "border-aqua bg-cyan-400/10 shadow-glow"
          : "border-slate-700 bg-slate-900/40"
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
        <div className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-aqua">
          Upload file
        </div>
        <p className="text-base font-medium text-white">
          Drag and drop a PDF, DOCX, or TXT file here
        </p>
        <p className="text-sm text-slate-400">
          Or browse your files for instant text extraction and analysis.
        </p>

        {file ? (
          <div className="mt-2 flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3">
            <div>
              <p className="font-semibold text-white">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={onFileClear}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-accent hover:text-accent"
            >
              Remove
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Choose file
        </button>
      </div>
    </div>
  );
}

export default FileDropzone;
