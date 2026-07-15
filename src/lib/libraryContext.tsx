import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LocalLibrary, PlaybackProgress } from "../types/library";
import {
  LIBRARY_STORAGE_KEY,
  addHistory,
  emptyLibrary,
  progressKey,
  readLibrary,
  saveProgress,
  toggleFavorite,
  writeLibrary,
} from "./localStorageLibrary";

type LibraryContextValue = {
  library: LocalLibrary;
  isFavorite: (titleId: number) => boolean;
  toggleFavorite: (titleId: number) => void;
  addHistory: (titleId: number, sid: number, nid: number) => void;
  getProgress: (titleId: number, sid: number, nid: number) => PlaybackProgress | undefined;
  saveProgress: (progress: PlaybackProgress) => void;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [library, setLibrary] = useState<LocalLibrary>(() => typeof window === "undefined" ? emptyLibrary() : readLibrary(window.localStorage));

  useEffect(() => {
    const sync = (event?: StorageEvent) => {
      if (!event || event.key === LIBRARY_STORAGE_KEY) setLibrary(readLibrary(window.localStorage));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("movie-night:library", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("movie-night:library", sync as EventListener);
    };
  }, []);

  const update = useCallback((updater: (current: LocalLibrary) => LocalLibrary) => {
    setLibrary((current) => {
      const next = updater(current);
      writeLibrary(window.localStorage, next);
      window.dispatchEvent(new Event("movie-night:library"));
      return next;
    });
  }, []);

  const value = useMemo<LibraryContextValue>(() => ({
    library,
    isFavorite: (titleId) => library.favorites.some((item) => item.titleId === titleId),
    toggleFavorite: (titleId) => update((current) => toggleFavorite(current, titleId)),
    addHistory: (titleId, sid, nid) => update((current) => addHistory(current, titleId, sid, nid)),
    getProgress: (titleId, sid, nid) => library.progress[progressKey(titleId, sid, nid)],
    saveProgress: (progress) => update((current) => saveProgress(current, progress)),
  }), [library, update]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary must be used inside LibraryProvider");
  return context;
}
