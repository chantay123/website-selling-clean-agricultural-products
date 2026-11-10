import requestApi from "../utils/interceptors";
import {
  apiResponseType,
  cartTypes,
  CategoryType,
  FavoriteType,
  productTypes,
  profileType,
  SupplierType,
} from "../@type/global.type";
import {
  addToCartPayloadType,
  loginPayloadType,
  registerPayloadType,
  updateProfilePayloadType,
} from "../@type/user.type";
import {
  normalizeCart,
  normalizeProducts,
  normalizeProduct,
  normalizeProfile,
} from "../utils/api.adapter";

/**
 * Single place that knows every Agrimarket endpoint.
 *
 * The components keep calling `requestApi` indirectly through these helpers,
 * which guarantees that a path is only ever written once and that the
 * response is normalised before it reaches the store.
 */

/* ----------------------------- authentication ---------------------------- */

/** `POST /users/register` */
export const register = async (payload: registerPayloadType) => {
  const response = await requestApi("users/register", "POST", payload);
  return response.data as apiResponseType<{
    _id: string;
    full_name: string;
    email: string;
    access_token: string;
    refresh_token: string;
    role: string;
  }>;
};

/** `POST /users/login` */
export const login = async (payload: loginPayloadType) => {
  const response = await requestApi("users/login", "POST", payload);
  return response.data as apiResponseType<{
    _id: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
  }>;
};

/** `POST /users/logout` — invalidates the refresh token on the backend. */
export const logout = async (refreshToken: string) => {
  const response = await requestApi("users/logout", "POST", {
    refresh_token: refreshToken,
  });
  return response.data as apiResponseType<unknown>;
};

/** `GET /users/@me/profile` */
export const getMyProfile = async () => {
  const response = await requestApi("users/@me/profile", "GET", {});
  const payload = response.data as apiResponseType<profileType>;
  return {
    ...payload,
    data: normalizeProfile(payload.data),
  };
};

/** `PUT /users/@me/profile` */
export const updateMyProfile = async (payload: updateProfilePayloadType) => {
  const response = await requestApi("users/@me/profile", "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/change` */
export const changePassword = async (payload: {
  old_password: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await requestApi("users/password/change", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/forgot` */
export const forgotPassword = async (email: string) => {
  const response = await requestApi("users/password/forgot", "POST", { email });
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/forgot/authenticate` */
export const authenticateForgotPassword = async (code: string) => {
  const response = await requestApi(
    "users/password/forgot/authenticate",
    "POST",
    { code }
  );
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/reset` */
export const resetPassword = async (payload: {
  email: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await requestApi("users/password/reset", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/otp/authenticate` */
export const authenticateOtp = async (otp: string) => {
  const response = await requestApi("users/otp/authenticate", "POST", { otp });
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/otp/revalidate` */
export const resendOtp = async (email: string) => {
  const response = await requestApi("users/otp/revalidate", "POST", { email });
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- products ------------------------------- */

/** `GET /products` */
export const getProducts = async () => {
  const response = await requestApi("products", "GET", {});
  const payload = response.data as apiResponseType<productTypes[]>;
  return {
    ...payload,
    data: normalizeProducts(payload.data),
  };
};

/** `GET /products/:id` */
export const getProductById = async (id: string) => {
  const response = await requestApi(`products/${id}`, "GET", {});
  const payload = response.data as apiResponseType<productTypes>;
  return {
    ...payload,
    data: normalizeProduct(payload.data),
  };
};

/** `GET /products/categories/:categoryId` */export const getProductsByCategory = async (categoryId: string) => {
  const response = await requestApi(
    `products/categories/${categoryId}`,
    "GET",
    {}
  );
  const payload = response.data as apiResponseType<productTypes[]>;
  return {
    ...payload,
    data: normalizeProducts(payload.data),
  };
};

/** `POST /products/search?keyword=...` */
export const searchProducts = async (keyword: string) => {
  const response = await requestApi(
    `products/search?keyword=${encodeURIComponent(keyword)}`,
    "POST",
    {}
  );
  const payload = response.data as apiResponseType<productTypes[]>;
  return {
    ...payload,
    data: normalizeProducts(payload.data),
  };
};

/** `POST /products/:id/like` */
export const likeProduct = async (id: string) => {
  const response = await requestApi(`products/${id}/like`, "POST", {});
  return response.data as apiResponseType<unknown>;
};

/** `POST /products/:id/unlike` */
export const unlikeProduct = async (id: string) => {
  const response = await requestApi(`products/${id}/unlike`, "POST", {});
  return response.data as apiResponseType<unknown>;
};

/** `GET /users/products/favorites` */
export const getFavoriteProducts = async () => {
  const response = await requestApi("users/products/favorites", "GET", {});
  const payload = response.data as apiResponseType<FavoriteType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/* ------------------------------- categories ------------------------------ */

/** `GET /categories` */
export const getCategories = async () => {
  const response = await requestApi("categories", "GET", {});
  const payload = response.data as apiResponseType<CategoryType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/* ------------------------------- suppliers ------------------------------- */

/** `GET /suppliers` */
export const getSuppliers = async () => {
  const response = await requestApi("suppliers", "GET", {});
  const payload = response.data as apiResponseType<SupplierType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/* ---------------------------------- cart --------------------------------- */

/** `GET /carts` */
export const getCart = async () => {
  const response = await requestApi("carts", "GET", {});
  const payload = response.data as apiResponseType<cartTypes>;
  return {
    ...payload,
    data: normalizeCart(payload.data),
  };
};

/** `POST /carts/items` */
export const addToCart = async (payload: addToCartPayloadType) => {
  const response = await requestApi("carts/items", "POST", payload);
  const body = response.data as apiResponseType<cartTypes>;
  return {
    ...body,
    data: body.data ? normalizeCart(body.data) : body.data,
  };
};

/** `PUT /carts/items/:cartId` */
export const updateCartItems = async (
  cartId: string,
  payload: addToCartPayloadType
) => {
  const response = await requestApi(`carts/items/${cartId}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /carts/items/:cartId?product_id=...` */
export const removeCartItem = async (
  cartId: string,
  productId: string
) => {
  const response = await requestApi(
    `carts/items/${cartId}?product_id=${productId}`,
    "DELETE",
    {}
  );
  const body = response.data as apiResponseType<cartTypes>;
  return {
    ...body,
    data: body.data ? normalizeCart(body.data) : body.data,
  };
};

/* --------------------------------- orders -------------------------------- */

/** `GET /orders` */
export const getOrders = async () => {
  const response = await requestApi("orders", "GET", {});
  const payload = response.data as apiResponseType<unknown[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/** `POST /orders` */
export const createOrder = async (payload: {
  product_attribute_ids: string[];
  address: string;
  phone: string;
  payment_method: string;
  note?: string;
}) => {
  const response = await requestApi("orders", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/**
 * `DELETE /products?id=...`
 *
 * The identifier is passed through the query string because that is the shape
 * the endpoint expects.
 */
export const deleteProduct = async (id: string) => {
  const response = await requestApi(`products?id=${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/** `PUT /products/:id` */
export const updateProduct = async (
  id: string,
  payload: Record<string, any>
) => {
  const response = await requestApi(`products/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};
