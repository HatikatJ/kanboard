"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNav, type AppTab } from "@/components/bottom-nav";
import { MediaCard } from "@/components/media-card";
import { MediaForm } from "@/components/media-form";
import { initialLibrary } from "@/lib/initial-data";
import type { MediaFilter, MediaItem, MediaKind, MediaLibrary, MediaStatus } from "@/lib/types";

const mediaTabs: Record<MediaKind, { title: string; eyebrow: string; singular: string }> = {
  films: { title: "Films", eyebrow: "LE GRAND ÉCRAN, À VOTRE RYTHME", singular: "film" },
  series: { title: "Séries", eyebrow: "ENCORE UN ÉPISODE… OU PAS", singular: "série" },
  books: { title: "Livres", eyebrow: "DES HISTOIRES À EMPORTER", singular: "livre" },
};

const filters: { id: MediaFilter; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "discover", label: "À découvrir" },
  { id: "ongoing", label: "En cours" },
  { id: "completed", label: "Terminé" },
];

const filterStatus: MediaStatus[] = ["discover", "ongoing", "completed"];

export default function Home() {
  const [library, setLibrary] = useState<MediaLibrary>(initialLibrary);
  const [activeTab, setActiveTab] = useState<AppTab>("films");
  const [activeFilters, setActiveFilters] = useState<Record<MediaKind, MediaFilter>>({ films: "all", series: "all", books: "all" });
  const [searches, setSearches] = useState<Record<MediaKind, string>>({ films: "", series: "", books: "" });
  const [editingItem, setEditingItem] = useState<MediaItem | null | undefined>(undefined);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("kanboard-library-v1");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isMediaLibrary(parsed)) setLibrary(parsed);
      }
    } catch (error) {
      console.error("Impossible de charger la collection sauvegardée.", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem("kanboard-library-v1", JSON.stringify(library));
    } catch (error) {
      console.error("Impossible d’enregistrer la collection.", error);
    }
  }, [library, storageReady]);

  const kind = activeTab === "stats" ? null : activeTab;
  const visibleItems = useMemo(() => {
    if (!kind) return [];
    const query = searches[kind].trim().toLocaleLowerCase("fr");
    return library[kind].filter((item) => {
      const matchesStatus = activeFilters[kind] === "all" || item.status === activeFilters[kind];
      const matchesSearch = !query || `${item.title} ${item.detail} ${item.year}`.toLocaleLowerCase("fr").includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [activeFilters, kind, library, searches]);

  function saveItem(item: MediaItem) {
    if (!kind) return;
    setLibrary((current) => {
      const exists = current[kind].some((entry) => entry.id === item.id);
      const next = exists
        ? current[kind].map((entry) => entry.id === item.id ? item : entry)
        : [item, ...current[kind]];
      return { ...current, [kind]: next };
    });
    setEditingItem(undefined);
  }

  function incrementEpisode(item: MediaItem) {
    if (!kind) return;
    setLibrary((current) => ({
      ...current,
      [kind]: current[kind].map((entry) => {
        if (entry.id !== item.id) return entry;
        const progress = Math.min(entry.goal, entry.progress + 1);
        return { ...entry, progress, status: progress >= entry.goal ? "completed" : "ongoing" };
      }),
    }));
  }

  if (editingItem !== undefined && kind) {
    return <MediaForm kind={kind} item={editingItem ?? undefined} onClose={() => setEditingItem(undefined)} onSave={saveItem} />;
  }

  return (
    <main className="app-shell">
      <header className="top-header">
        <a aria-label="Kanboard, accueil" className="brand" href="#">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>kanboard<span className="brand-period">.</span></span>
        </a>
        <button aria-label="Votre profil" className="avatar" type="button">M</button>
      </header>
      {kind ? (
        <>
          <section className="page-heading">
            <div className="page-eyebrow">{mediaTabs[kind].eyebrow}</div>
            <div className="heading-row">
              <div><h1>{mediaTabs[kind].title}<span className="heading-period">.</span></h1><p className="library-count">{library[kind].length} {library[kind].length > 1 ? "œuvres" : "œuvre"} dans votre collection</p></div>
              <button aria-label={`Ajouter un ${mediaTabs[kind].singular}`} className="add-button" onClick={() => setEditingItem(null)} type="button"><span>+</span><span className="add-label">Ajouter</span></button>
            </div>
          </section>
          <section aria-label={`Filtres ${mediaTabs[kind].title}`} className="filter-scroll">
            {filters.map(({ id, label }) => {
              const count = id === "all" ? library[kind].length : library[kind].filter((item) => item.status === id).length;
              return (
                <button aria-pressed={activeFilters[kind] === id} className={`filter-chip ${activeFilters[kind] === id ? "filter-chip-active" : ""}`} key={id} onClick={() => setActiveFilters((current) => ({ ...current, [kind]: id }))} type="button">
                  {label}<span className="filter-count">{count}</span>
                </button>
              );
            })}
          </section>
          <section className="library-section">
            <label className="search-field">
              <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>
              <input aria-label={`Rechercher dans ${mediaTabs[kind].title}`} onChange={(event) => setSearches((current) => ({ ...current, [kind]: event.target.value }))} placeholder={`Rechercher un ${mediaTabs[kind].singular}…`} value={searches[kind]} />
              <span className="shortcut-hint">⌘ K</span>
            </label>
            <div className="list-heading"><span>{activeFilters[kind] === "all" ? "VOTRE SÉLECTION" : filters.find((filter) => filter.id === activeFilters[kind])?.label.toUpperCase()}</span><span>{visibleItems.length} RÉSULTATS</span></div>
            <div className="media-list">
              {visibleItems.map((item) => (
                <MediaCard item={item} key={item.id} kind={kind} onEdit={() => setEditingItem(item)} onIncrement={() => incrementEpisode(item)} />
              ))}
              {visibleItems.length === 0 && (
                <div className="empty-state"><span className="empty-icon">✳</span><h2>Rien par ici, pour l’instant.</h2><p>Essayez un autre filtre ou ajoutez votre prochaine découverte.</p><button className="text-button" onClick={() => setEditingItem(null)} type="button">Ajouter un {mediaTabs[kind].singular} <span>→</span></button></div>
              )}
            </div>
          </section>
        </>
      ) : (
        <StatsPage library={library} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}

function isMediaLibrary(value: unknown): value is MediaLibrary {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return ["films", "series", "books"].every((key) => Array.isArray(candidate[key]));
}

function StatsPage({ library }: { library: MediaLibrary }) {
  const totals = Object.values(library).flat();
  const completed = totals.filter((item) => item.status === "completed").length;
  const ongoing = totals.filter((item) => item.status === "ongoing").length;
  const discovered = totals.filter((item) => item.status === "discover").length;
  const average = totals.filter((item) => item.rating > 0);
  const averageRating = average.length ? (average.reduce((sum, item) => sum + item.rating, 0) / average.length).toFixed(1) : "—";

  return (
    <section className="stats-page">
      <div className="page-eyebrow">VOTRE ANNÉE CULTURELLE</div>
      <div className="stats-heading"><h1>En un coup d’œil<span className="heading-period">.</span></h1><p>Votre curiosité, racontée en quelques chiffres.</p></div>
      <div className="stats-feature"><div className="stats-feature-copy"><span>VOTRE COLLECTION</span><strong>{totals.length}</strong><p>histoires à découvrir, vivre et partager.</p></div><div aria-hidden="true" className="stats-art">✳</div></div>
      <div className="stats-grid">
        <StatCard label="Terminés" value={completed} icon="✓" color="green" />
        <StatCard label="En cours" value={ongoing} icon="↗" color="orange" />
        <StatCard label="À découvrir" value={discovered} icon="✳" color="purple" />
        <StatCard label="Note moyenne" value={averageRating} icon="★" color="yellow" />
      </div>
      <div className="breakdown-card">
        <div className="list-heading"><span>PAR UNIVERS</span><span>{totals.length} AU TOTAL</span></div>
        {(["films", "series", "books"] as MediaKind[]).map((kind) => (
          <div className="breakdown-row" key={kind}><span className={`breakdown-icon ${kind}`}>{kind === "films" ? "▣" : kind === "series" ? "▤" : "▥"}</span><span>{mediaTabs[kind].title}</span><strong>{library[kind].length}</strong></div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return <div className="stat-card"><span className={`stat-icon ${color}`}>{icon}</span><strong>{value}</strong><span>{label}</span></div>;
}
