import { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { asset } from "../lib/assets";

const mainNavigation = [
  { label: "首页", href: "/movies", hasMenu: false },
  { label: "番剧", href: "/movies#popular-shows", hasMenu: false },
  // Temporarily hidden per header design pass; keep for quick restore later.
  // { label: "直播", href: "/movies#trending-movies", hasMenu: false },
] as const;

const utilityNavigation = [
  // Temporarily hidden per header design pass; keep for quick restore later.
  // { label: "大会员", href: "#membership", icon: "header-vip.svg", hasNotice: false },
  { label: "消息", href: "#messages", icon: "header-message.svg", hasNotice: true },
  { label: "动态", href: "#feed", icon: "header-feed.svg", hasNotice: false },
  { label: "收藏", href: "#favorites", icon: "header-favorite.svg", hasNotice: false },
  { label: "历史", href: "#history", icon: "header-history.svg", hasNotice: false },
] as const;

const searchHistory = ["如何戒烟"] as const;

type TrendingSearch = {
  rank: number;
  label: string;
  selected?: boolean;
};

const trendingSearches: TrendingSearch[] = [
  { rank: 1, label: "杨瀚森夏联爆砍18分10板" },
  { rank: 2, label: "因缘精灵刃长膝盖实况" },
  { rank: 3, label: "AI预测法国vs西班牙赛果" },
  { rank: 4, label: "台风巴威对东北影响有多大" },
  { rank: 5, label: "凡人修仙传182集深度解析" },
  { rank: 6, label: "于文文来B站了" },
  { rank: 7, label: "李大霄谈如何预防华尔街收割" },
  { rank: 8, label: "为何英格兰夺冠支持率在下降" },
  { rank: 9, label: "有一个勇者前来斩杀魔王" },
  { rank: 10, label: "韩国股市为何频频熔断" },
] as const;

function SearchForm({ mobile = false }: { mobile?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const inputId = mobile ? "header-search-mobile" : "header-search";
  const panelId = `${inputId}-panel`;

  useEffect(() => {
    if (!expanded) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  return (
    <form
      ref={searchRef}
      className={`header-search${mobile ? " header-search-mobile" : ""}${expanded ? " expanded" : ""}`}
      action="/movies"
      role="search"
    >
      <label className="sr-only" htmlFor={inputId}>
        搜索电影和剧集
      </label>
      <input
        id={inputId}
        name="search"
        type="search"
        placeholder="芙芙家的洗碗君"
        autoComplete="off"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded(true)}
        onFocus={() => setExpanded(true)}
      />
      <button type="submit" aria-label="搜索">
        <img src={asset("header-search.svg")} alt="" />
      </button>

      <div className="header-search-panel" id={panelId} aria-hidden={!expanded}>
        <div className="search-panel-row">
          <h2>搜索历史</h2>
          <button className="search-clear" type="button">
            清空
          </button>
        </div>

        <div className="search-history-list">
          {searchHistory.map((item) => (
            <button className="search-history-chip" type="button" key={item}>
              {item}
            </button>
          ))}
        </div>

        <h2 className="search-hot-title">热门搜索</h2>
        <ol className="search-hot-list">
          {trendingSearches.map((item) => (
            <li className={`${item.rank > 3 ? "muted-rank" : ""}${item.selected ? " selected" : ""}`.trim()} key={item.rank}>
              <a href={`/movies?search=${encodeURIComponent(item.label)}`}>
                <span className="search-hot-rank">{item.rank}</span>
                <span className="search-hot-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </form>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-leading">
          <nav className="header-primary" aria-label="主导航">
            {mainNavigation.map((item) => (
              <a href={item.href} key={item.label}>
                {item.label}
                {item.hasMenu && <img className="header-chevron" src={asset("header-chevron.svg")} alt="" />}
              </a>
            ))}
          </nav>

          {/*
          Temporarily hidden per header design pass; keep for quick restore later.
          <a className="header-client" href="#download">
            <img src={asset("header-download.svg")} alt="" />
            <span>下载客户端</span>
          </a>
          */}
        </div>

        <SearchForm />

        <a className="header-avatar" href="#profile" aria-label="个人中心">
          <span aria-hidden="true" />
        </a>

        <nav className="header-utilities" aria-label="用户功能">
          {utilityNavigation.map((item) => (
            <a href={item.href} key={item.label}>
              <span className="header-utility-icon">
                <img src={asset(item.icon)} alt="" />
                {item.hasNotice && <i aria-label="有新消息" />}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <XMarkIcon className="svg-icon icon-24" /> : <Bars3Icon className="svg-icon icon-24" />}
        </button>

        <div className={`mobile-nav-panel${menuOpen ? " open" : ""}`} id="mobile-navigation">
          <SearchForm mobile />
          <nav aria-label="移动端导航">
            {mainNavigation.map((item) => (
              <a href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
