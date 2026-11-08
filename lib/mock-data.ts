import type { MediaItem, TabDefinition } from "@/lib/types";

export const navTabs: TabDefinition[] = [
  { key: "movies", label: "Films", emoji: "🎥", type: "movie" },
  { key: "series", label: "Séries", emoji: "📺", type: "serie" },
  { key: "books", label: "Livres", emoji: "📚", type: "book" },
  { key: "profile", label: "Moi", emoji: "👤", type: null },
];

export const columnMeta = {
  discover: {
    title: "À découvrir",
    description: "À programmer ou tester",
    action: "Pick for me",
  },
  progress: {
    title: "En cours",
    description: "Suivi du rythme",
    action: "Suivi",
  },
  done: {
    title: "Terminé",
    description: "Historique et notes",
    action: "Historique",
  },
} as const;

export const statusOrder = ["discover", "progress", "done"] as const;

export const initialMedia: MediaItem[] = [
  {
    id: "m1",
    type: "movie",
    title: "Dune: Part Two",
    subtitle: "Science-fiction / épique",
    status: "discover",
    accent: "#8b5cf6",
    meta: "2h 46m",
    rating: 4.5,
  },
  {
    id: "m2",
    type: "movie",
    title: "The Batman",
    subtitle: "Polar / thriller",
    status: "progress",
    accent: "#f59e0b",
    progressLabel: "43% vu",
    meta: "1h 56m",
  },
  {
    id: "m3",
    type: "movie",
    title: "Spider-Man: Across the Spider-Verse",
    subtitle: "Animation / aventure",
    status: "done",
    accent: "#14b8a6",
    note: 5,
    meta: "Fin le 12 mars",
  },
  {
    id: "s1",
    type: "serie",
    title: "Severance",
    subtitle: "Série / mystère",
    status: "discover",
    accent: "#ec4899",
    meta: "Épisode 2/8",
  },
  {
    id: "s2",
    type: "serie",
    title: "The Last of Us",
    subtitle: "Post-apocalypse",
    status: "progress",
    accent: "#22c55e",
    progressLabel: "3 épisodes restants",
    meta: "Saison 1",
  },
  {
    id: "s3",
    type: "serie",
    title: "Loki",
    subtitle: "Fantastique / Marvel",
    status: "done",
    accent: "#3b82f6",
    note: 4,
    meta: "Terminé le 21 janv.",
  },
  {
    id: "b1",
    type: "book",
    title: "The Midnight Library",
    subtitle: "Roman / introspection",
    status: "discover",
    accent: "#f97316",
    meta: "320 pages",
  },
  {
    id: "b2",
    type: "book",
    title: "Atomic Habits",
    subtitle: "Développement personnel",
    status: "progress",
    accent: "#10b981",
    progressLabel: "118 pages lues",
    meta: "342 pages",
  },
  {
    id: "b3",
    type: "book",
    title: "Project Hail Mary",
    subtitle: "Science-fiction / aventure",
    status: "done",
    accent: "#a855f7",
    note: 5,
    meta: "Terminé le 04 avr.",
  },
];
