import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import { Footer } from "../components/Footer";
import { TitleCard } from "../components/TitleCard";
import { searchTitles } from "../data/staticCatalogRepository";
import { useCatalogPage, useSearchIndex } from "../hooks/useCatalogData";
import { categoryNameForSlug } from "../lib/categories";

export function SearchPage() {
  const { categorySlug } = useParams();
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const category = categoryNameForSlug(categorySlug) || params.get("category")?.trim() || "";
  const searchResource = useSearchIndex(Boolean(query));
  const categoryResource = useCatalogPage(category || undefined, 1, "latest");

  const results = useMemo(() => query ? searchTitles(searchResource.data, query) : categoryResource.data?.items ?? [], [query, searchResource.data, categoryResource.data]);
  const loading = query ? searchResource.loading : categoryResource.loading;
  const error = query ? searchResource.error : categoryResource.error;
  const heading = query ? `“${query}”的搜索结果` : category ? `${category}在线观看` : "搜索片库";

  useEffect(() => {
    document.title = query ? `${heading} | Movie Night` : category ? `${category}在线观看 | Movie Night` : "搜索片库 | Movie Night";
  }, [category, heading, query]);

  return (
    <>
      <main className="catalog-page-shell">
        <section className="catalog-page-head">
          <span>探索片库</span>
          <h1>{heading}</h1>
        </section>

        {loading ? <LoadingState label="正在检索片库" /> : null}
        {error ? <ErrorState message={error.message} /> : null}
        {!loading && !error && results.length ? <section className="catalog-card-grid">{results.map((title) => <TitleCard title={title} key={title.id} />)}</section> : null}
        {!loading && !error && !results.length && (query || category) ? <EmptyState title="没有找到相关内容" description="可以尝试更短的片名或演员姓名。" /> : null}
      </main>
      <Footer />
    </>
  );
}
