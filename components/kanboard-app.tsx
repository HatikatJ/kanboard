"use client";

import { useEffect, useMemo, useState } from "react";
import { columnMeta, initialMedia, navTabs, statusOrder } from "@/lib/mock-data";
import type { MediaItem, MediaType, StatusKey, TabKey } from "@/lib/types";

const STORAGE_KEY = "kanboard-items-v1";

const palette = ["#8b5cf6", "#ec4899", "#f59e0b", "#14b8a6", "#22c55e", "#3b82f6", "#f97316"];

const typeLabels: Record<MediaType, string> = {
  movie: "Film",
  serie: "Série",
  book: "Livre",
};

export function KanboardApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("movies");
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftStatus, setDraftStatus] = useState<StatusKey>("discover");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as MediaItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const activeDefinition = navTabs.find((tab) => tab.key === activeTab) ?? navTabs[0];
  const currentType = activeDefinition.type;

  const visibleItems = useMemo(
    () =>
      currentType
        ? items.filter((item) => item.type === currentType)
        : items,
    [currentType, items],
  );

  const stats = useMemo(() => {
    const total = items.length;
    const finished = items.filter((item) => item.status === "done").length;
    const inProgress = items.filter((item) => item.status === "progress").length;
    const avgRating =
      items
        .filter((item) => typeof item.note === "number")
        .reduce((sum, item) => sum + (item.note ?? 0), 0) /
        Math.max(
          items.filter((item) => typeof item.note === "number").length,
          1,
        );

    return {
      total,
      finished,
      inProgress,
      avgRating,
    };
  }, [items]);

  const matchingResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return [];
    }

    return items
      .filter((item) => item.type === currentType)
      .filter((item) => item.title.toLowerCase().includes(q))
      .slice(0, 4);
  }, [currentType, items, search]);

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const index = statusOrder.indexOf(item.status);
        const nextIndex = Math.min(
          statusOrder.length - 1,
          Math.max(0, index + direction),
        );

        return {
          ...item,
          status: statusOrder[nextIndex],
        };
      }),
    );
  };

  const handleRandomPick = () => {
    const discoverItems = visibleItems.filter((item) => item.status === "discover");

    if (discoverItems.length === 0) {
      return;
    }

    const picked = discoverItems[Math.floor(Math.random() * discoverItems.length)];

    setItems((previous) =>
      previous.map((item) => ({
        ...item,
        highlight: item.id === picked.id,
      })),
    );

    window.setTimeout(() => {
      setItems((previous) =>
        previous.map((item) => ({
          ...item,
          highlight: false,
        })),
      );
    }, 1800);
  };

  const addMedia = (titleOverride?: string, explicitStatus?: StatusKey) => {
    const finalTitle = (titleOverride ?? draftTitle ?? search).trim();
    if (!finalTitle) {
      return;
    }

    const itemType = currentType ?? "movie";
    const newItem: MediaItem = {
      id: `${itemType}-${Date.now()}`,
      type: itemType,
      title: finalTitle,
      subtitle: "Ajouté manuellement",
      status: explicitStatus ?? draftStatus,
      accent: palette[Math.floor(Math.random() * palette.length)],
      meta: itemType === "book" ? "À lire" : itemType === "serie" ? "Saison 1" : "À voir",
      ...(explicitStatus === "done" ? { note: 4 } : {}),
    };

    setItems((previous) => [newItem, ...previous]);
    setDraftTitle("");
    setSearch("");
    setDraftStatus("discover");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf2f8_0%,#f5f3ff_35%,#f8fafc_100%)] text-stone-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-28 pt-6 md:px-6 md:pb-10">
        <aside className="hidden w-64 shrink-0 rounded-[28px] border border-violet-100 bg-white/70 p-5 shadow-[0_20px_60px_rgba(79,70,229,0.08)] backdrop-blur-xl md:flex md:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-lg text-white shadow-lg shadow-violet-200">
              K
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-500">
                Kanboard
              </p>
              <h1 className="text-2xl font-black">Culture</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navTabs.map((tab) => {
              const isActive = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all",
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-200"
                      : "text-stone-600 hover:bg-violet-50 hover:text-violet-700",
                  ].join(" ")}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-4 text-white shadow-xl shadow-violet-200">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-100">Cible</p>
            <p className="mt-2 text-2xl font-black">12</p>
            <p className="text-sm text-violet-100">Médias à découvrir cette semaine</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-6 flex items-center justify-between gap-3 rounded-[28px] border border-violet-100 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl md:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-lg font-bold text-white shadow-lg shadow-violet-200 md:hidden">
                K
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">
                  {activeDefinition.emoji} {activeDefinition.label}
                </p>
                <h2 className="text-xl font-black tracking-tight text-stone-900 md:text-2xl">
                  {activeDefinition.key === "profile" ? "Mon dashboard" : "Mes médias"}
                </h2>
              </div>
            </div>

            {activeDefinition.key !== "profile" && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-stone-200 transition hover:scale-[1.02]"
              >
                <span className="text-lg leading-none">+</span>
                Ajouter
              </button>
            )}
          </header>

          {activeDefinition.key === "profile" ? (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] border border-violet-100 bg-white/80 p-5 shadow-lg">
                  <p className="text-sm text-stone-500">Total</p>
                  <p className="mt-2 text-3xl font-black text-violet-700">{stats.total}</p>
                  <p className="mt-1 text-sm text-stone-500">Médias dans la pile</p>
                </div>
                <div className="rounded-[28px] border border-emerald-100 bg-white/80 p-5 shadow-lg">
                  <p className="text-sm text-stone-500">Terminé</p>
                  <p className="mt-2 text-3xl font-black text-emerald-600">{stats.finished}</p>
                  <p className="mt-1 text-sm text-stone-500">Expériences conclues</p>
                </div>
                <div className="rounded-[28px] border border-amber-100 bg-white/80 p-5 shadow-lg">
                  <p className="text-sm text-stone-500">Moyenne</p>
                  <p className="mt-2 text-3xl font-black text-amber-600">{stats.avgRating.toFixed(1)}</p>
                  <p className="mt-1 text-sm text-stone-500">sur 5 pour les notes</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-violet-100 bg-white/80 p-5 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-500">Résumé</p>
                      <h3 className="text-xl font-black">Légende de la semaine</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Films", count: items.filter((item) => item.type === "movie").length, tone: "bg-violet-100 text-violet-700" },
                      { label: "Séries", count: items.filter((item) => item.type === "serie").length, tone: "bg-pink-100 text-pink-700" },
                      { label: "Livres", count: items.filter((item) => item.type === "book").length, tone: "bg-amber-100 text-amber-700" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl bg-stone-50 p-3">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex size-9 items-center justify-center rounded-xl ${item.tone}`}>
                            {item.label[0]}
                          </span>
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <span className="text-lg font-black">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-violet-100 bg-white/80 p-5 shadow-lg">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-500">Progression</p>
                  <h3 className="mt-2 text-xl font-black">Suivi rapide</h3>
                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-stone-600">En cours</span>
                        <span className="font-semibold">{stats.inProgress}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-stone-100">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                          style={{ width: `${Math.min((stats.inProgress / Math.max(stats.total, 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-stone-600">Terminés</span>
                        <span className="font-semibold">{stats.finished}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-stone-100">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${Math.min((stats.finished / Math.max(stats.total, 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-[30px] border border-violet-100 bg-white/75 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-500">Tableau</p>
                  <h3 className="text-xl font-black md:text-2xl">{typeLabels[currentType ?? "movie"]} à organiser</h3>
                </div>
                <button
                  type="button"
                  onClick={handleRandomPick}
                  className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  Pick for me
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible">
                {statusOrder.map((status) => {
                  const columnItems = visibleItems.filter((item) => item.status === status);
                  const meta = columnMeta[status];

                  return (
                    <div
                      key={status}
                      className="min-w-[280px] flex-1 rounded-[26px] border border-stone-200 bg-stone-50/80 p-3 md:min-w-0"
                    >
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{meta.title}</p>
                          <p className="text-sm text-stone-400">{meta.description}</p>
                        </div>
                        {status === "discover" && (
                          <button
                            type="button"
                            onClick={handleRandomPick}
                            className="rounded-full border border-violet-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-violet-700"
                          >
                            {meta.action}
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {columnItems.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-stone-200 bg-white/60 p-4 text-center text-sm text-stone-400">
                            Aucune proposition ici.
                          </div>
                        ) : (
                          columnItems.map((item) => (
                            <article
                              key={item.id}
                              className={[
                                "rounded-[22px] border bg-white p-3 shadow-sm transition",
                                item.highlight ? "border-violet-300 ring-2 ring-violet-200" : "border-stone-200",
                              ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex gap-2">
                                  <span
                                    className="mt-0.5 size-3 rounded-full"
                                    style={{ backgroundColor: item.accent }}
                                  />
                                  <div>
                                    <h4 className="font-bold text-stone-800">{item.title}</h4>
                                    <p className="text-xs text-stone-500">{item.subtitle}</p>
                                  </div>
                                </div>
                                {typeof item.note === "number" && (
                                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                                    {"⭐".repeat(Math.round(item.note))}
                                  </span>
                                )}
                              </div>

                              <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                                <span>{item.meta ?? typeLabels[item.type]}</span>
                                {item.progressLabel && (
                                  <span className="rounded-full bg-violet-100 px-2 py-1 font-medium text-violet-700">
                                    {item.progressLabel}
                                  </span>
                                )}
                              </div>

                              {item.status === "done" && typeof item.note === "number" && (
                                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                                  <span className="text-stone-500">Note</span>
                                  <span className="font-bold text-stone-800">{item.note.toFixed(1)}/5</span>
                                </div>
                              )}

                              <div className="mt-3 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveItem(item.id, -1)}
                                  disabled={item.status === "discover"}
                                  className="rounded-full border border-stone-200 px-2 py-1 text-[11px] font-medium text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  ←
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveItem(item.id, 1)}
                                  disabled={item.status === "done"}
                                  className="rounded-full border border-stone-200 px-2 py-1 text-[11px] font-medium text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  →
                                </button>
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-[24px] border border-violet-200 bg-white/85 p-2 shadow-[0_20px_50px_rgba(79,70,229,0.15)] backdrop-blur-xl md:hidden">
        {navTabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
                isActive ? "bg-violet-600 text-white" : "text-stone-500",
              ].join(" ")}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/40 p-4 backdrop-blur-sm">
          <div className="mx-auto mt-16 max-w-lg rounded-[30px] border border-violet-100 bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-500">Ajouter un média</p>
                <h3 className="text-xl font-black">{typeLabels[currentType ?? "movie"]}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-stone-100 px-2.5 py-1.5 text-sm font-medium text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <label className="block rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Recherche
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Titre, réalisateur, auteur…"
                  className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />
              </label>

              {matchingResults.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-2">
                  {matchingResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => addMedia(result.title, result.status)}
                      className="flex w-full items-center justify-between rounded-xl bg-white p-2 text-left text-sm shadow-sm"
                    >
                      <span className="font-medium text-stone-700">{result.title}</span>
                      <span className="text-xs text-stone-500">{columnMeta[result.status].title}</span>
                    </button>
                  ))}
                </div>
              )}

              <label className="block rounded-2xl border border-stone-200 bg-stone-50 p-3">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Ajout manuel
                </span>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Saisir un titre manuellement"
                  className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />
              </label>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Colonne de destination
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {statusOrder.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setDraftStatus(status)}
                      className={[
                        "rounded-xl border px-2 py-2 text-xs font-semibold transition",
                        draftStatus === status
                          ? "border-violet-400 bg-violet-50 text-violet-700"
                          : "border-stone-200 bg-stone-50 text-stone-600",
                      ].join(" ")}
                    >
                      {columnMeta[status].title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => addMedia()}
                  className="flex-1 rounded-full bg-stone-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  + {columnMeta[draftStatus].title}
                </button>
                <button
                  type="button"
                  onClick={() => addMedia(search || draftTitle || "Nouveau média", draftStatus)}
                  className="flex-1 rounded-full border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700"
                >
                  Ajouter direct
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
