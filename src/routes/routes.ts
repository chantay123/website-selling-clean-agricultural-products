import config from "../config";
import React from "react";

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
];

export { publicRoute };
