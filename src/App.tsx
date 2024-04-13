import { Route, Routes } from "react-router-dom";
import { publicRoute } from "./routes";
import { Suspense } from "react";
import Loading from "./components/Loading";

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {publicRoute.map((route, index) => {
          const Page = route.component;
          return (
            <Route key={index} path={route.path} element={<Page />}></Route>
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default App;
