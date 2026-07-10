import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { asset } from "../lib/assets";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/movies" aria-label="StreamVibe 首页">
        <img src={asset("logo-streamvibe.svg")} alt="StreamVibe" />
      </a>
      <nav className="primary-nav" aria-label="主导航">
        <a href="/movies">首页</a>
        <a className="active" href="/movies">
          电影与剧集
        </a>
        <a href="#">支持</a>
        <a href="#">订阅</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button desktop-action" aria-label="搜索">
          <MagnifyingGlassIcon className="svg-icon icon-22" />
        </button>
        <button className="icon-button desktop-action" aria-label="通知">
          <BellIcon className="svg-icon icon-22" />
        </button>
        <button className="mobile-menu-button" aria-label="打开菜单">
          <Bars3Icon className="svg-icon icon-24" />
        </button>
      </div>
    </header>
  );
}
