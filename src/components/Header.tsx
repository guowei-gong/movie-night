import { useState, type FormEvent } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { asset } from "../lib/assets";
import { categoryPath, seoCategories } from "../lib/categories";

const primaryNavigation = [
  { label: "首页", href: "/" },
  ...seoCategories.map((category) => ({ label: category.name, href: categoryPath(category.slug) })),
] as const;

const utilityNavigation = [
  { label: "收藏", href: "/favorites", icon: "header-favorite.svg" },
  { label: "历史", href: "/history", icon: "header-history.svg" },
] as const;

function SearchForm({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputId = mobile ? "header-search-mobile" : "header-search";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword) return;
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    onNavigate?.();
  }

  return (
    <form className={`header-search${mobile ? " header-search-mobile" : ""}`} role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor={inputId}>搜索电影和剧集</label>
      <input
        id={inputId}
        name="q"
        type="search"
        value={query}
        placeholder="搜索片名、演员或导演"
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="搜索">
        <img src={asset("header-search.svg")} alt="" />
      </button>
    </form>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  function isPrimaryActive(item: (typeof primaryNavigation)[number]) {
    return location.pathname === item.href;
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-leading">
          <nav className="header-primary" aria-label="主导航">
            {primaryNavigation.map((item) => (
              <Link
                className={isPrimaryActive(item) ? "active" : undefined}
                aria-current={isPrimaryActive(item) ? "page" : undefined}
                to={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <SearchForm />

        <Link className="header-avatar" to="/favorites" aria-label="我的片库">
          <span aria-hidden="true" />
        </Link>

        <nav className="header-utilities" aria-label="个人片库">
          {utilityNavigation.map((item) => (
            <NavLink to={item.href} key={item.label}>
              <span className="header-utility-icon"><img src={asset(item.icon)} alt="" /></span>
              <span>{item.label}</span>
            </NavLink>
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
          <SearchForm mobile onNavigate={() => setMenuOpen(false)} />
          <nav aria-label="移动端导航">
            {primaryNavigation.map((item) => (
              <Link
                className={isPrimaryActive(item) ? "active" : undefined}
                aria-current={isPrimaryActive(item) ? "page" : undefined}
                to={item.href}
                key={item.label}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {utilityNavigation.map((item) => (
              <NavLink to={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
