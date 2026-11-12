import { routeTypes } from "../@type/global.type";

const routes: routeTypes = {
  home: "/",
  profile: "/profile",
  productDetail: "/product/:productId",
  login: "/login",
  register: "/register",
  newpassword: "/new-password",
  verification: "/verification",
  forgotpassword: "/forgot-password",
  shop: "/shop",
  notFound: "*",
  admin: "/admin",
  payment: "/payment",
  changepassword: "/changepassword",
  myfavorite: "/myfavorite",
  stock: "/stock",
  report: "/report",
  role: "/role",
  productadmin: "/productadmin",
  editadmin: "/editadmin/:editId",
  blog: "/blog",
  blogDetail: "/blog/:blogId",
  knowledge: "/knowledge",
  categoryadmin: "/categoryadmin",
  supplieradmin: "/supplieradmin",
  orderadmin: "/orderadmin",
  banneradmin: "/banneradmin",
  hashtagadmin: "/hashtagadmin",
  blogadmin: "/blogadmin",
} as const;

export default routes;
