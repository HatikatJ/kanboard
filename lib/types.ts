export type MediaKind = "films" | "series" | "books";
export type MediaStatus = "discover" | "ongoing" | "completed";
export type MediaFilter = MediaStatus | "all";

export type MediaItem = {
  id: string;
  title: string;
  detail: string;
  year: string;
  status: MediaStatus;
  progress: number;
  goal: number;
  rating: number;
  review: string;
  color: string;
  emoji: string;
};

export type MediaLibrary = Record<MediaKind, MediaItem[]>;
