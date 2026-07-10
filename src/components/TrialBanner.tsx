import { ctaBackdrop } from "../data/site";
import { asset } from "../lib/assets";

export function TrialBanner() {
  return (
    <section className="trial-banner">
      <div className="trial-backdrop" aria-hidden="true">
        {ctaBackdrop.map((image, index) => (
          <img src={asset(image)} alt="" key={`${image}-${index}`} />
        ))}
      </div>
      <div className="trial-copy">
        <h2>今天开始免费试用！</h2>
        <p>立即解锁 StreamVibe 的完整片库，随时观看热门电影、剧集和独家内容。</p>
      </div>
      <button className="button primary">开始免费试用</button>
    </section>
  );
}
