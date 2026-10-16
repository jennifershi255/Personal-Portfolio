import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Journey from "./Journey";

const TravelPage = lazy(() => import("./TravelPage"));

function RestoreHomeScroll() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    document.body.style.cursor = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    if (pathname !== "/") return;
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div>
      <RestoreHomeScroll />
      <Routes>
        <Route path="/" element={<Journey />} />
        <Route
          path="/travel"
          element={
            <Suspense fallback={null}>
              <TravelPage />
            </Suspense>
          }
        />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
