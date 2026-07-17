import { describe, expect, it } from "vitest";
import { categoryNameForSlug, categoryPath } from "./categories";

describe("SEO category routes", () => {
  it("maps clean category slugs to catalog names", () => {
    expect(categoryNameForSlug("movie")).toBe("电影");
    expect(categoryNameForSlug("series")).toBe("剧集");
    expect(categoryNameForSlug("missing")).toBe("");
  });

  it("builds stable category paths", () => {
    expect(categoryPath("anime")).toBe("/category/anime");
  });
});
