function MetricCard({ label, value, tone }) {
  const toneClasses = {
    aqua: "from-cyan-400/20 to-cyan-200/5 border-cyan-400/30 text-cyan-200",
    orange: "from-orange-400/20 to-orange-200/5 border-orange-400/30 text-orange-200",
    gold: "from-yellow-300/20 to-yellow-100/5 border-yellow-300/30 text-yellow-100"
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-5 ${toneClasses[tone] || toneClasses.aqua}`}
    >
      <p className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</p>
      <p className="mt-4 text-4xl font-black">{value}%</p>
    </div>
  );
}

export default MetricCard;
