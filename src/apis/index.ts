import requestApi from "../utils/interceptors";
import {
  apiResponseType,
  BannerType,
  BlogType,
  cartTypes,
  CategoryType,
  CommentType,
  FavoriteType,
  HashtagType,
  productTypes,
  profileType,
  ReportType,
  RoleType,
  StockType,
  SupplierType,
} from "../@type/global.type";
import {
  addToCartPayloadType,
  loginPayloadType,
  registerPayloadType,
  updateProductPayloadType,
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

/* -------------------------------- banners -------------------------------- */

/**
 * `GET /banners`
 *
 * The banner collection is a public resource used by the hero carousel.
 */
export const getBanners = async () => {
  const response = await requestApi("banners", "GET", {});
  const payload = response.data as apiResponseType<BannerType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/* --------------------------------- blogs --------------------------------- */

/** `GET /blogs` */
export const getBlogs = async () => {
  const response = await requestApi("blogs", "GET", {});
  const payload = response.data as apiResponseType<BlogType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/** `GET /blogs/:id` */
export const getBlogById = async (id: string) => {
  const response = await requestApi(`blogs/${id}`, "GET", {});
  const payload = response.data as apiResponseType<BlogType>;
  return {
    ...payload,
    data: payload.data,
  };
};

/* ------------------------------- hashtags ------------------------------- */

/** `GET /hashtags` */
export const getHashtags = async () => {
  const response = await requestApi("hashtags", "GET", {});
  const payload = response.data as apiResponseType<HashtagType[]>;
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
  payload: updateProductPayloadType
) => {
  const response = await requestApi(`products/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/* --------------------------------- roles --------------------------------- */

/**
 * `GET /roles`
 *
 * Only reachable by an authenticated administrator. The collection lists the
 * roles a user account can be assigned to.
 */
export const getRoles = async () => {
  const response = await requestApi("roles", "GET", {});
  const payload = response.data as apiResponseType<RoleType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/**
 * `GET /roles/:id` does **not** exist on the backend — probing returned
 * `404 Cannot GET /api/v1/roles/<id>`. Only the collection `GET /roles` and
 * the update / delete verbs on `PUT|DELETE /roles/:id` are routed.
 */

/** `PUT /roles/:id` */
export const updateRole = async (id: string, payload: Partial<RoleType>) => {
  const response = await requestApi(`roles/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /roles/:id` */
export const deleteRole = async (id: string) => {
  const response = await requestApi(`roles/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- reports -------------------------------- */

/**
 * `GET /reports`
 *
 * The moderation queue. `target_type` tells what the report is about
 * (`product`, `blog`, `comment`, ...).
 */
export const getReports = async () => {
  const response = await requestApi("reports", "GET", {});
  const payload = response.data as apiResponseType<ReportType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/**
 * `GET /reports/:id` does **not** exist on the backend — probing returned
 * `404 Cannot GET /api/v1/reports/<id>`. The collection `GET /reports`,
 * the creation `POST /reports` and `DELETE /reports/:id` are routed.
 */

/** `POST /reports` */
export const createReport = async (payload: {
  target_type: string;
  target_id: string;
  reason?: string;
  description?: string;
}) => {
  const response = await requestApi("reports", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /reports/:id` */
export const deleteReport = async (id: string) => {
  const response = await requestApi(`reports/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* --------------------------------- stocks -------------------------------- */

/**
 * `GET /stocks`
 *
 * The inventory of the shop. Every record describes one product attribute
 * (a concrete weight / packaging) and how many units are left.
 */
export const getStocks = async () => {
  const response = await requestApi("stocks", "GET", {});
  const payload = response.data as apiResponseType<StockType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/** `GET /stocks/:id` */
export const getStockById = async (id: string) => {
  const response = await requestApi(`stocks/${id}`, "GET", {});
  return response.data as apiResponseType<StockType>;
};

/** `POST /stocks` */
export const createStock = async (payload: Partial<StockType>) => {
  const response = await requestApi("stocks", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `PUT /stocks/:id` */
export const updateStock = async (id: string, payload: Partial<StockType>) => {
  const response = await requestApi(`stocks/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /stocks/:id` */
export const deleteStock = async (id: string) => {
  const response = await requestApi(`stocks/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- comments -------------------------------- */

/**
 * `GET /products/:id/comments`
 *
 * The reviews of a product. The endpoint requires an access token, so the
 * page has to hide the tab for anonymous visitors.
 */
export const getProductComments = async (productId: string) => {
  const response = await requestApi(`products/${productId}/comments`, "GET", {});
  const payload = response.data as apiResponseType<CommentType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/** `POST /products/:id/comments` */
export const createProductComment = async (
  productId: string,
  payload: {
    content: string;
    rating?: number;
    parent_id?: string;
  }
) => {
  const response = await requestApi(
    `products/${productId}/comments`,
    "POST",
    payload
  );
  return response.data as apiResponseType<CommentType>;
};

/** `DELETE /products/:id/comments/:commentId` */
export const deleteProductComment = async (
  productId: string,
  commentId: string
) => {
  const response = await requestApi(
    `products/${productId}/comments/${commentId}`,
    "DELETE",
    {}
  );
  return response.data as apiResponseType<unknown>;
};

/** `GET /blogs/:id/comments` */
export const getBlogComments = async (blogId: string) => {
  const response = await requestApi(`blogs/${blogId}/comments`, "GET", {});
  const payload = response.data as apiResponseType<CommentType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/** `POST /blogs/:id/comments` */
export const createBlogComment = async (
  blogId: string,
  payload: { content: string; parent_id?: string }
) => {
  const response = await requestApi(`blogs/${blogId}/comments`, "POST", payload);
  return response.data as apiResponseType<CommentType>;
};

/** `DELETE /blogs/:id/comments/:commentId` */
export const deleteBlogComment = async (blogId: string, commentId: string) => {
  const response = await requestApi(
    `blogs/${blogId}/comments/${commentId}`,
    "DELETE",
    {}
  );
  return response.data as apiResponseType<unknown>;
};

/** `POST /blogs/:id/like` */
export const likeBlog = async (id: string) => {
  const response = await requestApi(`blogs/${id}/like`, "POST", {});
  return response.data as apiResponseType<unknown>;
};
