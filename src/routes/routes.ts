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
const NotFound = React.lazy(() => import("../components/NotFound/NotFound"));

const Profile = React.lazy(
  () => import("../container/Profile/Page/MainProfile")
);
const Shop = React.lazy(() => import("../container/Shop/Page/Shop"));
const Admin = React.lazy(
  () => import("../container/Admin/page/HomeAdmin/Admin")
);
const Payment = React.lazy(() => import("../container/Payment/Payment"));
const Changepassword = React.lazy(
  () => import("../container/Auth/pages/ChangePassword")
);
const Myfavorite = React.lazy(
  () => import("../components/Myfavorite/Myfavorite")
);
const Stock = React.lazy(() => import("../container/Admin/page/Stock"));

const ProductAdmin = React.lazy(
  () => import("../container/Admin/page/ProductAdmin/ProductAdmin")
);
const EditAdmin = React.lazy(
  () => import("../container/Admin/page/EditAdmin/EditAdmin")
);
const CategoryAdmin = React.lazy(
  () => import("../container/Admin/page/CategoryAdmin/CategoryAdmin")
);

const Supplier = React.lazy(
  () => import("../container/Admin/page/SupplierManagement/Main/Supplier")
);

const SupplierEdit = React.lazy(
  () => import("../container/Admin/page/SupplierManagement/Edit/SupplierEdit")
);

const SupplierCreate = React.lazy(
  () => import("../container/Admin/page/SupplierManagement/Create/SupplierCreate")
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
  {
    path: config.routes.stock,
    component: Stock,
  },
  {
    path: config.routes.productadmin,
    component: ProductAdmin,
  },
  {
    path: config.routes.editadmin,
    component: EditAdmin,
  },
  {
    path: config.routes.categoryadmin,
    component: CategoryAdmin,
  },
  {
    path: config.routes.supplier,
    component: Supplier,
  },
  {
    path: config.routes.supplieredit,
    component: SupplierEdit,
  },
  {
    path: config.routes.suppliercreate,
    component: SupplierCreate,
  },
];

export { publicRoute };
