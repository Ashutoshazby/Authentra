import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { forgotPassword } from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      setSubmitting(true);
      const response = await forgotPassword({ email });
      setNotice(
        response?.message ||
          "If an account exists for that email, a reset link has been sent."
      );
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to send the reset email right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell min-h-screen px-4 py-10 text-white">
      <div className="page-orb" />
      <div className="page-orb-secondary" />
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
        <div className="glass reveal-up w-full max-w-md rounded-[2rem] border border-slate-800 p-8 shadow-glow">
          <p className="brand-badge text-[11px] text-aqua">Authentra</p>
          <h1 className="mt-4 text-4xl font-black">Forgot password</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Enter your email address and we&apos;ll send you a secure reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="lux-input w-full rounded-2xl px-4 py-3 text-sm text-white outline-none"
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
              className="primary-btn w-full px-5 py-3 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Remembered your password?{" "}
            <Link to="/login" className="font-semibold text-aqua">
              Back to login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default ForgotPasswordPage;
