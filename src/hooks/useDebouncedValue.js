import { useEffect, useState } from "react";

// Returns `value` only after it stopped changing for `delay` ms.
// Handy for search boxes so we don't call the API on every keystroke.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
