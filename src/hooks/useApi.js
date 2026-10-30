import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

// Loads `path` with GET and re-runs when the path changes or reload() is called.
// Pass null to skip loading. Old data stays visible while reloading.
export function useApi(path) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const key = `${path}#${version}`;

  useEffect(() => {
    if (!path) return;
    let ignore = false;
    api(path).then(
      (data) => !ignore && setResult({ key, data, error: null }),
      (error) => !ignore && setResult({ key, data: null, error }),
    );
    return () => {
      ignore = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: result.data,
    error: result.error,
    loading: Boolean(path) && result.key !== key,
    reload,
  };
}
