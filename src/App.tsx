import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingState } from "./components/AsyncState";
import { Header } from "./components/Header";
import { LibraryPage } from "./pages/LibraryPage";
import { MoviesPage } from "./pages/MoviesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchPage } from "./pages/SearchPage";
import { TitleDetailPage } from "./pages/TitleDetailPage";

const PlayPage = lazy(() => import("./pages/PlayPage").then((module) => ({ default: module.PlayPage })));

export function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingState label="正在加载页面" />}>
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/movies" element={<Navigate to="/" replace />} />
          <Route path="/title/:id" element={<TitleDetailPage />} />
          <Route path="/play/:id" element={<PlayPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<LibraryPage mode="favorites" />} />
          <Route path="/history" element={<LibraryPage mode="history" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
