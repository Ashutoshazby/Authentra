import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import { seoPages } from "./data/seoPages";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const SeoLandingPage = lazy(() => import("./pages/SeoLandingPage"));

function App() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4">
          <Loader message="Loading Authentra..." />
        </main>
      }
    >
      <Routes>
        <Route path="/" element={<SeoLandingPage page={seoPages["/ai-detector"]} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        {Object.values(seoPages).map((page) => (
          <Route
            key={page.slug}
            path={page.slug}
            element={<SeoLandingPage page={page} />}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
