import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  HandThumbUpIcon,
  PlusIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon, StarIcon } from "@heroicons/react/24/solid";
import { Dots } from "../components/Dots";
import { TrialBanner } from "../components/TrialBanner";
import { genres, type Genre } from "../data/catalog";
import { asset } from "../lib/assets";

type Poster = {
  title: string;
  image: string;
};

const trendingMovies: Poster[] = [
  { title: "鬼灭之刃：无限列车篇", image: "movier-demon-slayer.png" },
  { title: "末日激战", image: "movier-outside-wire.png" },
  { title: "哥斯拉大战金刚", image: "movier-godzilla-kong.png" },
  { title: "真人快打", image: "movier-mortal-kombat.png" },
  { title: "复仇者联盟：终局之战", image: "movier-avengers-faded.png" },
];

function ListingHero() {
  return (
    <section className="movier-hero" aria-labelledby="listing-hero-title">
      <img className="movier-hero-bg" src={asset("movier-demon-slayer.png")} alt="" />
      <div className="movier-hero-shade" />
      <div className="movier-brand-row" aria-hidden="true">
        <span>MOVIER</span>
        <nav>
          <a>首页</a>
          <a>热门</a>
        </nav>
      </div>

      <div className="movier-hero-copy">
        <h1 id="listing-hero-title">鬼灭之刃 - 无限列车篇（2020）</h1>
        <div className="movier-rating-row" aria-label="五星评分和片长">
          <span className="movier-stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon className="svg-icon icon-16" key={index} />
            ))}
          </span>
          <span>
            <ClockIcon className="svg-icon icon-16" />
            1小时57分
          </span>
        </div>

        <div className="movier-overview">
          <p>
            炭治郎与伊之助、善逸一同登上无限列车，和炎柱炼狱杏寿郎并肩执行新的任务，追查并击败折磨乘客的恶鬼。
          </p>
        </div>

        <div className="movier-hero-actions">
          <button className="button primary">
            <PlayIcon className="svg-icon icon-18" />
            立即播放
          </button>
          <div className="movier-hero-icon-actions" aria-hidden="true">
            <button className="icon-box">
              <PlusIcon className="svg-icon icon-22" />
            </button>
            <button className="icon-box">
              <HandThumbUpIcon className="svg-icon icon-22" />
            </button>
            <button className="icon-box">
              <SpeakerWaveIcon className="svg-icon icon-22" />
            </button>
          </div>
        </div>
      </div>

      <p className="movier-quote">“挥动你的刀，终结这场噩梦。”</p>
      <div className="movier-hero-pagination" aria-hidden="true">
        <button className="icon-box">
          <ArrowLeftIcon className="svg-icon icon-arrow-left" strokeWidth={2} />
        </button>
        <Dots />
        <button className="icon-box">
          <ArrowRightIcon className="svg-icon icon-arrow-right" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <div className="rail-controls" aria-hidden="true">
        <button className="icon-box small">
          <ArrowLeftIcon className="svg-icon icon-arrow-left" strokeWidth={2} />
        </button>
        <Dots />
        <button className="icon-box small">
          <ArrowRightIcon className="svg-icon icon-arrow-right" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function PosterCard({ poster, featured = false }: { poster: Poster; featured?: boolean }) {
  return (
    <article className={`movier-poster-card ${featured ? "featured" : ""}`}>
      <img src={asset(poster.image)} alt={poster.title} />
      <strong>{poster.title}</strong>
    </article>
  );
}

function GenreCard({ genre }: { genre: Genre }) {
  return (
    <article className={`genre-card ${genre.tag ? "featured" : ""}`}>
      <div className="poster-grid">
        {genre.images.map((image) => (
          <img src={asset(image)} alt="" key={image} />
        ))}
      </div>
      <div className="genre-caption">
        <div>
          {genre.tag && <span>{genre.tag}</span>}
          <strong>{genre.name}</strong>
        </div>
        <ChevronRightIcon className="svg-icon icon-24" />
      </div>
    </article>
  );
}

function ContentRail({
  title,
  children,
  className = "",
  id,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const headingId = id ?? title.replace(/\s+/g, "-").toLowerCase();

  return (
    <section className={`content-rail ${className}`} aria-labelledby={headingId} id={id}>
      <SectionHeader title={title} />
      <div className="rail">{children}</div>
    </section>
  );
}

function MovierFooter() {
  const groups = [
    {
      title: "产品",
      links: ["关于 Movier", "会员方案", "移动应用", "观看设备"],
    },
    {
      title: "资源",
      links: ["帮助中心", "热门电影", "热门剧集"],
    },
    {
      title: "公司",
      links: ["关于我们", "加入我们", "联系我们", "媒体合作"],
    },
    {
      title: "条款",
      links: ["隐私政策", "服务条款"],
    },
  ];

  return (
    <footer className="movier-footer">
      <strong>MOVIER</strong>
      {groups.map((group) => (
        <div className="movier-footer-group" key={group.title}>
          <h2>{group.title}</h2>
          {group.links.map((link) => (
            <a href="#" key={link}>
              {link}
            </a>
          ))}
        </div>
      ))}
    </footer>
  );
}

export function MoviesPage() {
  return (
    <main className="movies-page">
      <ListingHero />
      <section className="movier-catalog" aria-label="电影与剧集片库">
        <ContentRail title="热门电影" className="movier-poster-rail" id="trending-movies">
          {trendingMovies.map((poster) => (
            <PosterCard poster={poster} key={poster.title} />
          ))}
        </ContentRail>

        <ContentRail title="热门剧集" className="movier-poster-rail">
          {trendingMovies.map((poster) => (
            <PosterCard poster={poster} key={`tv-${poster.title}`} />
          ))}
        </ContentRail>

        <ContentRail title="按类型浏览" className="movier-genre-rail">
          {genres.map((genre) => (
            <GenreCard genre={genre} key={genre.name} />
          ))}
        </ContentRail>
      </section>
      <TrialBanner />
      <MovierFooter />
    </main>
  );
}
