export interface FavoriteItem {
  titleId: number;
  createdAt: string;
}

export interface HistoryItem {
  titleId: number;
  sid: number;
  nid: number;
  watchedAt: string;
}

export interface PlaybackProgress {
  titleId: number;
  sid: number;
  nid: number;
  currentTime: number;
  duration: number;
  updatedAt: string;
}

export interface LocalLibrary {
  version: 1;
  favorites: FavoriteItem[];
  history: HistoryItem[];
  progress: Record<string, PlaybackProgress>;
}
