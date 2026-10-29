"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { localHeroFilterKey, localHeroParams, type LocalHeroUrlState } from "./state";
import { LOCAL_HERO_FAILURE } from "./response";
import type { LocalHeroFilters, LocalHeroLoadState, LocalHeroPageResponse } from "./types";

export function useLocalHeroPage(
  discovery: LocalHeroUrlState,
  initial: LocalHeroLoadState,
  onClamp: (filters: LocalHeroFilters) => void,
) {
  const [load, setLoad] = useState(initial);
  const [retry, setRetry] = useState(0);
  const sequence = useRef(0);
  const current = useRef(discovery);
  const loaded = useRef(initial);
  const consumedRetry = useRef(0);

  useLayoutEffect(() => {
    current.current = discovery;
    loaded.current = load;
  }, [discovery, load]);

  const key = localHeroFilterKey(discovery.filters);
  const isPeople = discovery.mode === "people";
  const isOverview = discovery.mode === "locality";
  const localityCode = discovery.filters.localityCode;

  useEffect(() => {
    const nonce = ++sequence.current;
    if (!isPeople && (!isOverview || !localityCode)) return;

    const previous = loaded.current;
    const matches = previous.status === "ready"
      ? localHeroFilterKey(previous.data.filters) === key
      : previous.status === "error" && localHeroFilterKey(previous.filters) === key;

    if (matches && consumedRetry.current === retry) return;
    consumedRetry.current = retry;

    const abort = new AbortController();
    void fetch(`/api/local-heroes?${localHeroParams(discovery)}`, {
      signal: abort.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const result: LocalHeroPageResponse = await response.json();
        if (abort.signal.aborted || sequence.current !== nonce || current.current.mode !== discovery.mode) return;
        if (isPeople && localHeroFilterKey(current.current.filters) !== key) return;
        if (isOverview && localHeroFilterKey(current.current.filters) !== key) return;

        if (!response.ok || !result.ok) {
          setLoad({ status: "error", filters: discovery.filters, error: LOCAL_HERO_FAILURE });
          return;
        }
        setLoad({ status: "ready", data: result.data });
        if (isPeople && localHeroFilterKey(result.data.filters) !== key) {
          onClamp(result.data.filters);
        }
      })
      .catch(() => {
        if (abort.signal.aborted || sequence.current !== nonce || current.current.mode !== discovery.mode) return;
        if (isPeople && localHeroFilterKey(current.current.filters) !== key) return;
        if (isOverview && localHeroFilterKey(current.current.filters) !== key) return;
        setLoad({ status: "error", filters: discovery.filters, error: LOCAL_HERO_FAILURE });
      });

    return () => abort.abort();
  }, [key, discovery.mode, discovery, retry, onClamp, isPeople, isOverview, localityCode]);

  let matches = false;
  if (isPeople) {
    matches =
      load.status === "ready"
        ? localHeroFilterKey(load.data.filters) === key
        : load.status === "error" || load.status === "loading"
          ? localHeroFilterKey(load.filters) === key
          : false;
  } else if (isOverview) {
    if (!localityCode) {
      return {
        load: { status: "idle" } as LocalHeroLoadState,
        retry: () => setRetry((value) => value + 1),
      };
    }
    matches =
      load.status === "ready"
        ? localHeroFilterKey(load.data.filters) === key
        : load.status === "error" || load.status === "loading"
          ? localHeroFilterKey(load.filters) === key
          : false;
  }

  return {
    load: (matches ? load : { status: "loading", filters: discovery.filters }) as LocalHeroLoadState,
    retry: () => {
      setLoad({ status: "loading", filters: discovery.filters });
      setRetry((value) => value + 1);
    },
  };
}
