import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import { Footer } from "../components/Footer";
import { TitleCard } from "../components/TitleCard";
import { searchTitles } from "../data/staticCatalogRepository";
import { useCatalogPage, useSearchIndex } from "../hooks/useCatalogData";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const category = params.get("category")?.trim() ?? "";
  const [input, setInput] = useState(query);
  const searchResource = useSearchIndex(Boolean(query));
  const categoryResource = useCatalogPage(category || undefined, 1, "latest");

  const results = useMemo(() => query ? searchTitles(searchResource.data, query) : categoryResource.data?.items ?? [], [query, searchResource.data, categoryResource.data]);
  const loading = query ? searchResource.loading : categoryResource.loading;
  const error = query ? searchResource.error : categoryResource.error;
  const heading = query ? `“${query}”的搜索结果` : category ? `${category}片库` : "搜索片库";

  useEffect(() => {
    setInput(query);
    document.title = `${heading} - Movie Night`;
  }, [heading, query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = input.trim();
    if (keyword) setParams({ q: keyword });
  }

  return (
    <>
      <main className="catalog-page-shell">
        <section className="catalog-page-head">
          <span>探索片库</span>
          <h1>{heading}</h1>
          <form className="catalog-search-form" onSubmit={submit}>
            <MagnifyingGlassIcon className="svg-icon icon-24" />
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入片名、演员或导演" aria-label="搜索片库" />
            <button className="button primary" type="submit">搜索</button>
          </form>
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
