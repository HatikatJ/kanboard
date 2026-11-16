import type { MediaLibrary } from "./types";

export const initialLibrary: MediaLibrary = {
  films: [
    { id: "film-1", title: "Past Lives", detail: "Céline Song", year: "2023", status: "completed", progress: 1, goal: 1, rating: 5, review: "Une délicatesse qui reste longtemps.", color: "from-rose-950 to-orange-900", emoji: "🌆" },
    { id: "film-2", title: "Perfect Days", detail: "Wim Wenders", year: "2023", status: "discover", progress: 0, goal: 1, rating: 0, review: "", color: "from-emerald-950 to-teal-900", emoji: "🌿" },
    { id: "film-3", title: "La La Land", detail: "Damien Chazelle", year: "2016", status: "ongoing", progress: 0.6, goal: 1, rating: 0, review: "", color: "from-indigo-950 to-fuchsia-900", emoji: "🎹" },
    { id: "film-4", title: "Anatomie d’une chute", detail: "Justine Triet", year: "2023", status: "discover", progress: 0, goal: 1, rating: 0, review: "", color: "from-slate-700 to-stone-900", emoji: "❄️" },
  ],
  series: [
    { id: "series-1", title: "The Bear", detail: "Saison 3 · FX", year: "2024", status: "ongoing", progress: 4, goal: 10, rating: 0, review: "", color: "from-orange-950 to-amber-800", emoji: "🍽️" },
    { id: "series-2", title: "Severance", detail: "Saison 1 · Apple TV+", year: "2022", status: "completed", progress: 9, goal: 9, rating: 5, review: "Vertigineuse, du début à la fin.", color: "from-blue-950 to-cyan-900", emoji: "🪟" },
    { id: "series-3", title: "Succession", detail: "Saison 2 · HBO", year: "2019", status: "discover", progress: 0, goal: 10, rating: 0, review: "", color: "from-neutral-700 to-zinc-950", emoji: "🏙️" },
  ],
  books: [
    { id: "book-1", title: "Les villes de papier", detail: "John Green · Roman", year: "2008", status: "ongoing", progress: 128, goal: 305, rating: 0, review: "", color: "from-sky-950 to-indigo-900", emoji: "📘" },
    { id: "book-2", title: "Une brève histoire du temps", detail: "Stephen Hawking · Essai", year: "1988", status: "discover", progress: 0, goal: 256, rating: 0, review: "", color: "from-violet-950 to-purple-900", emoji: "🪐" },
    { id: "book-3", title: "La vie mode d’emploi", detail: "Georges Perec · Roman", year: "1978", status: "completed", progress: 1, goal: 1, rating: 4, review: "Un puzzle littéraire fascinant.", color: "from-amber-950 to-yellow-900", emoji: "🗝️" },
  ],
};
