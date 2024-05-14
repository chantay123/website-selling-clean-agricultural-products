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
  changepassword: "/changepassword",
  shop: "/shop",
  notFound: "*",
} as const;

export default routes;
