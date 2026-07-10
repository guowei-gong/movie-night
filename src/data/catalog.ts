export type Genre = {
  name: string;
  images: string[];
  tag?: string;
};

export type ShowCard = {
  title: string;
  image: string;
  duration: string;
  meta: string;
  rating?: string;
};

export const genres: Genre[] = [
  {
    name: "动作",
    images: ["genre-action-1.png", "genre-action-2.png", "genre-action-3.png", "genre-action-4.png"],
  },
  {
    name: "冒险",
    images: ["genre-adventure-1.png", "genre-adventure-2.png", "genre-adventure-3.png", "genre-adventure-4.png"],
  },
  {
    name: "喜剧",
    images: ["genre-comedy-1.png", "genre-comedy-2.png", "genre-comedy-3.png", "genre-comedy-4.png"],
  },
  {
    name: "剧情",
    images: ["genre-drama-1.png", "genre-drama-2.png", "genre-drama-3.png", "genre-drama-4.png"],
  },
  {
    name: "恐怖",
    images: ["genre-horror-1.png", "genre-horror-2.png", "genre-horror-3.png", "genre-horror-4.png"],
  },
];

export const topGenres: Genre[] = [
  {
    name: "动作",
    tag: "前十名",
    images: ["top-action-1.png", "top-action-2.png", "top-action-3.png", "top-action-4.png"],
  },
  {
    name: "冒险",
    tag: "前十名",
    images: ["top-adventure-1.png", "top-adventure-2.png", "top-adventure-3.png", "top-adventure-4.png"],
  },
  {
    name: "喜剧",
    tag: "前十名",
    images: ["top-comedy-1.png", "top-comedy-2.png", "top-comedy-3.png", "top-comedy-4.png"],
  },
  {
    name: "剧情",
    tag: "前十名",
    images: ["top-drama-1.png", "top-drama-2.png", "top-drama-3.png", "top-drama-4.png"],
  },
];

export const trendingShows: ShowCard[] = [
  { title: "怪奇物语", image: "show-trending-1.png", duration: "8小时20分", meta: "4季" },
  { title: "纸钞屋", image: "show-trending-2.png", duration: "12小时23分", meta: "5季" },
  { title: "路西法", image: "show-trending-3.png", duration: "14小时30分", meta: "3季" },
  { title: "灰影人", image: "show-trending-4.png", duration: "7小时40分", meta: "2季" },
];

export const newShows: ShowCard[] = [
  { title: "高城", image: "show-release-1.png", duration: "12小时23分", meta: "5季" },
  { title: "米尔扎布尔", image: "show-release-2.png", duration: "7小时40分", meta: "2季" },
  { title: "呼吸：暗影入侵", image: "show-release-3.png", duration: "8小时20分", meta: "4季" },
  { title: "浴血黑帮", image: "show-release-4.png", duration: "10小时30分", meta: "3季" },
];

export const mustWatchShows: ShowCard[] = [
  { title: "双面线索", image: "show-watch-1.png", duration: "7小时40分", meta: "1.2万", rating: "4.5" },
  { title: "纸钞屋", image: "show-watch-2.png", duration: "12小时23分", meta: "2.8万", rating: "5.0" },
  { title: "梦", image: "show-watch-3.png", duration: "10小时30分", meta: "2万", rating: "4.0" },
  { title: "怪奇物语", image: "show-watch-4.png", duration: "8小时20分", meta: "3.2万", rating: "4.5" },
];
