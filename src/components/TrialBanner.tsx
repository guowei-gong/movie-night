import { ctaBackdrop } from "../data/site";
import { asset } from "../lib/assets";

type TrialBannerProps = {
  id?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function TrialBanner({
  id = "messages",
  title = "没找到想看的电影或电视剧？",
  description = "给我们留言，说出你最想看的片名。我们会认真查看大家的推荐，把更多好电影、好剧集加入站点。",
  actionLabel = "去留言",
  actionHref = "#messages",
  className = "",
}: TrialBannerProps) {
  return (
    <section className={`trial-banner${className ? ` ${className}` : ""}`} id={id}>
      <div className="trial-backdrop" aria-hidden="true">
        {Array.from({ length: 3 }, (_, row) => (
          <div className="trial-backdrop-row" key={row}>
            {ctaBackdrop.map((image, index) => (
              <img src={asset(image)} alt="" key={`${row}-${image}-${index}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="trial-copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <a className="button primary trial-action" href={actionHref}>
        {actionLabel}
      </a>
    </section>
  );
}
