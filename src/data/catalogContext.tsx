import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CatalogRepository } from "./catalogRepository";
import { StaticCatalogRepository } from "./staticCatalogRepository";

const defaultRepository = new StaticCatalogRepository();
const CatalogContext = createContext<CatalogRepository>(defaultRepository);

export function CatalogProvider({ children, repository = defaultRepository }: { children: ReactNode; repository?: CatalogRepository }) {
  return <CatalogContext.Provider value={repository}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export function useCatalogResource<T>(key: string | null, loader: (repository: CatalogRepository) => Promise<T>) {
  const repository = useCatalog();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(key));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!key) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    loader(repository)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason : new Error(String(reason)));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  // The string key intentionally owns request identity; callers may pass inline loaders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, repository]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
