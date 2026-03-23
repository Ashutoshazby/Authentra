function MetricCard({ label, value, tone }) {
  const toneClasses = {
    aqua:
      "from-cyan-400/20 via-cyan-300/8 to-transparent border-cyan-400/30 text-cyan-200 shadow-[0_20px_45px_rgba(34,211,238,0.08)]",
    orange:
      "from-orange-400/18 via-orange-200/8 to-transparent border-orange-400/30 text-orange-200 shadow-[0_20px_45px_rgba(249,115,22,0.08)]",
    gold:
      "from-yellow-300/18 via-yellow-100/8 to-transparent border-yellow-300/30 text-yellow-100 shadow-[0_20px_45px_rgba(250,204,21,0.08)]"
  };

  return (
    <div
      className={`glass reveal-up rounded-[2rem] border bg-gradient-to-br p-6 ${toneClasses[tone] || toneClasses.aqua}`}
    >
      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{label}</p>
      <p className="mt-5 text-5xl font-black">{value}%</p>
    </div>
  );
}

export default MetricCard;
