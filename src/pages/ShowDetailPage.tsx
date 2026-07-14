import type { ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  HandThumbUpIcon,
  LanguageIcon,
  MusicalNoteIcon,
  PlusIcon,
  SpeakerWaveIcon,
  Squares2X2Icon,
  StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { CarouselButton } from "../components/CarouselButton";
import { Dots } from "../components/Dots";
import { PlayButton } from "../components/PlayButton";
import { TrialBanner } from "../components/TrialBanner";
import { asset } from "../lib/assets";

const episodes = [
  {
    number: "01",
    image: "show-episode-1.png",
    title: "第一章：威尔·拜尔斯失踪案",
    duration: "49 分钟",
    description:
      "威尔从朋友家回来的路上看见了可怕的东西。与此同时，政府实验室深处也潜伏着一个阴森的秘密。",
  },
  {
    number: "02",
    image: "show-episode-2.png",
    title: "第二章：枫树街上的怪女孩",
    duration: "56 分钟",
    description:
      "卢卡斯、迈克和达斯汀试着和他们在森林里发现的女孩沟通。霍珀则追问乔伊斯那通令人不安的电话。",
  },
  {
    number: "03",
    image: "show-episode-3.png",
    title: "第三章：圣诞彩灯",
    duration: "52 分钟",
    description:
      "越来越担心的南希寻找芭芭，并发现乔纳森一直在做什么。乔伊斯确信威尔正在试图和她说话。",
  },
  {
    number: "04",
    image: "show-episode-4.png",
    title: "第四章：尸体",
    duration: "51 分钟",
    description: "乔伊斯拒绝相信威尔已经死去，继续尝试联系儿子。男孩们则给十一做了一次改造。",
  },
  {
    number: "05",
    image: "show-episode-5.png",
    title: "第五章：跳蚤与杂技演员",
    duration: "53 分钟",
    description:
      "霍珀闯入实验室，南希和乔纳森直面夺走威尔的力量。男孩们向克拉克老师请教如何前往另一个维度。",
  },
];

const castImages = Array.from({ length: 8 }, (_, index) => `show-cast-${index + 1}.png`);

const reviews = [
  {
    name: "阿尼凯特·罗伊",
    location: "来自印度",
    score: "4.5",
    text: "这部剧是好友强烈推荐给我的。它把小镇悬疑、少年冒险和超自然惊悚融合得非常顺，节奏越来越让人停不下来。",
  },
  {
    name: "斯瓦拉吉",
    location: "来自印度",
    score: "5",
    text: "角色之间的情感很扎实，怪物和实验室线也足够有压迫感。它既有怀旧气质，也有非常强的连续追看动力。",
  },
];

const footerGroups = [
  ["首页", "分类", "设备", "价格", "常见问题"],
  ["电影", "类型", "热门", "新上线", "人气榜"],
  ["剧集", "类型", "热门", "新上线", "人气榜"],
  ["支持", "联系我们"],
  ["订阅", "套餐", "权益"],
];

function RatingStars({ score, size = "small" }: { score: string; size?: "small" | "large" }) {
  const value = Number(score);

  return (
    <span className={`show-rating-stars ${size}`} aria-label={`评分 ${score}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = value - index;
        const className = fill >= 1 ? "full" : fill > 0 ? "half" : "empty";

        return (
          <span className={className} key={index}>
            ★
          </span>
        );
      })}
    </span>
  );
}

function ShowHero() {
  return (
    <section className="show-detail-hero" aria-labelledby="show-title">
      <img className="show-detail-hero-image" src={asset("shows-stranger-hero.png")} alt="" />
      <div className="show-detail-hero-shade" />
      <div className="show-detail-hero-copy">
        <h1 id="show-title">怪奇物语</h1>
        <p>当一个男孩神秘失踪，小镇逐渐揭开秘密实验、恐怖超自然力量，以及一个奇怪小女孩背后的谜团。</p>
        <div className="show-hero-controls">
          <PlayButton />
          <button className="icon-box" aria-label="加入片单" type="button">
            <PlusIcon className="svg-icon icon-22" />
          </button>
          <button className="icon-box" aria-label="喜欢怪奇物语" type="button">
            <HandThumbUpIcon className="svg-icon icon-22" />
          </button>
          <button className="icon-box" aria-label="音频选项" type="button">
            <SpeakerWaveIcon className="svg-icon icon-22" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SeasonSummary({
  title,
  count,
  expanded = false,
}: {
  title: string;
  count: string;
  expanded?: boolean;
}) {
  const Icon = expanded ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="season-summary">
      <div>
        <strong>{title}</strong>
        <span>{count}</span>
      </div>
      <button type="button" aria-label={expanded ? "收起本季" : "展开本季"}>
        <Icon className="svg-icon icon-24" />
      </button>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: (typeof episodes)[number] }) {
  return (
    <article className="show-episode-row">
      <span className="show-episode-number">{episode.number}</span>
      <div className="show-episode-thumb">
        <img src={asset(episode.image)} alt="" />
        <span>
          <PlayIcon className="svg-icon icon-16" />
        </span>
      </div>
      <div className="show-episode-copy">
        <div className="show-episode-title-row">
          <h3>{episode.title}</h3>
          <span className="show-duration">
            <ClockIcon className="svg-icon icon-18" />
            {episode.duration}
          </span>
        </div>
        <p>{episode.description}</p>
      </div>
    </article>
  );
}

function SeasonsPanel() {
  return (
    <section className="show-section show-seasons-panel" aria-labelledby="seasons-title">
      <h2 id="seasons-title">季数与剧集</h2>
      <div className="show-seasons-stack">
        <SeasonSummary title="第 1 季" count="9 集" />
        <div className="season-expanded">
          <SeasonSummary title="第 2 季" count="5 集" expanded />
          <div className="show-episodes-list">
            {episodes.map((episode) => (
              <EpisodeCard episode={episode} key={episode.number} />
            ))}
          </div>
        </div>
        <SeasonSummary title="第 3 季" count="7 集" />
      </div>
    </section>
  );
}

function SectionShell({
  title,
  className = "",
  children,
  action,
}: {
  title: string;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={`show-section ${className}`}>
      <div className="show-section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function CastPanel() {
  return (
    <SectionShell
      title="演员阵容"
      className="show-cast-panel"
      action={
        <div className="show-panel-actions">
          <CarouselButton direction="previous" label="上一组演员" />
          <CarouselButton direction="next" label="下一组演员" />
        </div>
      }
    >
      <div className="show-cast-strip">
        {castImages.map((image, index) => (
          <img src={asset(image)} alt={`演员 ${index + 1}`} key={image} />
        ))}
      </div>
    </SectionShell>
  );
}

function ReviewsPanel() {
  return (
    <SectionShell
      title="用户评论"
      className="show-reviews-panel"
      action={
        <button className="show-add-review" type="button">
          <PlusIcon className="svg-icon icon-24" />
          添加你的评论
        </button>
      }
    >
      <div className="show-review-grid">
        {reviews.map((review) => (
          <article className="show-review-card" key={review.name}>
            <div className="show-review-head">
              <div>
                <h3>{review.name}</h3>
                <p>{review.location}</p>
              </div>
              <span className="show-review-rating">
                <RatingStars score={review.score} />
                <span>{review.score}</span>
              </span>
            </div>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
      <div className="show-review-pager">
        <CarouselButton direction="previous" label="上一页评论" />
        <Dots />
        <CarouselButton direction="next" label="下一页评论" />
      </div>
    </SectionShell>
  );
}

function SidebarBlock({ icon, title, children }: { icon?: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="show-sidebar-block">
      <h2>
        {icon}
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}

function PersonCard({ image, name, detail }: { image: string; name: string; detail: string }) {
  return (
    <div className="show-person-card">
      <img src={asset(image)} alt={name} />
      <div>
        <strong>{name}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function RatingsSidebar() {
  return (
    <div className="show-sidebar-ratings">
      <div>
        <strong>IMDb</strong>
        <span>
          <RatingStars score="4.5" size="large" />
          <em>4.5</em>
        </span>
      </div>
      <div>
        <strong>StreamVibe</strong>
        <span>
          <RatingStars score="4" size="large" />
          <em>4</em>
        </span>
      </div>
    </div>
  );
}

function ShowSidebar() {
  return (
    <aside className="show-sidebar" aria-label="剧集信息">
      <SidebarBlock icon={<CalendarDaysIcon className="svg-icon icon-24" />} title="发行年份">
        <strong className="show-sidebar-value">2022</strong>
      </SidebarBlock>
      <SidebarBlock icon={<LanguageIcon className="svg-icon icon-24" />} title="可用语言">
        <div className="show-tags">
          {["英语", "印地语", "泰米尔语", "泰卢固语", "卡纳达语"].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </SidebarBlock>
      <SidebarBlock icon={<StarOutlineIcon className="svg-icon icon-24" />} title="评分">
        <RatingsSidebar />
      </SidebarBlock>
      <SidebarBlock icon={<Squares2X2Icon className="svg-icon icon-24" />} title="类型">
        <div className="show-tags no-wrap">
          {["科幻剧", "青春剧", "美国剧集"].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </SidebarBlock>
      <SidebarBlock title="导演">
        <PersonCard image="show-director.png" name="达菲兄弟" detail="来自美国" />
      </SidebarBlock>
      <SidebarBlock title="音乐">
        <PersonCard image="show-music.png" name="凯尔·迪克森" detail="来自美国" />
      </SidebarBlock>
    </aside>
  );
}

function ShowFooter() {
  return (
    <footer className="show-footer">
      <div className="show-footer-grid">
        {footerGroups.map(([title, ...links]) => (
          <section key={title}>
            <h2>{title}</h2>
            {links.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </section>
        ))}
        <section>
          <h2>关注我们</h2>
          <div className="show-socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Twitter">
              x
            </a>
            <a href="#" aria-label="LinkedIn">
              in
            </a>
          </div>
        </section>
      </div>
      <div className="show-footer-bottom">
        <p>@2023 StreamVibe，保留所有权利</p>
        <div>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
          <a href="#">Cookie 政策</a>
        </div>
      </div>
    </footer>
  );
}

export function ShowDetailPage() {
  return (
    <>
      <main className="show-detail-page">
        <ShowHero />
        <section className="show-detail-layout">
          <div className="show-detail-main">
            <SeasonsPanel />
            <SectionShell title="简介" className="show-description-panel">
              <p>当一个男孩神秘失踪，小镇逐渐揭开秘密实验、恐怖超自然力量，以及一个奇怪小女孩背后的谜团。</p>
            </SectionShell>
            <CastPanel />
            <ReviewsPanel />
          </div>
          <ShowSidebar />
        </section>
        <TrialBanner />
      </main>
      <ShowFooter />
    </>
  );
}
