import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilmIcon,
  HandThumbUpIcon,
  LanguageIcon,
  MusicalNoteIcon,
  PlusIcon,
  SpeakerWaveIcon,
  StarIcon as StarOutlineIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Dots } from "../components/Dots";
import { Stars } from "../components/Stars";
import { TrialBanner } from "../components/TrialBanner";
import { castImages, reviews } from "../data/movieDetail";
import { asset } from "../lib/assets";

function MovieDetailHero() {
  return (
    <section className="detail-hero" aria-labelledby="movie-title">
      <img className="detail-hero-image" src={asset("detail-kantara-hero.png")} alt="" />
      <div className="detail-hero-vignette" />
      <div className="detail-hero-copy">
        <h1 id="movie-title">坎塔拉</h1>
        <p>一个年轻人与印度南部村庄神秘森林中的自然、信仰和古老传说发生冲突。</p>
        <div className="hero-controls">
          <button className="button primary">
            <PlayIcon className="svg-icon icon-18" />
            立即播放
          </button>
          <button className="icon-box" aria-label="加入片单">
            <PlusIcon className="svg-icon icon-22" />
          </button>
          <button className="icon-box" aria-label="喜欢">
            <HandThumbUpIcon className="svg-icon icon-22" />
          </button>
          <button className="icon-box" aria-label="音量">
            <SpeakerWaveIcon className="svg-icon icon-22" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`detail-panel ${className}`}>
      <div className="panel-title">{title}</div>
      {children}
    </section>
  );
}

function CastPanel() {
  return (
    <Panel title="演员阵容" className="cast-panel">
      <div className="cast-strip">
        {castImages.map((image, index) => (
          <img src={asset(image)} alt={`演员 ${index + 1}`} key={image} />
        ))}
      </div>
      <div className="panel-actions">
        <button className="round-control" aria-label="上一组演员">
          <ChevronLeftIcon className="svg-icon icon-20" />
        </button>
        <button className="round-control" aria-label="下一组演员">
          <ChevronRightIcon className="svg-icon icon-20" />
        </button>
      </div>
    </Panel>
  );
}

function ReviewsPanel() {
  return (
    <Panel title="用户评论" className="reviews-panel">
      <button className="review-button">
        <PlusIcon className="svg-icon icon-18" />
        添加评论
      </button>
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="review-head">
              <div>
                <h3>{review.name}</h3>
                <p>{review.location}</p>
              </div>
              <div className="rating-pill">
                <Stars score={review.score} />
                <span>{review.score}</span>
              </div>
            </div>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
      <div className="review-pager">
        <button className="round-control" aria-label="上一页评论">
          <ChevronLeftIcon className="svg-icon icon-20" />
        </button>
        <Dots />
        <button className="round-control" aria-label="下一页评论">
          <ChevronRightIcon className="svg-icon icon-20" />
        </button>
      </div>
    </Panel>
  );
}

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info-block">
      <div className="info-title">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: string }) {
  return (
    <div className="score-card">
      <strong>{label}</strong>
      <div>
        <Stars score={score} />
        <span>{score}</span>
      </div>
    </div>
  );
}

function PersonCard({ image, name, detail }: { image: string; name: string; detail: string }) {
  return (
    <div className="person-card">
      <img src={asset(image)} alt={name} />
      <div>
        <strong>{name}</strong>
        <span>{detail}</span>
      </div>
    </div>
  );
}

function DetailSidebar() {
  return (
    <aside className="detail-sidebar" aria-label="影片信息">
      <InfoBlock icon={<CalendarDaysIcon className="svg-icon icon-22" />} title="上映年份">
        <strong>2022</strong>
      </InfoBlock>
      <InfoBlock icon={<LanguageIcon className="svg-icon icon-22" />} title="可用语言">
        <div className="tag-list">
          {["英语", "印地语", "泰米尔语", "泰卢固语", "卡纳达语"].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </InfoBlock>
      <InfoBlock icon={<StarOutlineIcon className="svg-icon icon-22" />} title="评分">
        <div className="score-grid">
          <ScoreCard label="IMDb" score="4.5" />
          <ScoreCard label="StreamVibe" score="4.0" />
        </div>
      </InfoBlock>
      <InfoBlock icon={<FilmIcon className="svg-icon icon-22" />} title="类型">
        <div className="tag-list">
          <span>动作</span>
          <span>冒险</span>
        </div>
      </InfoBlock>
      <InfoBlock icon={<UserIcon className="svg-icon icon-22" />} title="导演">
        <PersonCard image="detail-cast-1.png" name="瑞沙布·谢蒂" detail="来自印度" />
      </InfoBlock>
      <InfoBlock icon={<MusicalNoteIcon className="svg-icon icon-22" />} title="音乐">
        <PersonCard image="detail-music.png" name="B. 阿贾尼什·洛克纳特" detail="来自印度" />
      </InfoBlock>
    </aside>
  );
}

export function MovieDetailPage() {
  return (
    <main className="detail-page">
      <MovieDetailHero />
      <section className="detail-layout">
        <div className="detail-main">
          <Panel title="简介" className="description-panel">
            <p className="description-copy">
              一名年轻人在印度南部村庄的神秘森林中与自然、信仰和民俗传统发生激烈碰撞。随着冲突升级，他必须面对土地、神灵与族群之间被埋藏许久的秘密。
            </p>
          </Panel>
          <CastPanel />
          <ReviewsPanel />
        </div>
        <DetailSidebar />
      </section>
      <TrialBanner />
    </main>
  );
}
