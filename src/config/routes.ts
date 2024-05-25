import { routeTypes } from "../@type/global.type";

const routes: routeTypes = {
  home: "/",
  profile: "/profile",
  productDetail: "/product-detail",
  login: "/login",
  register: "/register",
  newpassword: "/new-password",
  verification: "/verification",
  forgotpassword: "/forgot-password",
  shop: "/shop",
  notFound: "*",
  admin: "/admin",
  payment: "/payment",
} as const;

export default routes;
