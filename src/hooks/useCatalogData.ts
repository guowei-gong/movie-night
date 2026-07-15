import { useCatalogResource } from "../data/catalogContext";
import type { CatalogSort } from "../types/title";

export function useHomeData() {
  return useCatalogResource("home", (repository) => repository.getHome());
}

export function useTitleData(id: string | number | undefined) {
  const numericId = Number(id);
  const key = Number.isSafeInteger(numericId) && numericId >= 0 ? `title:${numericId}` : null;
  return useCatalogResource(key, (repository) => repository.getTitle(numericId));
}

export function useSourceData(id: string | number | undefined) {
  const numericId = Number(id);
  const key = Number.isSafeInteger(numericId) && numericId >= 0 ? `source:${numericId}` : null;
  return useCatalogResource(key, (repository) => repository.getSource(numericId));
}

export function useCatalogPage(category: string | undefined, page = 1, sort: CatalogSort = "latest") {
  const normalized = category ? decodeURIComponent(category) : null;
  const key = normalized ? `catalog:${normalized}:${page}:${sort}` : null;
  return useCatalogResource(key, (repository) => repository.getCatalog(normalized!, page, sort));
}

export function useTitles(ids: number[]) {
  const key = ids.length ? `titles:${ids.join(",")}` : null;
  return useCatalogResource(key, (repository) => repository.getTitles(ids));
}

export function useSearchIndex(enabled: boolean) {
  return useCatalogResource(enabled ? "search-index" : null, (repository) => repository.getSearchIndex());
}
