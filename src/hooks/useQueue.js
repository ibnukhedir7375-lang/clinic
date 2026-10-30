import { useEffect, useState } from "react";
import { useApi } from "./useApi";

const REFRESH_EVERY_MS = 20_000;

// Loads the visits waiting at one stage and keeps track of the selected one.
// The list refreshes itself so new patients appear without reloading the page.
export function useQueue(status) {
  const { data, loading, error, reload } = useApi(`/visits?status=${status}`);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const timer = setInterval(reload, REFRESH_EVERY_MS);
    return () => clearInterval(timer);
  }, [reload]);

  const visits = data?.visits ?? [];
  return {
    visits,
    loading: loading && !data,
    error,
    reload,
    selected: visits.find((v) => v.id === selectedId) ?? null,
    selectedId,
    select: setSelectedId,
  };
}
