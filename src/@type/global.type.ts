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
  categoryadmin: string;
  orderadmin: string;
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
  _id: string;
  weight: number;
  original_price: number;
  discounted_percent?: number;
  product_id: string;
  discount_price?: number;
  quantity: number;
};
export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
};

export type FavoriteType = {
  _id: string;
  name: string;
  origin: string;
  thumbnail_url: string;
};

export type cartTypes = {
  _id: string;
  user_id: string;
  total_price: number;
  carts: cartItemType[];
};

export type cartItemType = {
  price: number;
  productAttributeId: string;
  productDetails: productDetailTypes;
  quantity: number;
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
  full_name: string;
  thumbnail: string;
  address: string;
  avatar: string;
  gender: boolean;
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
};

export type OrderType = {
  _id: string;
  user: string;
  payment_method: string;
  status: "pending" | "completed" | "cancelled";//enum
  address: string;
  note?: string;
  total_price: number;
  order_date: Date;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};
