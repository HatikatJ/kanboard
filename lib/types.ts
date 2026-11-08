export type TabKey = "movies" | "series" | "books" | "profile";
export type MediaType = "movie" | "serie" | "book";
export type StatusKey = "discover" | "progress" | "done";

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  status: StatusKey;
  rating?: number;
  note?: number;
  progressLabel?: string;
  meta?: string;
  accent: string;
  highlight?: boolean;
}

export interface TabDefinition {
  key: TabKey;
  label: string;
  emoji: string;
  type: MediaType | null;
}
