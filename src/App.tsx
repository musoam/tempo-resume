import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import AnimationProvider from "./components/AnimationProvider";

const AdminPanel = lazy(() => import("./components/AdminPanel"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AnimationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </AnimationProvider>
    </Suspense>
  );
}

export default App;
