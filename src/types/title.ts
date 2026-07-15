export type TitleCategory = "电影" | "剧集" | "动漫" | "综艺" | "纪录片" | string;

export interface TitleSummary {
  id: number;
  title: string;
  category: TitleCategory;
  score: number;
  year: number;
  area: string;
  genre: string;
  status_text: string;
  cover_url: string;
}

export interface TitleDetail extends TitleSummary {
  actors: string;
  director: string;
  detail_url: string;
  play_url: string;
  description: string;
  updated_at?: string;
}

export interface TitleEpisode {
  sid: number;
  nid: number;
  title: string;
  play_url: string;
  m3u8_url: string;
}

export interface TitleSource {
  id: number;
  m3u8_url: string;
  episodes: TitleEpisode[];
}

export type CatalogSort = "latest" | "score" | "title";

export interface CategoryManifest {
  name: string;
  slug: string;
  count: number;
  pageCounts: Record<CatalogSort, number>;
}

export interface DataManifest {
  schemaVersion?: number;
  dataVersion?: string;
  generatedAt: string;
  totalRows: number;
  playableTotal: number;
  episodeTotal: number;
  pageSize: number;
  pageCounts: Record<CatalogSort, number>;
  bucketSize: number;
  categories: CategoryManifest[];
  categoryCounts: Record<string, number>;
}

export interface CatalogPage {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  items: TitleSummary[];
}

export interface HomeData {
  hero: TitleDetail | null;
  hot: TitleDetail[];
  latest: TitleDetail[];
  categories: Record<string, TitleDetail[]>;
}

export type SearchTuple = [
  id: number,
  title: string,
  category: string,
  score: number,
  year: number,
  area: string,
  genre: string,
  coverUrl: string,
  actors: string,
  director: string,
];

export interface SearchIndex {
  fields: string[];
  items: SearchTuple[];
}
