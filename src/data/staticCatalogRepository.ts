import { CatalogRequestError, type CatalogRepository } from "./catalogRepository";
import type {
  CatalogPage,
  CatalogSort,
  DataManifest,
  HomeData,
  SearchIndex,
  SearchTuple,
  TitleDetail,
  TitleSource,
  TitleSummary,
} from "../types/title";

type Fetcher = typeof fetch;

export class StaticCatalogRepository implements CatalogRepository {
  private readonly cache = new Map<string, Promise<unknown>>();

  constructor(
    private readonly basePath = "/data",
    private readonly fetcher: Fetcher = globalThis.fetch.bind(globalThis),
  ) {}

  private load<T>(path: string, cache: RequestCache = "default"): Promise<T> {
    const url = `${this.basePath}${path}`;
    const key = `${cache}:${url}`;
    if (!this.cache.has(key)) {
      const request = this.fetcher(url, {
        cache,
        headers: { Accept: "application/json" },
      }).then(async (response) => {
        if (!response.ok) {
          throw new CatalogRequestError(`无法加载片库数据：${path}`, response.status);
        }
        return (await response.json()) as T;
      });
      this.cache.set(key, request);
      request.catch(() => this.cache.delete(key));
    }
    return this.cache.get(key) as Promise<T>;
  }

  getManifest() {
    return this.load<DataManifest>("/manifest.json", "no-cache");
  }

  getHome() {
    return this.load<HomeData>("/home.json", "no-cache");
  }

  async getCatalog(category: string, page = 1, sort: CatalogSort = "latest") {
    const manifest = await this.getManifest();
    const normalized = decodeURIComponent(category || "全部").trim() || "全部";
    const categoryInfo = normalized === "全部"
      ? { slug: "all", count: manifest.playableTotal }
      : manifest.categories.find((item) => item.name === normalized);

    if (!categoryInfo || categoryInfo.count === 0) {
      return { page: 1, pageSize: 0, pageCount: 0, total: 0, items: [] };
    }

    return this.load<CatalogPage>(`/catalog/${categoryInfo.slug}/${sort}/${Math.max(1, page)}.json`);
  }

  private async getBucket(id: number, folder: "details" | "sources") {
    const manifest = await this.getManifest();
    const bucket = Math.floor(id / manifest.bucketSize);
    return this.load<Record<string, unknown>>(`/${folder}/${bucket}.json`, folder === "sources" ? "no-store" : "default");
  }

  async getTitle(id: number) {
    if (!Number.isSafeInteger(id) || id < 0) return null;
    const bucket = await this.getBucket(id, "details") as Record<string, TitleDetail>;
    return bucket[String(id)] ?? null;
  }

  async getTitles(ids: number[]) {
    const unique = [...new Set(ids.filter((id) => Number.isSafeInteger(id) && id >= 0))];
    const manifest = await this.getManifest();
    const groups = new Map<number, number[]>();
    for (const id of unique) {
      const bucket = Math.floor(id / manifest.bucketSize);
      groups.set(bucket, [...(groups.get(bucket) ?? []), id]);
    }

    const titles = await Promise.all([...groups.entries()].map(async ([bucket, bucketIds]) => {
      const data = await this.load<Record<string, TitleDetail>>(`/details/${bucket}.json`);
      return bucketIds.map((id) => data[String(id)]).filter(Boolean);
    }));
    const byId = new Map(titles.flat().map((title) => [title.id, title]));
    return ids.map((id) => byId.get(id)).filter((title): title is TitleDetail => Boolean(title));
  }

  async getSource(id: number) {
    const bucket = await this.getBucket(id, "sources") as Record<string, TitleSource>;
    const source = bucket[String(id)];
    if (!source?.episodes?.length) {
      throw new CatalogRequestError("没有可用的播放源", 404);
    }
    return source;
  }

  getSearchIndex() {
    return this.load<SearchIndex>("/search/index.json");
  }
}

export function searchTitles(index: SearchIndex | null, keyword: string, limit = 80): TitleSummary[] {
  const query = keyword.trim().toLocaleLowerCase("zh-CN");
  if (!index || !query) return [];

  const results: TitleSummary[] = [];
  for (const tuple of index.items) {
    const haystack = [tuple[1], tuple[2], tuple[5], tuple[6], tuple[8], tuple[9]].join(" ").toLocaleLowerCase("zh-CN");
    if (haystack.includes(query)) results.push(tupleToSummary(tuple));
    if (results.length >= limit) break;
  }
  return results;
}

function tupleToSummary(tuple: SearchTuple): TitleSummary {
  return {
    id: tuple[0],
    title: tuple[1],
    category: tuple[2],
    score: tuple[3],
    year: tuple[4],
    area: tuple[5],
    genre: tuple[6],
    cover_url: tuple[7],
    status_text: "",
  };
}
