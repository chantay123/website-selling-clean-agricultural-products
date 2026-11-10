import {
  CategoryType,
  FavoriteType,
  SupplierType,
  cartTypes,
  productTypes,
  profileType,
} from "./global.type";

export type userType = {
  _id: string;
  username: string;
  email?: string;
  access_token?: string;
  refresh_token?: string;
  isOnline?: boolean;
  avatar?: string;
  cover_photo?: string;
  /** Full name returned by the register endpoint. */
  full_name?: string;
  phone?: string;
  /** Role returned by the API, `Admin` grants access to the admin pages. */
  role?: string;
};

export type userState = {
  login: userType | null;
  register: userType | null;
  verify: userType | null;
  resendOTP: userType | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  isForgotPassword: boolean;
  product: productTypes[] | [];
  cart?: cartTypes | null;
  profile: profileType | null;
  cartnumber: number;
  category: CategoryType[] | [];
  favorite: FavoriteType[] | [];

  supplier: SupplierType[] | [];
};

export type userLoginType = {
  _id: string;
  username: string;
  email: string;
  role: string;
  token_type: string;
  iat: string;
  exp: string;
};

/** Body accepted by `POST /users/login`. */
export type loginPayloadType = {
  email: string;
  password: string;
};

/** Body accepted by `POST /users/register`. */
export type registerPayloadType = {
  email: string;
  phone: string;
  full_name: string;
  password: string;
  confirm_password: string;
};

/** Body accepted by `POST /carts/items`. */
export type addToCartPayloadType = {
  items: {
    product_id: string;
    product_attribute_id: string;
    quantity: number;
  }[];
};

/** Body accepted by `PUT /users/@me/profile`. */
export type updateProfilePayloadType = {
  full_name: string;
  phone: string;
  address?: string;
  gender?: string;
  avatar?: string;
  thumbnail?: string;
};
