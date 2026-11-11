export type routeTypes = {
  home: string;
  profile: string;
  productDetail: string;
  login: string;
  register: string;
  newpassword: string;
  forgotpassword: string;
  verification: string;
  notFound: string;
  shop: string;
  admin: string;
  payment: string;
  changepassword: string;
  myfavorite: string;
  stock: string;
  report: string;
  role: string;
  productadmin: string;
  editadmin: string;
};

export type productTypes = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  category_id?: string;
  sold?: number;
  thumbnail_url: string;
  images?: ProductImageType[];
  rating?: number;
  numberOfReview?: number;
  hot?: boolean;
  /** Normalised alias of `attributes` / `attribute` coming from the API. */
  productAttributes: ProductAttribute[];
  category: CategoryType;
  total_price: number;
  /** Effective price derived from the product attributes. */
  price?: number;
  supplier?: SupplierType;
  hashtags?: string[];
  creator_id?: string;
  updater_id?: string;
};

export type ProductImageType = {
  _id: string;
  url: string;
  created_at?: string;
};

export type extendedProductType = productTypes & { key: string };

export type ProductAttribute = {
  _id: string;
  weight: number;
  original_price: number;
  discounted_percent?: number;
  product_id: string;
  discount_price?: number;
  quantity: number;
  dimensions?: string;
  unit_of_measurement?: string;
  quantity_per_unit?: number;
  certification?: string;
  harvest_date?: string;
  link?: string;
  expiration_date?: string;
  total_price?: number;
};

export type cartTypes = {
  _id: string;
  user: string;
  user_id?: string;
  total_price: number;
  /** Normalised alias of `carts` coming from the API. */
  items: cartItemType[];
  /** Raw payload returned by the API. */
  carts?: cartItemType[];
  created_at?: string;
  updated_at?: string;
  lastModified?: string;
};

export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
  items?: productTypes[];
  image?: string;
};

export type FavoriteType = {
  _id: string;
  name: string;
  origin: string;
  thumbnail_url: string;
  slug?: string;
  description?: string;
  sold?: number;
  category_id?: string;
  rating?: number;
  numberOfReview?: number;
  hot?: boolean;
  images?: ProductImageType[];
};

export type cartItemType = {
  /** Embedded product details returned by the API (`productDetails`). */
  product_id: productTypes;
  quantity: number;
  price?: number;
  productAttributeId?: string;
  product_attribute_id?: string;
};

export type productDetailTypes = {
  thumbnail_url: string;
  description: string;
  name: string;
  slug: string;
  _id: string;
};

export type profileType = {
  _id: string;
  username: string;
  email: string;
  /** Normalised alias of `full_name` coming from the API. */
  fullName: string;
  thumbnail: string;
  /** Normalised alias of `avatar` coming from the API. */
  avatarUrl: string;
  address: string;
  gender: boolean | string | null;
  phone?: string;
  role?: string;
  isOnline?: boolean;
  isBlocked?: boolean;
  isPro?: boolean;
};

export type SupplierType = {
  _id: string;
  company_name: string;
  contact_name: string;
  contact_title: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  certification_details: string;
  description: string;
  creator_id?: string;
  payment_terms?: string;
};

/** Shape of the envelope returned by every Agrimarket endpoint. */
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};

/** Shape of a banner returned by `GET /banners`. */
export type BannerType = {
  _id: string;
  slug: string;
  url: string;
  description?: string;
  link?: string;
};

/** Shape of a blog post returned by `GET /blogs`. */
export type BlogType = {
  _id: string;
  author_id?: string;
  author_name?: string;
  title: string;
  description?: string;
  detail?: string;
  status?: string;
  comments_count?: number;
  report_count?: number;
  views_count?: number;
  thumbnail?: string;
};

/** Shape of a hashtag returned by `GET /hashtags`. */
export type HashtagType = {
  _id: string;
  name: string;
  slug: string;
  type?: string;
  description?: string;
  usage_count?: number;
  isTrending?: boolean;
};

/** Error envelope returned by the Agrimarket API. */
export type apiErrorType = {
  message: string;
  errors?: Record<string, { type: string; msg: string; path: string }>;
  statusCode?: number;
};

/**
 * Shape of a role returned by `GET /roles`.
 *
 * The endpoint is only reachable by an authenticated administrator, so the
 * fields are optional to stay compatible with the different shapes the
 * backend may return.
 */
export type RoleType = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
};

/** Shape of a report returned by `GET /reports`. */
export type ReportType = {
  _id: string;
  /** Kind of resource the report points at (`product`, `blog`, ...). */
  target_type?: string;
  target_id?: string;
  reason?: string;
  description?: string;
  /** `Pending`, `Approved`, `Rejected`, ... */
  status?: string;
  user_id?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
};

/** Shape of a stock record returned by `GET /stocks`. */
export type StockType = {
  _id: string;
  product_id?: string;
  /** Denormalised product name, when the backend embeds it. */
  product_name?: string;
  quantity?: number;
  original_price?: number;
  discount_price?: number;
  total_price?: number;
  unit_of_measurement?: string;
  expiration_date?: string;
  harvest_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Shape of a comment returned by `GET /products/:id/comments` and
 * `GET /blogs/:id/comments`.
 */
export type CommentType = {
  _id: string;
  product_id?: string;
  blog_id?: string;
  user_id?: string;
  /** Display name of the author, when the backend embeds it. */
  user_name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  content?: string;
  /** Star rating attached to the comment, when it is a product review. */
  rating?: number;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
};
