import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import HighlightedText from "../components/HighlightedText";
import MetricCard from "../components/MetricCard";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  const topMatches = useMemo(
    () =>
      [...(result?.matchedSentences || [])]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10),
    [result]
  );

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 text-white">
        <div className="glass max-w-lg rounded-3xl border border-slate-800 p-8 text-center">
          <h1 className="text-2xl font-bold">No analysis result found</h1>
          <p className="mt-3 text-slate-400">
            Start from the home page and submit a document to see the report.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-full bg-accent px-5 py-3 font-semibold text-white"
          >
            Go home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="page-orb" />
      <div className="page-orb-secondary" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 reveal-up">
          <div>
            <p className="brand-badge text-[11px] text-aqua">Result Page</p>
            <h1 className="mt-2 text-4xl font-black">Document Analysis Report</h1>
          </div>
          <Link
            to="/dashboard"
            className="secondary-btn px-5 py-3 text-sm font-semibold text-slate-200"
          >
            Analyze another document
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <MetricCard label="AI Score" value={result.aiScore} tone="aqua" />
          <MetricCard
            label="Plagiarism Score"
            value={result.plagiarismScore}
            tone="orange"
          />
          <MetricCard
            label="Matches Found"
            value={Math.min(result.matchedSentences.length * 10, 100)}
            tone="gold"
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass reveal-up reveal-delay-1 rounded-[2rem] border border-slate-800 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Highlighted text</h2>
                <p className="text-sm text-slate-400">
                  Sentences with strong similarity signals are emphasized.
                </p>
              </div>
            </div>
            <HighlightedText
              text={result.documentText}
              matches={result.matchedSentences}
            />
          </div>

          <div className="space-y-5">
            <div className="glass reveal-up reveal-delay-2 rounded-[2rem] border border-slate-800 p-6">
              <h2 className="text-2xl font-bold">Similarity results</h2>
              <p className="mt-2 text-sm text-slate-400">
                Top sentence-level matches ranked by combined plagiarism score.
              </p>

              <div className="mt-5 space-y-4">
                {topMatches.length ? (
                  topMatches.map((match, index) => (
                    <div
                      key={`${match.sentence}-${index}`}
                      className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                          {(match.similarity * 100).toFixed(0)}% similar
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {match.source}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white">{match.sentence}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        Match: {match.matchText}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4 text-sm text-slate-400">
                    No major sentence-level matches were found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Footer />
      </div>
    </main>
  );
}

export default ResultPage;
