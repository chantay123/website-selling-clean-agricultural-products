/**
 * Backend response adapters.
 *
 * The Agrimarket REST API returns a slightly different shape than the one the
 * UI components consume (for example the API exposes `attributes` while the
 * components read `productAttributes`, and the cart exposes `carts` while the
 * components read `items`).
 *
 * These helpers normalise the API payload into the shape the existing
 * components already expect, so that no component has to be rewritten.
 */

/** Loosely typed record used while normalising an unknown API payload. */
type LooseRecord = Record<string, unknown>;

/**
 * Normalise a product coming from the API.
 *
 * - `attributes` (list payload) / `attribute` (detail payload) are exposed as
 *   `productAttributes` because that is the field the components read.
 * - `category` may be missing when the API only returns `category_id`, in that
 *   case a placeholder object is provided so `category?.name` keeps working.
 */
export const normalizeProduct = <T extends LooseRecord>(product: T) => {
  if (!product) return product;

  const rawAttributes = product.attributes ?? product.attribute;
  const attributes = Array.isArray(rawAttributes)
    ? (rawAttributes as LooseRecord[])
    : rawAttributes
      ? [rawAttributes as LooseRecord]
      : [];

  const category = product.category ?? {
    _id: product.category_id ?? "",
    name: "",
    slug: "",
  };

  const first = attributes[0] ?? {};

  // The effective price is derived from the product attributes when
  // available, falling back to the `sold` field of the raw product.
  const price =
    (first.discount_price as number | undefined) ??
    (first.total_price as number | undefined) ??
    (first.original_price as number | undefined) ??
    product.sold;

  return {
    ...product,
    category,
    productAttributes: attributes,
    price,
  };
};

/** Normalise an array of products. */
export const normalizeProducts = <T extends LooseRecord>(
  products: T[] | null | undefined
) => (Array.isArray(products) ? products.map(normalizeProduct) : []);

/**
 * Normalise a cart coming from the API.
 *
 * The API returns `carts` with `productDetails` embedded, while the UI reads
 * `items` with `product_id`.
 */
export const normalizeCart = <T extends LooseRecord>(cart: T) => {
  if (!cart) return cart;

  const rawCarts = Array.isArray(cart.carts) ? cart.carts : [];

  const items = rawCarts.map((rawItem) => {
    const item = rawItem as LooseRecord;
    return {
      ...item,
      product_id: (item.productDetails ?? item.product_id ?? {}) as LooseRecord,
      productAttributeId: (item.productAttributeId ??
        item.product_attribute_id) as string | undefined,
      quantity: item.quantity as number,
      price: item.price as number | undefined,
    };
  });

  return {
    ...cart,
    items,
    carts: items,
    total_price: (cart.total_price as number | undefined) ?? 0,
  };
};

/**
 * Normalise the profile of the logged in user.
 *
 * The API uses snake_case (`full_name`, `avatar`) while the UI reads
 * `fullName` and `avatarUrl`.
 */
export const normalizeProfile = <T extends LooseRecord>(profile: T) => {
  if (!profile) return profile;

  return {
    ...profile,
    fullName: (profile.full_name ?? profile.fullName ?? "") as string,
    avatarUrl: (profile.avatar ?? profile.avatarUrl ?? "") as string,
    coverPhoto: (profile.thumbnail ?? profile.cover_photo ?? "") as string,
  };
};

/**
 * Extract the human readable message out of an API error payload.
 *
 * The API answers with `{ message, errors }` where `errors` maps a field to
 * `{ msg }`. `message` is the generic one and is good enough for a toast.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Đã xảy ra lỗi, vui lòng thử lại"
): string => {
  const axiosError = error as {
    message?: string;
    response?: { data?: LooseRecord };
  };

  const data = axiosError?.response?.data;
  if (!data) return axiosError?.message || fallback;

  if (typeof data.message === "string") return data.message;

  const errors = data.errors as
    | Record<string, { msg?: string } | string>
    | undefined;
  const firstFieldError = errors ? Object.values(errors)[0] : undefined;

  if (firstFieldError && typeof firstFieldError === "object") {
    return firstFieldError.msg || fallback;
  }
  if (typeof firstFieldError === "string") return firstFieldError;

  return fallback;
};
