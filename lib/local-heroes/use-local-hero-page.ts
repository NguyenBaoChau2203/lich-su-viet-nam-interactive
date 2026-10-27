"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { localHeroFilterKey, localHeroParams, type LocalHeroUrlState } from "./state";
import { LOCAL_HERO_FAILURE } from "./response";
import type { LocalHeroFilters, LocalHeroLoadState, LocalHeroPageResponse } from "./types";

export function useLocalHeroPage(discovery: LocalHeroUrlState, initial: LocalHeroLoadState, onClamp: (filters: LocalHeroFilters) => void) {
  const [load, setLoad] = useState(initial), [retry, setRetry] = useState(0);
  const sequence = useRef(0), current = useRef(discovery), loaded = useRef(initial), consumedRetry = useRef(0);
  useLayoutEffect(() => { current.current = discovery; loaded.current = load; }, [discovery, load]);
  const key = localHeroFilterKey(discovery.filters);
  useEffect(() => {
    const nonce = ++sequence.current;
    if (discovery.mode !== "people") return;
    const previous = loaded.current;
    const matches = previous.status === "ready" ? localHeroFilterKey(previous.data.filters) === key
      : previous.status === "error" && localHeroFilterKey(previous.filters) === key;
    if (matches && consumedRetry.current === retry) return;
    consumedRetry.current = retry;
    const abort = new AbortController();
    void fetch(`/api/local-heroes?${localHeroParams(discovery)}`, { signal: abort.signal, cache: "no-store" })
      .then(async (response) => {
        const result: LocalHeroPageResponse = await response.json();
        if (abort.signal.aborted || sequence.current !== nonce || current.current.mode !== "people" || localHeroFilterKey(current.current.filters) !== key) return;
        if (!response.ok || !result.ok) { setLoad({ status: "error", filters: discovery.filters, error: LOCAL_HERO_FAILURE }); return; }
        setLoad({ status: "ready", data: result.data });
        if (localHeroFilterKey(result.data.filters) !== key) onClamp(result.data.filters);
      }).catch(() => {
        if (!abort.signal.aborted && sequence.current === nonce && current.current.mode === "people" && localHeroFilterKey(current.current.filters) === key)
          setLoad({ status: "error", filters: discovery.filters, error: LOCAL_HERO_FAILURE });
      });
    return () => abort.abort();
  }, [key, discovery.mode, discovery, retry, onClamp]);
  const matches = load.status === "ready" ? localHeroFilterKey(load.data.filters) === key
    : load.status === "error" || load.status === "loading" ? localHeroFilterKey(load.filters) === key : false;
  return { load: (matches ? load : { status: "loading", filters: discovery.filters }) as LocalHeroLoadState,
    retry: () => { setLoad({ status: "loading", filters: discovery.filters }); setRetry((value) => value + 1); } };
}
