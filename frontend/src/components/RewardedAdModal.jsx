import { useEffect, useMemo, useState } from "react";
import { unlockScan } from "../services/api";

const AD_DURATION_SECONDS = 12;

function RewardedAdModal({ isOpen, onClose, onUnlocked }) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!playing || !isOpen) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return Math.min(100, current + 100 / AD_DURATION_SECONDS);
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isOpen, playing]);

  useEffect(() => {
    if (progress < 100 || !playing) {
      return;
    }

    const finishUnlock = async () => {
      try {
        setLoading(true);
        const usage = await unlockScan();
        onUnlocked(usage);
      } catch (unlockError) {
        setError(
          unlockError?.response?.data?.error ||
            "Ad reward verification failed. Please try again."
        );
      } finally {
        setLoading(false);
        setPlaying(false);
      }
    };

    finishUnlock();
  }, [onUnlocked, playing, progress]);

  const progressLabel = useMemo(() => `${Math.round(progress)}%`, [progress]);

  const handleStartAd = async () => {
    try {
      setLoading(true);
      setError("");
      setProgress(0);
      setPlaying(true);
    } catch (sessionError) {
      setError(
        sessionError?.response?.data?.message ||
          "Unable to start rewarded ad right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (playing || loading) {
      return;
    }

    setError("");
    setProgress(0);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
      <div className="glass w-full max-w-lg rounded-[2rem] border border-slate-800 p-6 shadow-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-aqua">Unlock Scan</p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Watch Ad to Unlock 1 Scan
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 transition hover:border-aqua hover:text-aqua disabled:opacity-40"
            disabled={playing || loading}
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Rewarded ad progress</span>
            <span>{progressLabel}</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aqua to-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            This simulated rewarded ad flow issues a signed completion token and unlocks
            one additional scan after verification.
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleStartAd}
            disabled={playing || loading}
            className="flex-1 rounded-2xl bg-gradient-to-r from-accent to-gold px-5 py-3 font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Preparing..." : playing ? "Ad Playing..." : "Play Rewarded Ad"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RewardedAdModal;
