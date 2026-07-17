import type { TitleDetail } from "../types/title";

function known(value: string | undefined) {
  return Boolean(value && value !== "未知");
}

function firstValues(value: string, limit: number) {
  return value.split(/\s*[\/,|]\s*/).map((item) => item.trim()).filter(Boolean).slice(0, limit).join("、");
}

export function titleSeoTitle(title: TitleDetail) {
  return `${title.title}${title.year > 0 ? ` (${title.year})` : ""} 在线观看 | Movie Night`;
}

export function titleSeoHeading(title: TitleDetail) {
  return `${title.title} 在线观看`;
}

export function titleFactSummary(title: TitleDetail) {
  const facts = [
    title.year > 0 ? `${title.year}年` : "",
    known(title.area) ? title.area : "",
    known(title.genre) ? title.genre : "",
    title.category,
  ].filter(Boolean).join(" · ");
  const credits = [
    title.director ? `导演：${title.director}` : "",
    title.actors ? `主演：${firstValues(title.actors, 6)}` : "",
  ].filter(Boolean).join("；");

  return `《${title.title}》${facts ? `（${facts}）` : ""}在线播放${credits ? `，${credits}` : ""}。`;
}
