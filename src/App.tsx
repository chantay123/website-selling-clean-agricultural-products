import { Route, Routes } from "react-router-dom";
import { publicRoute } from "./routes";

const App = () => {
  return (
    <Routes>
      {publicRoute.map((route, index) => {
        const Page = route.component;
        return <Route key={index} path={route.path} element={<Page />}></Route>;
      })}
    </Routes>
  );
};

export default App;
