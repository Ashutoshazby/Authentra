import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, {
  fetchCurrentUser,
  loginUser,
  loginWithGoogle,
  signupUser
} from "../services/api";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "authentra-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      delete api.defaults.headers.common.Authorization;
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();
        setUser(response.user);
      } catch (_error) {
        setToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      isAuthenticated: Boolean(token && user),
      async login(credentials) {
        const response = await loginUser(credentials);
        setToken(response.token);
        setUser(response.user);
        return response;
      },
      async loginWithGoogleCredential(credential) {
        const response = await loginWithGoogle(credential);
        setToken(response.token);
        setUser(response.user);
        return response;
      },
      async signup(credentials) {
        const response = await signupUser(credentials);
        setToken(response.token);
        setUser(response.user);
        return response;
      },
      logout() {
        setToken(null);
        setUser(null);
      },
      updateUser(nextUser) {
        setUser(nextUser);
      }
    }),
    [authLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
