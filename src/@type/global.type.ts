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
  changepassword: string;
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
};
