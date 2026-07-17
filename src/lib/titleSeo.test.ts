import { describe, expect, it } from "vitest";
import type { TitleDetail } from "../types/title";
import { titleFactSummary, titleSeoHeading, titleSeoTitle } from "./titleSeo";

const title: TitleDetail = {
  id: 1,
  title: "测试电影",
  category: "电影",
  score: 8.2,
  year: 2026,
  area: "中国大陆",
  genre: "剧情/悬疑",
  status_text: "高清",
  cover_url: "",
  actors: "演员甲/演员乙",
  director: "导演甲",
  detail_url: "",
  play_url: "",
  description: "",
};

describe("title SEO helpers", () => {
  it("places the title and viewing intent in the title and heading", () => {
    expect(titleSeoTitle(title)).toBe("测试电影 (2026) 在线观看 | Movie Night");
    expect(titleSeoHeading(title)).toBe("测试电影 在线观看");
  });

  it("builds a factual summary when editorial copy is unavailable", () => {
    expect(titleFactSummary(title)).toContain("《测试电影》（2026年 · 中国大陆 · 剧情/悬疑 · 电影）在线播放");
    expect(titleFactSummary(title)).toContain("导演：导演甲");
    expect(titleFactSummary(title)).toContain("主演：演员甲、演员乙");
  });
});
