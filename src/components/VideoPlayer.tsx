import { useEffect, useRef, useState } from "react";
import ArtplayerImport from "artplayer";
import Hls from "hls.js";
import { useLibrary } from "../lib/libraryContext";
import { unwrapDefault } from "../lib/moduleInterop";
import type { TitleDetail, TitleEpisode } from "../types/title";

export function VideoPlayer({ title, episode }: { title: TitleDetail; episode: TitleEpisode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRecorded = useRef(false);
  const lastSavedAt = useRef(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const { addHistory, getProgress, saveProgress } = useLibrary();

  useEffect(() => {
    if (!containerRef.current) return;
    setPlayerError(null);
    const Artplayer = unwrapDefault<typeof ArtplayerImport>(ArtplayerImport);
    const hlsInstances: Hls[] = [];
    const saved = getProgress(title.id, episode.sid, episode.nid);
    const player = new Artplayer({
      container: containerRef.current,
      url: episode.m3u8_url,
      type: "m3u8",
      autoplay: false,
      pip: true,
      setting: true,
      playbackRate: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      customType: {
        m3u8(video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hlsInstances.push(hls);
            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal || (data.response?.code ?? 0) >= 400) {
                setPlayerError("当前播放源不可用，请稍后重试或切换其他剧集。");
              }
            });
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
    });

    const persist = () => {
      if (player.currentTime <= 0 || player.duration <= 0) return;
      saveProgress({
        titleId: title.id,
        sid: episode.sid,
        nid: episode.nid,
        currentTime: player.currentTime,
        duration: player.duration,
        updatedAt: new Date().toISOString(),
      });
      lastSavedAt.current = player.currentTime;
    };

    player.on("video:loadedmetadata", () => {
      if (saved?.currentTime) player.seek = Math.min(saved.currentTime, Math.max(0, player.duration - 5));
    });
    player.on("video:timeupdate", () => {
      if (!historyRecorded.current && player.currentTime >= 30) {
        historyRecorded.current = true;
        addHistory(title.id, episode.sid, episode.nid);
      }
      if (player.currentTime - lastSavedAt.current >= 10) persist();
    });
    player.on("video:pause", persist);
    player.on("video:ended", persist);
    player.on("video:error", () => setPlayerError("当前播放源无法播放，请稍后重试。"));

    return () => {
      persist();
      hlsInstances.forEach((hls) => hls.destroy());
      player.destroy(false);
    };
  // The player must only be recreated when the selected title or episode changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title.id, episode.sid, episode.nid, episode.m3u8_url]);

  return (
    <div className="video-player-shell">
      <div className="video-player" ref={containerRef} />
      {playerError ? <div className="player-error" role="alert">{playerError}</div> : null}
    </div>
  );
}
