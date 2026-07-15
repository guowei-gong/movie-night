import { useState } from "react";
import { Link } from "react-router-dom";
import { coverUrl } from "../lib/media";
import type { TitleSummary } from "../types/title";

export function TitleCard({ title }: { title: TitleSummary }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <Link className="movier-poster-card title-card-link" to={`/title/${title.id}`}>
      {imageFailed || !title.cover_url ? (
        <span className="title-image-fallback">{title.title}</span>
      ) : (
        <img src={coverUrl(title.cover_url)} alt={title.title} loading="lazy" onError={() => setImageFailed(true)} />
      )}
      <span className="title-card-shade" />
      <strong>{title.title}</strong>
      <span className="title-card-meta">
        {title.year > 0 ? title.year : title.category}
        {title.score > 0 ? ` · ${title.score.toFixed(1)}` : ""}
      </span>
    </Link>
  );
}
