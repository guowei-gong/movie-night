export const seoCategories = [
  { name: "电影", slug: "movie" },
  { name: "剧集", slug: "series" },
  { name: "动漫", slug: "anime" },
  { name: "综艺", slug: "variety" },
] as const;

export function categoryNameForSlug(slug: string | undefined) {
  return seoCategories.find((category) => category.slug === slug)?.name ?? "";
}

export function categoryPath(slug: string) {
  return `/category/${slug}`;
}
