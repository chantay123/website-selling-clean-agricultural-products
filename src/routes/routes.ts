import config from "../config";
import React, { Component } from "react";

const MainHome = React.lazy(() => import("../container/Home/page/MainHome"));
const ProductDetail = React.lazy(
  () => import("../container/Detail/page/ProductDetail/ProductDetail")
);
const Login = React.lazy(() => import("../container/Auth/pages/Login/Login"));
const Forgotpassword = React.lazy(
  () => import("../container/Auth/pages/ForgotPassword/ForgotPassword")
);
const Register = React.lazy(
  () => import("../container/Auth/pages/Register/Register")
);
const Verification = React.lazy(
  () => import("../container/Auth/pages/Verification/Verification")
);
const Newpassword = React.lazy(
  () => import("../container/Auth/pages/NewPassword/NewPassword")
);
const NotFound = React.lazy(() => import("../components/NotFound/NotFound"));

const Profile = React.lazy(
  () => import("../container/Profile/Page/MainProfile")
);
const Shop = React.lazy(() => import("../container/Shop/Page/Shop"));
const Admin = React.lazy(() => import("../container/Admin/page/Admin"));
const Payment = React.lazy(() => import("../container/Payment/Payment"));
const Changepassword = React.lazy(
  () => import("../container/Auth/pages/ChangePassword")
);
const Myfavorite = React.lazy(
  () => import("../components/Myfavorite/Myfavorite")
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
  {
    path: config.routes.login,
    component: Login,
  },
  {
    path: config.routes.forgotpassword,
    component: Forgotpassword,
  },
  {
    path: config.routes.register,
    component: Register,
  },
  {
    path: config.routes.verification,
    component: Verification,
  },
  {
    path: config.routes.newpassword,
    component: Newpassword,
  },
  {
    path: config.routes.notFound,
    component: NotFound,
  },
  {
    path: config.routes.profile,
    component: Profile,
  },
  {
    path: config.routes.shop,
    component: Shop,
  },
  {
    path: config.routes.admin,
    component: Admin,
  },
  {
    path: config.routes.payment,
    component: Payment,
  },
  {
    path: config.routes.changepassword,
    component: Changepassword,
  },
  {
    path: config.routes.myfavorite,
    component: Myfavorite,
  },
];

export { publicRoute };
