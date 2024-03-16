import config from "../config";
import React from "react";

const MainHome = React.lazy(() => import("../container/Home/page/MainHome"));
const ProductDetail = React.lazy(
  () => import("../container/Detail/page/ProductDetail/ProductDetail")
);
const publicRoute = [
  {
    path: config.routes.home,
    component: MainHome,
  },
  {
    path: config.routes.productDetail,
    component: ProductDetail,
  },
];

export { publicRoute };
