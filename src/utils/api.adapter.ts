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

import {
  deriveRealisticPrice,
  discountPercent,
  resolveAttributePrices,
} from "./price";
import { lookupCatalogPrice } from "./priceCatalog";

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
export const normalizeProduct = <T extends LooseRecord>(
  product: T,
  options: { applyCatalog?: boolean } = {}
) => {
  if (!product) return product;

  const rawAttributes =
    product.attributes ??
    product.attribute ??
    product.productAttributes ??
    product.product_attributes;
  const rawAttributeList = Array.isArray(rawAttributes)
    ? (rawAttributes as LooseRecord[])
    : rawAttributes
      ? [rawAttributes as LooseRecord]
      : [];

  const category = product.category ?? {
    _id: product.category_id ?? "",
    name: "",
    slug: "",
  };

  // Every packaging (attribute) gets a consistent set of prices:
  // `discount_price` is derived from `original_price` and the discount
  // percentage, `total_price` is the price of the whole packaging.
  //
  // When the backend only stores a placeholder price (`10`, `30`, `0`) the
  // realistic price of the catalogue is used instead.
  const catalogPrice = options.applyCatalog
    ? lookupCatalogPrice({
        slug: product.slug as string | undefined,
        name: product.name as string | undefined,
      })
    : undefined;

  const usesPlaceholder = rawAttributeList.some((attribute) => {
    const value = Number(attribute.original_price);
    return !Number.isFinite(value) || value <= 0 || value < 1000;
  });

  const attributes = rawAttributeList.map((attribute) => {
    const prices = resolveAttributePrices(
      {
        weight: attribute.weight as number | undefined,
        original_price: attribute.original_price as number | undefined,
        discounted_percent: attribute.discounted_percent as number | undefined,
        discount_price: attribute.discount_price as number | undefined,
        total_price: attribute.total_price as number | undefined,
      },
      catalogPrice && usesPlaceholder ? catalogPrice : undefined
    );

    return {
      ...attribute,
      ...prices,
    };
  });

  const first = attributes[0] ?? {};

  // The effective price is the price of one kilogram of the cheapest
  // packaging. The `sold` field is a quantity and must never be used as a
  // price.
  // The displayed price is the price of one kilogram of the base packaging
  // (the first attribute). The `sold` field is a quantity and must never be
  // used as a price.
  const attributePrices = attributes.map(
    (attribute) => attribute.discount_price as number
  );
  const fallbackPrice = Number(product.price) || deriveRealisticPrice(0);
  const price = attributePrices[0] ?? fallbackPrice;

  const originalPrice =
    (first.original_price as number | undefined) ??
    (Number(product.original_price) || price);

  return {
    ...product,
    category,
    productAttributes: attributes,
    price,
    original_price: originalPrice,
    discount_percent: discountPercent(originalPrice, price),
    total_price: (first.total_price as number | undefined) ?? price,
  };
};

/** Normalise an array of products. */
export const normalizeProducts = <T extends LooseRecord>(
  products: T[] | null | undefined,
  options: { applyCatalog?: boolean } = {}
) =>
  Array.isArray(products)
    ? products.map((product) => normalizeProduct(product, options))
    : [];

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
