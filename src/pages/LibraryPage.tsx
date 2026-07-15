import { useEffect } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import { Footer } from "../components/Footer";
import { TitleCard } from "../components/TitleCard";
import { useTitles } from "../hooks/useCatalogData";
import { useLibrary } from "../lib/libraryContext";

export function LibraryPage({ mode }: { mode: "favorites" | "history" }) {
  const { library } = useLibrary();
  const ids = mode === "favorites"
    ? library.favorites.map((item) => item.titleId)
    : [...new Set(library.history.map((item) => item.titleId))];
  const { data: titles, loading, error } = useTitles(ids);
  const title = mode === "favorites" ? "我的收藏" : "观看历史";

  useEffect(() => { document.title = `${title} - Movie Night`; }, [title]);

  return (
    <>
      <main className="catalog-page-shell library-page">
        <section className="catalog-page-head"><span>仅保存在当前浏览器</span><h1>{title}</h1></section>
        {loading ? <LoadingState label={`正在加载${title}`} /> : null}
        {error ? <ErrorState message={error.message} /> : null}
        {!loading && !error && titles?.length ? <section className="catalog-card-grid">{titles.map((item) => <TitleCard title={item} key={item.id} />)}</section> : null}
        {!loading && !error && !titles?.length ? <EmptyState title={mode === "favorites" ? "还没有收藏" : "还没有观看记录"} description={mode === "favorites" ? "在详情页点击收藏按钮，内容会出现在这里。" : "实际播放满 30 秒后会自动记录。"} /> : null}
      </main>
      <Footer />
    </>
  );
}
