import { useCallback, useEffect, useMemo, useState } from "react";
import { api, onUnauthorized, tokenStorage } from "../api/client";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is saved we must ask the server who it belongs to before rendering.
  const [checking, setChecking] = useState(() => Boolean(tokenStorage.get()));

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    onUnauthorized(logout);
    if (!tokenStorage.get()) return;

    api("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => tokenStorage.clear())
      .finally(() => setChecking(false));
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api("/auth/login", { method: "POST", body: { email, password } });
    tokenStorage.set(token);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(() => ({ user, checking, login, logout }), [user, checking, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
