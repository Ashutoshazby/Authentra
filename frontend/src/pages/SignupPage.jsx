import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogleCredential } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await signup({ email, password });
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to create your account. Check your backend URL, CORS, and Mongo connection."
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
          <p className="brand-badge text-[11px] text-gold">Start Free</p>
          <h1 className="mt-4 text-4xl font-black">Create account</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Each new account starts with 6 scans per day, refreshed automatically.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="lux-input w-full rounded-2xl px-4 py-3 text-sm text-white outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password (min 6 characters)"
              className="lux-input w-full rounded-2xl px-4 py-3 text-sm text-white outline-none"
            />

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="primary-btn w-full px-5 py-3 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Sign up"}
            </button>
          </form>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div className="mt-5">
              <div className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
                Or sign up with Google
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setError("");
                      await loginWithGoogleCredential(credentialResponse.credential);
                      navigate("/dashboard");
                    } catch (requestError) {
                      setError(
                        requestError?.response?.data?.message ||
                          "Google sign-up failed. Check GOOGLE_CLIENT_ID on backend and VITE_GOOGLE_CLIENT_ID on frontend."
                      );
                    }
                  }}
                  onError={() =>
                    setError("Google sign-up failed before verification could complete.")
                  }
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="signup_with"
                />
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-aqua">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default SignupPage;
