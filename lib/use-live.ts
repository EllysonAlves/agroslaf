"use client";

import { useEffect, useState } from "react";

// Hook que tenta carregar dados ao vivo da API e cai no fallback estatico
// caso a API ainda nao esteja publicada/configurada. Garante que o site
// funcione sozinho (estatico) e enriqueca quando o backend existir.
export function useLive<T>(fetcher: () => Promise<T>, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let active = true;
    fetcher()
      .then((result) => {
        if (active && Array.isArray(result) ? (result as unknown[]).length : result) {
          if (active) setData(result);
        }
      })
      .catch(() => {
        /* mantem o fallback estatico */
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}
