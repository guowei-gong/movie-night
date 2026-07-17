import { TitleCard } from "./TitleCard";
import { useCatalogPage } from "../hooks/useCatalogData";

export function RelatedTitles({ titleId, category }: { titleId: number; category: string }) {
  const page = (Math.abs(titleId) % 5) + 1;
  const { data, loading, error } = useCatalogPage(category, page, "score");
  const titles = data?.items.filter((title) => title.id !== titleId).slice(0, 8) ?? [];

  if (loading || error || !titles.length) return null;

  return (
    <section className="content-rail movier-poster-rail related-titles" aria-labelledby="related-titles-heading">
      <div className="section-header"><h2 id="related-titles-heading">相关{category}</h2></div>
      <div className="rail">{titles.map((title) => <TitleCard title={title} key={title.id} />)}</div>
    </section>
  );
}
