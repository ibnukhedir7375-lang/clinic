import { useCallback, useEffect, useMemo, useState } from "react";
import { api, onUnauthorized, tokenStorage } from "../api/client";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is saved we must ask the server who it belongs to before rendering.
  const [checking, setChecking] = useState(() => Boolean(tokenStorage.get()));

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Revoke the session on the server too, so the token stops working even if
  // it was copied. Log out locally whether or not that request succeeds.
  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    // The server already rejected the token here, so there's nothing to revoke.
    onUnauthorized(clearSession);
    if (!tokenStorage.get()) return;

    api("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => tokenStorage.clear())
      .finally(() => setChecking(false));
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const { token, user } = await api("/auth/login", { method: "POST", body: { email, password } });
    tokenStorage.set(token);
    setUser(user);
    return user;
  }, []);

  const value = useMemo(() => ({ user, checking, login, logout }), [user, checking, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
