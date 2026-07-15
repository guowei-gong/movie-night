import type {
  CatalogPage,
  CatalogSort,
  DataManifest,
  HomeData,
  SearchIndex,
  TitleDetail,
  TitleSource,
} from "../types/title";

export interface CatalogRepository {
  getManifest(): Promise<DataManifest>;
  getHome(): Promise<HomeData>;
  getCatalog(category: string, page?: number, sort?: CatalogSort): Promise<CatalogPage>;
  getTitle(id: number): Promise<TitleDetail | null>;
  getTitles(ids: number[]): Promise<TitleDetail[]>;
  getSource(id: number): Promise<TitleSource>;
  getSearchIndex(): Promise<SearchIndex>;
}

export class CatalogRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CatalogRequestError";
  }
}
