import { routeTypes } from "../@type/global.type";

const routes: routeTypes = {
  home: "/",
  productDetail: "/product-detail",
  login: "/login",
  register: "/register",
  newpassword: "/new-password",
  verification: "/verification",
  forgotpassword: "/forgot-password",
} as const;

export default routes;
