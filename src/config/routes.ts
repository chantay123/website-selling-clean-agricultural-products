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
  productadmin: "/productadmin",
  editadmin: "/editadmin/:editId",
  categoryadmin: "/categoryadmin",

  supplier: "/supplier",
  supplieredit: "/supplier/edit/:id",
  suppliercreate: "/supplier/create",

  editcategoryadmin: "/editcategoryadmin/:editId",
  addcategoryadmin: "/addcategoryadmin",

} as const;

export default routes;
