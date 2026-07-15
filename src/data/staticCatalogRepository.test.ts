import { describe, expect, it, vi } from "vitest";
import { StaticCatalogRepository, searchTitles } from "./staticCatalogRepository";
import type { DataManifest, SearchIndex, TitleDetail } from "../types/title";

const manifest: DataManifest = {
  schemaVersion: 1,
  dataVersion: "test",
  generatedAt: "2026-07-15T00:00:00Z",
  totalRows: 1,
  playableTotal: 1,
  episodeTotal: 1,
  pageSize: 48,
  pageCounts: { latest: 1, score: 1, title: 1 },
  bucketSize: 100,
  categories: [{ name: "电影", slug: "movie", count: 1, pageCounts: { latest: 1, score: 1, title: 1 } }],
  categoryCounts: { 电影: 1 },
};

const title: TitleDetail = {
  id: 827,
  title: "测试影片",
  category: "电影",
  score: 8.6,
  year: 2026,
  area: "大陆",
  genre: "剧情",
  status_text: "正片",
  cover_url: "https://example.com/cover.jpg",
  actors: "演员甲 / 演员乙",
  director: "导演甲",
  detail_url: "",
  play_url: "",
  description: "测试简介",
};

function repositoryWith(responses: Record<string, unknown>) {
  const fetcher = vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const body = responses[url];
    return body === undefined
      ? new Response("not found", { status: 404 })
      : Response.json(body);
  }) as unknown as typeof fetch;
  return { repository: new StaticCatalogRepository("/data", fetcher), fetcher };
}

describe("StaticCatalogRepository", () => {
  it("loads a title from the manifest-selected bucket", async () => {
    const { repository, fetcher } = repositoryWith({
      "/data/manifest.json": manifest,
      "/data/details/8.json": { "827": title },
    });

    await expect(repository.getTitle(827)).resolves.toEqual(title);
    expect(fetcher).toHaveBeenCalledWith("/data/details/8.json", expect.any(Object));
  });

  it("returns null when the bucket does not contain the requested title", async () => {
    const { repository } = repositoryWith({
      "/data/manifest.json": manifest,
      "/data/details/8.json": {},
    });
    await expect(repository.getTitle(827)).resolves.toBeNull();
  });

  it("surfaces missing static resources as catalog errors", async () => {
    const { repository } = repositoryWith({ "/data/manifest.json": manifest });
    await expect(repository.getTitle(827)).rejects.toMatchObject({ status: 404 });
  });

  it("maps category names to static catalog slugs", async () => {
    const page = { page: 1, pageSize: 48, pageCount: 1, total: 1, items: [title] };
    const { repository, fetcher } = repositoryWith({
      "/data/manifest.json": manifest,
      "/data/catalog/movie/latest/1.json": page,
    });
    await expect(repository.getCatalog("电影")).resolves.toEqual(page);
    expect(fetcher).toHaveBeenCalledWith("/data/catalog/movie/latest/1.json", expect.any(Object));
  });
});

describe("searchTitles", () => {
  const index: SearchIndex = {
    fields: [],
    items: [[827, "测试影片", "电影", 8.6, 2026, "大陆", "剧情", "cover.jpg", "演员甲", "导演甲"]],
  };

  it("matches title, actor, and director text", () => {
    expect(searchTitles(index, "演员甲")).toHaveLength(1);
    expect(searchTitles(index, "导演甲")[0].id).toBe(827);
  });

  it("does not return results for blank queries", () => {
    expect(searchTitles(index, "  ")).toEqual([]);
  });
});
