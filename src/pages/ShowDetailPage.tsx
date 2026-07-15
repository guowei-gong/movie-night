import { useEffect, type ReactNode } from "react";
import {
  CalendarDaysIcon,
  GlobeAltIcon,
  HeartIcon as HeartOutlineIcon,
  Squares2X2Icon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ErrorState } from "../components/AsyncState";
import { Footer } from "../components/Footer";
import { PlayButton } from "../components/PlayButton";
import { TrialBanner } from "../components/TrialBanner";
import { useSourceData } from "../hooks/useCatalogData";
import { useLibrary } from "../lib/libraryContext";
import { coverUrl } from "../lib/media";
import type { TitleDetail, TitleEpisode } from "../types/title";

function splitValues(value: string) {
  return value.split(/\s*[/,|]\s*/).map((item) => item.trim()).filter(Boolean);
}

function SectionShell({ title, className = "", children }: { title: string; className?: string; children: ReactNode }) {
  return <section className={`show-section ${className}`}><div className="show-section-head"><h2>{title}</h2></div>{children}</section>;
}

function EpisodeRow({ titleId, episode, index }: { titleId: number; episode: TitleEpisode; index: number }) {
  return (
    <Link className="show-episode-row no-thumb" to={`/play/${titleId}?ep=${episode.sid}-${episode.nid}`}>
      <span className="show-episode-number">{String(index + 1).padStart(2, "0")}</span>
      <span className="episode-play-icon"><PlayIcon className="svg-icon icon-16" /></span>
      <div className="show-episode-copy"><div className="show-episode-title-row"><h3>{episode.title}</h3></div></div>
    </Link>
  );
}

function SeasonsPanel({ titleId, episodes }: { titleId: number; episodes: TitleEpisode[] }) {
  const seasons = new Map<number, TitleEpisode[]>();
  for (const episode of episodes) {
    seasons.set(episode.sid, [...(seasons.get(episode.sid) ?? []), episode]);
  }
  return (
    <section className="show-section show-seasons-panel" aria-labelledby="seasons-title">
      <h2 id="seasons-title">季数与剧集</h2>
      <div className="show-seasons-stack">
        {[...seasons.entries()].map(([sid, seasonEpisodes]) => (
          <div className="season-expanded" key={sid}>
            <div className="season-summary"><div><strong>第 {sid} 季</strong><span>{seasonEpisodes.length} 集</span></div></div>
            <div className="show-episodes-list">
              {seasonEpisodes.map((episode, index) => <EpisodeRow titleId={titleId} episode={episode} index={index} key={`${episode.sid}-${episode.nid}`} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SidebarBlock({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="show-sidebar-block"><h2>{icon}<span>{title}</span></h2>{children}</section>;
}

export function ShowDetailPage({ title }: { title: TitleDetail }) {
  const { data: source, loading: sourceLoading, error: sourceError } = useSourceData(title.id);
  const { isFavorite, toggleFavorite } = useLibrary();
  const favorite = isFavorite(title.id);
  const actors = splitValues(title.actors);
  const genres = title.genre && title.genre !== "未知" ? splitValues(title.genre) : [];

  useEffect(() => { document.title = `${title.title} - Movie Night`; }, [title.title]);

  return (
    <>
      <main className="show-detail-page">
        <section className="show-detail-hero" aria-labelledby="show-title">
          <img className="show-detail-hero-image" src={coverUrl(title.cover_url)} alt="" />
          <div className="show-detail-hero-shade" />
          <div className="show-detail-hero-copy">
            <span className="detail-kicker">{title.category}{title.status_text ? ` · ${title.status_text}` : ""}</span>
            <h1 id="show-title">{title.title}</h1>
            {title.description ? <p>{title.description}</p> : null}
            <div className="show-hero-controls">
              <PlayButton to={`/play/${title.id}`} />
              <button className={`icon-box${favorite ? " active" : ""}`} type="button" aria-label={favorite ? "取消收藏" : "加入收藏"} onClick={() => toggleFavorite(title.id)}>
                {favorite
                  ? <HeartSolidIcon className="svg-icon icon-22" />
                  : <HeartOutlineIcon className="svg-icon icon-22" />}
              </button>
            </div>
          </div>
        </section>

        <section className="show-detail-layout">
          <div className="show-detail-main">
            {sourceLoading ? <SectionShell title="季数与剧集" className="show-seasons-panel"><p className="inline-state">正在加载剧集...</p></SectionShell> : null}
            {sourceError ? <SectionShell title="季数与剧集" className="show-seasons-panel"><ErrorState message={sourceError.message} /></SectionShell> : null}
            {source?.episodes.length ? <SeasonsPanel titleId={title.id} episodes={source.episodes} /> : null}
            {title.description ? <SectionShell title="简介" className="show-description-panel"><p>{title.description}</p></SectionShell> : null}
            {actors.length ? <SectionShell title="演员阵容" className="show-cast-panel"><div className="cast-name-list">{actors.map((actor) => <span key={actor}>{actor}</span>)}</div></SectionShell> : null}
          </div>

          <aside className="show-sidebar" aria-label="剧集信息">
            {title.year > 0 ? <SidebarBlock icon={<CalendarDaysIcon className="svg-icon icon-24" />} title="发行年份"><strong className="show-sidebar-value">{title.year}</strong></SidebarBlock> : null}
            {title.area && title.area !== "未知" ? <SidebarBlock icon={<GlobeAltIcon className="svg-icon icon-24" />} title="地区"><strong className="show-sidebar-value">{title.area}</strong></SidebarBlock> : null}
            {title.score > 0 ? <SidebarBlock icon={<StarIcon className="svg-icon icon-24" />} title="评分"><strong className="show-sidebar-value score-value">{title.score.toFixed(1)}</strong></SidebarBlock> : null}
            {genres.length ? <SidebarBlock icon={<Squares2X2Icon className="svg-icon icon-24" />} title="类型"><div className="show-tags">{genres.map((genre) => <span key={genre}>{genre}</span>)}</div></SidebarBlock> : null}
            {title.director ? <SidebarBlock icon={<UserIcon className="svg-icon icon-24" />} title="导演"><strong className="show-sidebar-value">{title.director}</strong></SidebarBlock> : null}
          </aside>
        </section>
        <TrialBanner />
      </main>
      <Footer />
    </>
  );
}
