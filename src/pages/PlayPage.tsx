import { useEffect, useMemo } from "react";
import { ChevronLeftIcon, ListBulletIcon, StarIcon } from "@heroicons/react/24/outline";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { VideoPlayer } from "../components/VideoPlayer";
import { useSourceData, useTitleData } from "../hooks/useCatalogData";

export function PlayPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const titleResource = useTitleData(id);
  const sourceResource = useSourceData(id);
  const episodeKey = params.get("ep");
  const selectedEpisode = useMemo(() => {
    const episodes = sourceResource.data?.episodes ?? [];
    return episodes.find((episode) => `${episode.sid}-${episode.nid}` === episodeKey) ?? episodes[0] ?? null;
  }, [episodeKey, sourceResource.data]);

  useEffect(() => {
    if (titleResource.data) document.title = `播放 ${titleResource.data.title} - Movie Night`;
  }, [titleResource.data]);

  if (titleResource.loading || sourceResource.loading) return <LoadingState label="正在准备播放器" />;
  if (titleResource.error) return <ErrorState message={titleResource.error.message} />;
  if (sourceResource.error) return <ErrorState message={sourceResource.error.message} />;
  if (!titleResource.data || !sourceResource.data || !selectedEpisode) return <ErrorState message="没有找到可用的播放内容。" />;

  const title = titleResource.data;
  const source = sourceResource.data;
  return (
    <main className="play-page">
      <Link className="play-back-link" to={`/title/${title.id}`}><ChevronLeftIcon className="svg-icon icon-18" />返回详情</Link>
      <section className="play-layout">
        <div className="player-frame"><VideoPlayer title={title} episode={selectedEpisode} /></div>
        <aside className="episode-sidebar">
          <h1><ListBulletIcon className="svg-icon icon-24" />剧集列表</h1>
          <div className="episode-choice-list">
            {source.episodes.map((episode) => {
              const key = `${episode.sid}-${episode.nid}`;
              const active = key === `${selectedEpisode.sid}-${selectedEpisode.nid}`;
              return <button className={active ? "active" : ""} type="button" key={key} onClick={() => setParams({ ep: key })}><span>{episode.title}</span>{active ? <em>播放中</em> : null}</button>;
            })}
          </div>
          <div className="play-title-summary">
            <h2>{title.title}</h2>
            {title.score > 0 ? <span><StarIcon className="svg-icon icon-18" />{title.score.toFixed(1)}</span> : null}
            {title.description ? <p>{title.description}</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
