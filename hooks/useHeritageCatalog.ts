"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { HeritageCatalogResponse, HeritageLoadState } from "@/lib/heritage/types";
import { HERITAGE_CATALOG_FAILURE } from "@/lib/heritage/types";

export function useHeritageCatalog(active: boolean, initial: HeritageLoadState) {
  const [load, setLoad] = useState<HeritageLoadState>(initial);
  const [retry, setRetry] = useState(0);
  const sequence = useRef(0);
  const loaded = useRef(initial);
  const consumedRetry = useRef(0);

  useLayoutEffect(() => {
    loaded.current = load;
  }, [load]);

  useEffect(() => {
    const nonce = ++sequence.current;
    if (!active) return;

    const previous = loaded.current;
    const hasDataOrError = previous.status === "ready" || previous.status === "error";
    if (hasDataOrError && consumedRetry.current === retry) return;
    consumedRetry.current = retry;

    const abort = new AbortController();
    setLoad((prev) => (prev.status === "ready" ? prev : { status: "loading" }));

    void fetch("/api/dia-danh", { signal: abort.signal, cache: "no-store" })
      .then(async (response) => {
        const result: HeritageCatalogResponse = await response.json();
        if (abort.signal.aborted || sequence.current !== nonce) return;
        if (!response.ok || !result.ok) {
          setLoad({ status: "error", error: HERITAGE_CATALOG_FAILURE });
          return;
        }
        setLoad({ status: "ready", data: result.data });
      })
      .catch(() => {
        if (!abort.signal.aborted && sequence.current === nonce) {
          setLoad({ status: "error", error: HERITAGE_CATALOG_FAILURE });
        }
      });

    return () => abort.abort();
  }, [active, retry]);

  return {
    load,
    retry: () => {
      setLoad({ status: "loading" });
      setRetry((value) => value + 1);
    },
  };
}
