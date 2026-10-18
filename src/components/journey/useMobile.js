import { useEffect, useState } from "react";

export const MOBILE_QUERY = "(max-width: 767px)";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useMobile() {
  return useMediaQuery(MOBILE_QUERY);
}
