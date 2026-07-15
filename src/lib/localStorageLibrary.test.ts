import { describe, expect, it } from "vitest";
import {
  LIBRARY_STORAGE_KEY,
  addHistory,
  emptyLibrary,
  progressKey,
  readLibrary,
  saveProgress,
  toggleFavorite,
  writeLibrary,
  type StorageAdapter,
} from "./localStorageLibrary";

class MemoryStorage implements StorageAdapter {
  private data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

describe("local library", () => {
  it("recovers from malformed JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(LIBRARY_STORAGE_KEY, "not-json");
    expect(readLibrary(storage)).toEqual(emptyLibrary());
  });

  it("persists and restores a versioned library", () => {
    const storage = new MemoryStorage();
    const library = toggleFavorite(emptyLibrary(), 12, new Date("2026-07-15T00:00:00Z"));
    writeLibrary(storage, library);
    expect(readLibrary(storage)).toEqual(library);
  });

  it("toggles favorites without duplicates", () => {
    const favorite = toggleFavorite(emptyLibrary(), 12);
    expect(favorite.favorites.map((item) => item.titleId)).toEqual([12]);
    expect(toggleFavorite(favorite, 12).favorites).toEqual([]);
  });

  it("keeps the newest one hundred unique history records", () => {
    let library = emptyLibrary();
    for (let id = 1; id <= 101; id += 1) library = addHistory(library, id, 1, 1);
    expect(library.history).toHaveLength(100);
    expect(library.history[0].titleId).toBe(101);
    expect(library.history.some((item) => item.titleId === 1)).toBe(false);
  });

  it("clears progress after ninety-five percent completion", () => {
    const initial = saveProgress(emptyLibrary(), {
      titleId: 12, sid: 1, nid: 2, currentTime: 10, duration: 100, updatedAt: "now",
    });
    expect(initial.progress[progressKey(12, 1, 2)]).toBeDefined();
    const completed = saveProgress(initial, {
      titleId: 12, sid: 1, nid: 2, currentTime: 95, duration: 100, updatedAt: "later",
    });
    expect(completed.progress[progressKey(12, 1, 2)]).toBeUndefined();
  });
});
