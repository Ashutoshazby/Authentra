import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { resetPassword } from "../services/api";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useMemo(
    () => new URLSearchParams(location.search).get("token") || "",
    [location.search]
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!token) {
      setError("This reset link is invalid or incomplete.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await resetPassword({ token, password });
      setNotice(response?.message || "Password reset successful.");
      window.setTimeout(() => navigate("/login"), 1500);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to reset your password right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <div className="glass w-full max-w-md rounded-[2rem] border border-slate-800 p-8 shadow-glow">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Authentra</p>
          <h1 className="mt-4 text-4xl font-black">Reset password</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Set a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="New password"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-aqua"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-aqua"
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
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-accent to-gold px-5 py-3 font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Back to{" "}
            <Link to="/login" className="font-semibold text-aqua">
              login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default ResetPasswordPage;
