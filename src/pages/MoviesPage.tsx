import { useEffect } from "react";
import { ClockIcon, HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon } from "@heroicons/react/24/solid";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { CarouselButton } from "../components/CarouselButton";
import { Dots } from "../components/Dots";
import { Footer } from "../components/Footer";
import { PlayButton } from "../components/PlayButton";
import { TitleCard } from "../components/TitleCard";
import { TrialBanner } from "../components/TrialBanner";
import { useHomeData } from "../hooks/useCatalogData";
import { useLibrary } from "../lib/libraryContext";
import { coverUrl } from "../lib/media";
import type { HomeData, TitleDetail } from "../types/title";

function ListingHero({ title }: { title: TitleDetail }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const favorite = isFavorite(title.id);
  return (
    <section className="movier-hero" aria-labelledby="listing-hero-title">
      <img className="movier-hero-bg" src={coverUrl(title.cover_url)} alt="" />
      <div className="movier-hero-shade" />
      <div className="movier-hero-copy">
        <span className="movier-kicker">今日推荐 · {title.category}</span>
        <h1 id="listing-hero-title">{title.title}{title.year > 0 ? `（${title.year}）` : ""}</h1>
        <div className="movier-rating-row" aria-label="影片评分与状态">
          {title.score > 0 ? (
            <span className="movier-stars">
              <StarIcon className="svg-icon icon-16" />
              {title.score.toFixed(1)}
            </span>
          ) : null}
          {title.status_text ? <span><ClockIcon className="svg-icon icon-16" />{title.status_text}</span> : null}
        </div>
        {title.description ? <div className="movier-overview"><p>{title.description}</p></div> : null}
        <div className="movier-hero-actions">
          <PlayButton to={`/play/${title.id}`} />
          <button
            className={`icon-box${favorite ? " active" : ""}`}
            type="button"
            aria-label={favorite ? "取消收藏" : "加入收藏"}
            onClick={() => toggleFavorite(title.id)}
          >
            {favorite
              ? <HeartSolidIcon className="svg-icon icon-22" />
              : <HeartOutlineIcon className="svg-icon icon-22" />}
          </button>
        </div>
      </div>
      {title.status_text ? <p className="movier-quote">{title.status_text}</p> : null}
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <div className="rail-controls" aria-hidden="true">
        <CarouselButton direction="previous" label={`上一组${title}`} className="small" />
        <Dots />
        <CarouselButton direction="next" label={`下一组${title}`} className="small" />
      </div>
    </div>
  );
}

function ContentRail({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  const headingId = id ?? title;
  return (
    <section className="content-rail movier-poster-rail" aria-labelledby={headingId} id={id}>
      <SectionHeader title={title} />
      <div className="rail">{children}</div>
    </section>
  );
}

function Catalog({ home }: { home: HomeData }) {
  return (
    <section className="movier-catalog" aria-label="电影与剧集片库">
      <ContentRail title="高分热播" id="trending-titles">
        {home.hot.slice(0, 10).map((title) => <TitleCard title={title} key={title.id} />)}
      </ContentRail>
      <ContentRail title="最近更新" id="latest-titles">
        {home.latest.slice(0, 10).map((title) => <TitleCard title={title} key={title.id} />)}
      </ContentRail>
    </section>
  );
}

export function MoviesPage() {
  const { data: home, loading, error } = useHomeData();
  useEffect(() => { document.title = "Movie Night - 在线电影、剧集、动漫与综艺"; }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!home) return <LoadingState />;

  return (
    <>
      <main className="movies-page">
        {home.hero ? <ListingHero title={home.hero} /> : null}
        <Catalog home={home} />
        <TrialBanner />
      </main>
      <Footer />
    </>
  );
}
