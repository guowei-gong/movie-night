import { ArrowPathIcon, ExclamationTriangleIcon, FilmIcon } from "@heroicons/react/24/outline";

export function LoadingState({ label = "正在加载片库" }: { label?: string }) {
  return (
    <main className="state-page" aria-live="polite">
      <ArrowPathIcon className="state-icon spinning" />
      <h1>{label}</h1>
    </main>
  );
}

export function ErrorState({ message = "片库暂时无法加载，请稍后重试。" }: { message?: string }) {
  return (
    <main className="state-page" role="alert">
      <ExclamationTriangleIcon className="state-icon" />
      <h1>加载失败</h1>
      <p>{message}</p>
    </main>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state">
      <FilmIcon className="state-icon" />
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
