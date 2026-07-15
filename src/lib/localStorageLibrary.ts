import type { LocalLibrary, PlaybackProgress } from "../types/library";

export const LIBRARY_STORAGE_KEY = "movie-night:library:v1";

export const emptyLibrary = (): LocalLibrary => ({ version: 1, favorites: [], history: [], progress: {} });

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readLibrary(storage: StorageAdapter): LocalLibrary {
  try {
    const raw = storage.getItem(LIBRARY_STORAGE_KEY);
    if (!raw) return emptyLibrary();
    const value = JSON.parse(raw) as Partial<LocalLibrary>;
    if (value.version !== 1 || !Array.isArray(value.favorites) || !Array.isArray(value.history) || !isRecord(value.progress)) {
      return emptyLibrary();
    }
    return {
      version: 1,
      favorites: value.favorites.filter((item) => Number.isSafeInteger(item?.titleId) && typeof item?.createdAt === "string"),
      history: value.history.filter((item) => Number.isSafeInteger(item?.titleId) && typeof item?.watchedAt === "string").slice(0, 100),
      progress: value.progress as Record<string, PlaybackProgress>,
    };
  } catch {
    return emptyLibrary();
  }
}

export function writeLibrary(storage: StorageAdapter, library: LocalLibrary) {
  storage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
}

export function toggleFavorite(library: LocalLibrary, titleId: number, now = new Date()): LocalLibrary {
  const exists = library.favorites.some((item) => item.titleId === titleId);
  return {
    ...library,
    favorites: exists
      ? library.favorites.filter((item) => item.titleId !== titleId)
      : [{ titleId, createdAt: now.toISOString() }, ...library.favorites],
  };
}

export function addHistory(library: LocalLibrary, titleId: number, sid: number, nid: number, now = new Date()): LocalLibrary {
  return {
    ...library,
    history: [
      { titleId, sid, nid, watchedAt: now.toISOString() },
      ...library.history.filter((item) => item.titleId !== titleId || item.sid !== sid || item.nid !== nid),
    ].slice(0, 100),
  };
}

export function progressKey(titleId: number, sid: number, nid: number) {
  return `${titleId}:${sid}:${nid}`;
}

export function saveProgress(library: LocalLibrary, progress: PlaybackProgress): LocalLibrary {
  const key = progressKey(progress.titleId, progress.sid, progress.nid);
  if (progress.duration > 0 && progress.currentTime / progress.duration >= 0.95) {
    const next = { ...library.progress };
    delete next[key];
    return { ...library, progress: next };
  }
  return { ...library, progress: { ...library.progress, [key]: progress } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
