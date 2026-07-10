import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MoviesPage } from "./pages/MoviesPage";

export function App() {
  const isDetailPage = window.location.pathname.startsWith("/movie/kantara");

  document.title = isDetailPage ? "StreamVibe - 坎塔拉电影详情" : "Movier - 电影与剧集";

  return (
    <>
      {isDetailPage && <Header />}
      {isDetailPage ? <MovieDetailPage /> : <MoviesPage />}
      {isDetailPage && <Footer />}
    </>
  );
}
