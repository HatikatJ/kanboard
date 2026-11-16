"use client";

import type { MediaItem, MediaKind } from "@/lib/types";

const statusLabels = {
  discover: "À découvrir",
  ongoing: "En cours",
  completed: "Terminé",
};

export function MediaCard({
  item,
  kind,
  onEdit,
  onIncrement,
}: {
  item: MediaItem;
  kind: MediaKind;
  onEdit: () => void;
  onIncrement: () => void;
}) {
  const progress = item.goal > 0 ? Math.min(100, Math.round((item.progress / item.goal) * 100)) : 0;
  const unit = kind === "series" ? "épisodes" : "pages";

  return (
    <article className="media-card">
      <button aria-label={`Modifier ${item.title}`} className={`poster bg-gradient-to-br ${item.color}`} onClick={onEdit} type="button">
        <span aria-hidden="true" className="poster-emoji">{item.emoji}</span>
        <span className="poster-title">{item.title}</span>
      </button>
      <div className="card-content">
        <button className="card-title" onClick={onEdit} type="button">{item.title}</button>
        <p className="card-subtitle">{item.detail} <span className="meta-dot">·</span> {item.year}</p>
        {item.status === "ongoing" && (
          <div className="progress-block">
            <div className="progress-label">
              <span>{kind === "films" ? "Visionnage en cours" : `${item.progress} / ${item.goal} ${unit}`}</span>
              <span>{progress}%</span>
            </div>
            <div aria-label={`${progress}% terminé`} className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            {kind === "series" && (
              <button className="increment-button" onClick={onIncrement} type="button">+1 épisode</button>
            )}
          </div>
        )}
        {item.status === "completed" && (
          <div className="review-block">
            <div aria-label={`${item.rating} sur 5 étoiles`} className="stars">{Array.from({ length: 5 }, (_, index) => <span key={index} className={index < item.rating ? "star-filled" : ""}>★</span>)}</div>
            {item.review && <p className="review-text">« {item.review} »</p>}
          </div>
        )}
        {item.status === "discover" && (
          <span className="status-label"><span className="status-dot" />{statusLabels[item.status]}</span>
        )}
      </div>
    </article>
  );
}
