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
  rating?: number;
  numberOfReview?: number;
  hot?: boolean;
  attributes: ProductAttribute[];
  category: CategoryType;
  total_price: number;
};

export type extendedProductType = productTypes & { key: string };
export type ProductAttribute = {
  weight: number;
  original_price: number;
  discounted_percent?: number;
  discount_price?: number;
};
export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
};
export type cartTypes = {
  _id: string;
  user_id: string;
  total_price: number;
};
