import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDropzone from "../components/FileDropzone";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { restoreMarketingDraft } from "../components/MarketingTool";
import { useAuth } from "../context/AuthContext";
import { analyzeText, uploadDocument } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const draft = restoreMarketingDraft();
    if (draft) {
      setText(draft);
      setNotice("Your pasted text has been restored from the landing page tool.");
    }
  }, []);

  const handleAnalyze = async () => {
    setError("");
    setNotice("");

    if (!text.trim() && !file) {
      setError("Paste text or upload a document before analysis.");
      return;
    }

    try {
      setLoading(true);
      const result = file ? await uploadDocument(file) : await analyzeText(text);
      updateUser({
        ...user,
        scansRemaining: Math.max(0, user.scansRemaining - 1)
      });
      navigate("/results", { state: result });
    } catch (requestError) {
      if (requestError?.response?.data?.error === "DAILY_SCAN_LIMIT_REACHED") {
        setError(
          requestError?.response?.data?.message ||
            "You have reached today's 6-scan limit. Please try again tomorrow."
        );
        return;
      }

      const message =
        requestError?.response?.data?.message ||
        "Analysis failed. Make sure the backend and AI service are both running.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-aqua">
                Dashboard
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 transition hover:border-accent hover:text-accent"
              >
                Logout
              </button>
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-white md:text-6xl">
              Welcome back to Authentra.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Upload or paste a document to run AI detection and plagiarism analysis
              with your daily scan allowance.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                `${user?.scansRemaining ?? 0} of 6 scans remaining today`,
                user?.email || "Authenticated account"
              ].map((item) => (
                <div
                  key={item}
                  className="glass rounded-2xl border border-slate-800 px-4 py-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] border border-slate-800 p-5 shadow-glow sm:p-8">
            {loading ? (
              <Loader />
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gold">
                    Analyze Document
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Run your next scan
                  </h2>
                </div>

                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Paste essay, article, or research paper text here..."
                  className="min-h-[260px] w-full rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-sm leading-7 text-slate-100 outline-none transition focus:border-aqua"
                />

                <FileDropzone
                  file={file}
                  onFileSelect={(selectedFile) => {
                    setFile(selectedFile);
                    setText("");
                  }}
                  onFileClear={() => setFile(null)}
                />

                {error ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                {notice ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {notice}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="w-full rounded-2xl bg-gradient-to-r from-accent to-gold px-6 py-4 text-base font-bold text-slate-950 transition hover:brightness-110"
                >
                  Analyze Document
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Footer />
      </div>
    </main>
  );
}

export default Dashboard;
