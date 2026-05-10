import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { analyzeText } from "../services/api";

const DRAFT_STORAGE_KEY = "authentra-marketing-draft";

function MarketingTool({ title, description, placeholder }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError("");
    setNotice("");

    if (!text.trim()) {
      setError("Paste text into the tool before starting analysis.");
      return;
    }

    if (!isAuthenticated) {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, text);
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeText(text);
      updateUser({
        ...user,
        scansRemaining: Math.max(0, (user?.scansRemaining || 0) - 1)
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

      setError(
        requestError?.response?.data?.message ||
          "Analysis failed. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="glass reveal-up reveal-delay-1 rounded-[2rem] border border-slate-800 p-6 shadow-glow sm:p-8">
        {loading ? (
          <Loader message="Running your free Authentra scan..." />
        ) : (
          <div className="space-y-6">
            <div>
              <p className="eyebrow">Try the tool</p>
              <h2 className="editorial-heading mt-2 text-3xl font-semibold text-white">{title}</h2>
              <p className="copy-soft mt-3 max-w-3xl text-sm leading-7">
                {description}
              </p>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
              className="lux-input min-h-[240px] w-full rounded-3xl p-5 text-sm leading-7 text-slate-100 outline-none"
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

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAnalyze}
                className="primary-btn px-6 py-4 text-base"
              >
                Analyze Text
              </button>
              <p className="copy-soft text-sm">
                {isAuthenticated
                  ? `${user?.scansRemaining ?? 0} of 6 scans remaining today`
                  : "Login required to run the scan after pasting your content"}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export function restoreMarketingDraft() {
  const draft = window.sessionStorage.getItem(DRAFT_STORAGE_KEY) || "";
  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  return draft;
}

export default MarketingTool;
