import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import RewardedAdModal from "./RewardedAdModal";
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
  const [showRewardedAd, setShowRewardedAd] = useState(false);

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
      if (requestError?.response?.data?.error === "SCAN_LOCKED") {
        setShowRewardedAd(true);
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
      <section className="glass rounded-[2rem] border border-slate-800 p-6 shadow-glow sm:p-8">
        {loading ? (
          <Loader message="Running your free Authentra scan..." />
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Free Tool</p>
              <h2 className="mt-2 text-3xl font-black text-white">{title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                {description}
              </p>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={placeholder}
              className="min-h-[240px] w-full rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-sm leading-7 text-slate-100 outline-none transition focus:border-aqua"
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
                className="rounded-2xl bg-gradient-to-r from-accent to-gold px-6 py-4 text-base font-bold text-slate-950 transition hover:brightness-110"
              >
                Analyze Text
              </button>
              <p className="text-sm text-slate-400">
                {isAuthenticated
                  ? `${user?.scansRemaining ?? 0} scans remaining on your account`
                  : "Login required to run the scan after pasting your content"}
              </p>
            </div>
          </div>
        )}
      </section>

      <RewardedAdModal
        isOpen={showRewardedAd}
        onClose={() => setShowRewardedAd(false)}
        onUnlocked={(usageUpdate) => {
          updateUser({
            ...user,
            scansRemaining: usageUpdate.scansRemaining,
            adsWatchedToday: usageUpdate.adsWatchedToday
          });
          setShowRewardedAd(false);
          setNotice("Next scan unlocked. You can run the analysis now.");
        }}
      />
    </>
  );
}

export function restoreMarketingDraft() {
  const draft = window.sessionStorage.getItem(DRAFT_STORAGE_KEY) || "";
  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  return draft;
}

export default MarketingTool;
