"use client";

import { useState, type FormEvent } from "react";
import type { MediaItem, MediaKind, MediaStatus } from "@/lib/types";

const labels: Record<MediaKind, { singular: string; progress: string }> = {
  films: { singular: "film", progress: "Visionnage" },
  series: { singular: "série", progress: "Épisodes" },
  books: { singular: "livre", progress: "Pages" },
};

export function MediaForm({
  kind,
  item,
  onClose,
  onSave,
}: {
  kind: MediaKind;
  item?: MediaItem;
  onClose: () => void;
  onSave: (item: MediaItem) => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [detail, setDetail] = useState(item?.detail ?? "");
  const [year, setYear] = useState(item?.year ?? "");
  const [status, setStatus] = useState<MediaStatus>(item?.status ?? "discover");
  const [progress, setProgress] = useState(String(item?.progress ?? 0));
  const [goal, setGoal] = useState(String(item?.goal ?? (kind === "films" ? 1 : "")));
  const [rating, setRating] = useState(String(item?.rating ?? 0));
  const [review, setReview] = useState(item?.review ?? "");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedGoal = Number(goal);
    if (!title.trim()) {
      setError("Ajoutez un titre pour continuer.");
      return;
    }
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setError(kind === "films" ? "La durée doit être supérieure à zéro." : "Indiquez un nombre total supérieur à zéro.");
      return;
    }
    onSave({
      id: item?.id ?? `${kind}-${crypto.randomUUID()}`,
      title: title.trim(),
      detail: detail.trim() || (kind === "films" ? "Film" : kind === "series" ? "Série" : "Livre"),
      year: year.trim() || "2026",
      status,
      progress: status === "completed" ? parsedGoal : Math.max(0, Math.min(Number(progress) || 0, parsedGoal)),
      goal: parsedGoal,
      rating: status === "completed" ? Number(rating) : 0,
      review: status === "completed" ? review.trim() : "",
      color: item?.color ?? "from-violet-950 to-indigo-900",
      emoji: item?.emoji ?? (kind === "films" ? "🎬" : kind === "series" ? "📺" : "📚"),
    });
  }

  return (
    <main className="form-page">
      <header className="form-header">
        <button className="back-button" onClick={onClose} type="button">← <span>Retour</span></button>
        <span className="form-heading">{item ? "Modifier" : "Ajouter"} un {labels[kind].singular}</span>
        <button aria-label="Fermer le formulaire" className="close-button" onClick={onClose} type="button">✕</button>
      </header>
      <form className="form-body" onSubmit={submit}>
        <div className="form-intro">
          <span className="eyebrow">{item ? "VOTRE COLLECTION" : "NOUVELLE ENTRÉE"}</span>
          <h1>{item ? "Un petit changement ?" : "On ajoute quoi ?"}</h1>
          <p>Gardez votre univers culturel organisé, à votre façon.</p>
        </div>
        <label className="field-label">Titre <span>*</span>
          <input autoFocus placeholder={kind === "films" ? "Ex. Le Voyage de Chihiro" : kind === "series" ? "Ex. The Last of Us" : "Ex. L’élégance du hérisson"} value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <div className="form-row">
          <label className="field-label">Auteur / réalisateur
            <input placeholder="Ex. Hayao Miyazaki" value={detail} onChange={(event) => setDetail(event.target.value)} />
          </label>
          <label className="field-label">Année
            <input inputMode="numeric" placeholder="2024" value={year} onChange={(event) => setYear(event.target.value)} />
          </label>
        </div>
        <fieldset className="status-fieldset">
          <legend className="field-label">Où en êtes-vous ?</legend>
          <div className="status-options">
            {(["discover", "ongoing", "completed"] as MediaStatus[]).map((value) => (
              <button aria-pressed={status === value} className={`status-option ${status === value ? "status-option-selected" : ""}`} key={value} onClick={() => setStatus(value)} type="button">
                {value === "discover" ? "À découvrir" : value === "ongoing" ? "En cours" : "Terminé"}
              </button>
            ))}
          </div>
        </fieldset>
        {status !== "discover" && (
          <div className="form-row">
            {status === "ongoing" && (
              <label className="field-label">{labels[kind].progress} actuelle
                <input inputMode="numeric" min="0" type="number" value={progress} onChange={(event) => setProgress(event.target.value)} />
              </label>
            )}
            <label className="field-label">{kind === "films" ? "Durée (en minutes)" : `${labels[kind].progress} au total`}
              <input inputMode="numeric" min="1" type="number" value={goal} onChange={(event) => setGoal(event.target.value)} />
            </label>
          </div>
        )}
        {status === "completed" && (
          <>
            <label className="field-label">Votre note
              <select value={rating} onChange={(event) => setRating(event.target.value)}>
                <option value="0">Pas encore noté</option>
                <option value="1">★☆☆☆☆ — 1/5</option>
                <option value="2">★★☆☆☆ — 2/5</option>
                <option value="3">★★★☆☆ — 3/5</option>
                <option value="4">★★★★☆ — 4/5</option>
                <option value="5">★★★★★ — 5/5</option>
              </select>
            </label>
            <label className="field-label">Votre avis
              <textarea placeholder="Un mot, une impression, un souvenir…" rows={3} value={review} onChange={(event) => setReview(event.target.value)} />
            </label>
          </>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="save-button" type="submit">{item ? "Enregistrer les changements" : "Ajouter à ma collection"} <span>→</span></button>
      </form>
    </main>
  );
}
