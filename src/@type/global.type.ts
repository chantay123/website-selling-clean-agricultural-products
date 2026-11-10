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
  productadmin: string;
  editadmin: string;
};

export type productTypes = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  category_id: Object;
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

/** Error envelope returned by the Agrimarket API. */
export type apiErrorType = {
  message: string;
  errors?: Record<string, { type: string; msg: string; path: string }>;
  statusCode?: number;
};
