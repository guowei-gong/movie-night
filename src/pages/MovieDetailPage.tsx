import { useEffect, type ReactNode } from "react";
import {
  CalendarDaysIcon,
  FilmIcon,
  GlobeAltIcon,
  HeartIcon as HeartOutlineIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Footer } from "../components/Footer";
import { PlayButton } from "../components/PlayButton";
import { RelatedTitles } from "../components/RelatedTitles";
import { TrialBanner } from "../components/TrialBanner";
import { useLibrary } from "../lib/libraryContext";
import { coverUrl } from "../lib/media";
import { titleFactSummary, titleSeoHeading, titleSeoTitle } from "../lib/titleSeo";
import type { TitleDetail } from "../types/title";

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`detail-panel ${className}`}>
      <div className="panel-title">{title}</div>
      {children}
    </section>
  );
}

function InfoBlock({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="info-block">
      <div className="info-title">{icon}<span>{title}</span></div>
      {children}
    </div>
  );
}

function splitValues(value: string) {
  return value.split(/\s*[/,|]\s*/).map((item) => item.trim()).filter(Boolean);
}

export function MovieDetailPage({ title }: { title: TitleDetail }) {
  const { isFavorite, toggleFavorite } = useLibrary();
  const favorite = isFavorite(title.id);
  const actors = splitValues(title.actors);
  const genres = title.genre && title.genre !== "未知" ? splitValues(title.genre) : [];
  const summary = title.description || titleFactSummary(title);

  useEffect(() => {
    document.title = titleSeoTitle(title);
  }, [title]);

  return (
    <>
      <main className="detail-page">
        <section className="detail-hero" aria-labelledby="movie-title">
          <img className="detail-hero-image" src={coverUrl(title.cover_url)} alt="" />
          <div className="detail-hero-vignette" />
          <div className="detail-hero-copy">
            <span className="detail-kicker">{title.category}{title.status_text ? ` · ${title.status_text}` : ""}</span>
            <h1 id="movie-title">{titleSeoHeading(title)}</h1>
            <p>{summary}</p>
            <div className="hero-controls">
              <PlayButton to={`/play/${title.id}`} />
              <button
                className={`icon-box${favorite ? " active" : ""}`}
                aria-label={favorite ? "取消收藏" : "加入收藏"}
                type="button"
                onClick={() => toggleFavorite(title.id)}
              >
                {favorite
                  ? <HeartSolidIcon className="svg-icon icon-22" />
                  : <HeartOutlineIcon className="svg-icon icon-22" />}
              </button>
            </div>
          </div>
        </section>

        <section className="detail-layout">
          <div className="detail-main">
            <Panel title="影片介绍" className="description-panel"><p className="description-copy">{summary}</p></Panel>
            {actors.length ? (
              <Panel title="演员阵容" className="cast-panel">
                <div className="cast-name-list">{actors.map((actor) => <span key={actor}>{actor}</span>)}</div>
              </Panel>
            ) : null}
          </div>

          <aside className="detail-sidebar" aria-label="影片信息">
            {title.year > 0 ? <InfoBlock icon={<CalendarDaysIcon className="svg-icon icon-24" />} title="发行年份"><strong>{title.year}</strong></InfoBlock> : null}
            {title.area && title.area !== "未知" ? <InfoBlock icon={<GlobeAltIcon className="svg-icon icon-24" />} title="地区"><strong>{title.area}</strong></InfoBlock> : null}
            {title.score > 0 ? <InfoBlock icon={<StarIcon className="svg-icon icon-24" />} title="评分"><strong className="score-value">{title.score.toFixed(1)}</strong></InfoBlock> : null}
            {genres.length ? <InfoBlock icon={<FilmIcon className="svg-icon icon-24" />} title="类型"><div className="tag-list">{genres.map((genre) => <span key={genre}>{genre}</span>)}</div></InfoBlock> : null}
            {title.director ? <InfoBlock icon={<UserIcon className="svg-icon icon-24" />} title="导演"><strong>{title.director}</strong></InfoBlock> : null}
          </aside>
        </section>
        <RelatedTitles titleId={title.id} category={title.category} />
        <TrialBanner />
      </main>
      <Footer />
    </>
  );
}
