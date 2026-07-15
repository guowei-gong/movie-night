import { useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { useTitleData } from "../hooks/useCatalogData";
import { MovieDetailPage } from "./MovieDetailPage";
import { NotFoundPage } from "./NotFoundPage";
import { ShowDetailPage } from "./ShowDetailPage";

const episodicCategories = new Set(["剧集", "动漫", "综艺"]);

export function TitleDetailPage() {
  const { id } = useParams();
  const { data: title, loading, error } = useTitleData(id);

  if (loading) return <LoadingState label="正在加载详情" />;
  if (error) return <ErrorState message={error.message} />;
  if (!title) return <NotFoundPage />;

  return episodicCategories.has(title.category)
    ? <ShowDetailPage title={title} />
    : <MovieDetailPage title={title} />;
}
