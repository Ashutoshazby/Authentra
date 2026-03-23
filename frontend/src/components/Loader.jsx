function Loader({ message = "Analyzing your document..." }) {
  return (
    <div className="glass reveal-up flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-800 px-8 py-12 text-center shadow-glow">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-16 w-16 animate-ping rounded-full bg-aqua/20" />
        <span className="absolute h-12 w-12 animate-pulseSoft rounded-full border border-aqua/70" />
        <span className="h-4 w-4 animate-float rounded-full bg-gradient-to-r from-aqua to-gold" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">{message}</p>
        <p className="mt-1 text-sm text-slate-400">
          Running plagiarism metrics and AI detection models.
        </p>
      </div>
    </div>
  );
}

export default Loader;
