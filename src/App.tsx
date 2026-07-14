import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MoviesPage } from "./pages/MoviesPage";
import { ShowDetailPage } from "./pages/ShowDetailPage";

export function App() {
  const pathname = window.location.pathname;
  const isMovieDetailPage = pathname.startsWith("/movie/kantara");
  const isShowDetailPage = pathname.startsWith("/shows");

  document.title = isShowDetailPage
    ? "StreamVibe - 怪奇物语"
    : isMovieDetailPage
      ? "StreamVibe - 坎塔拉"
      : "Movier - 电影与剧集";

  return (
    <>
      <Header />
      {isShowDetailPage ? <ShowDetailPage /> : isMovieDetailPage ? <MovieDetailPage /> : <MoviesPage />}
      {isMovieDetailPage && <Footer />}
    </>
  );
}
