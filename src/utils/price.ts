/**
 * Price helpers.
 *
 * The Agrimarket API stores the price of a product in `attributes`, where
 * every attribute describes one packaging (weight) of the product:
 *
 * - `original_price`  : the price of one kilogram before the discount,
 * - `discounted_percent` : the discount in percent,
 * - `discount_price`  : the price of one kilogram after the discount,
 * - `total_price`     : the price of the whole packaging
 *                       (`discount_price * weight`).
 *
 * The test data of the backend uses placeholder numbers (`8`, `10`, `30`,
 * `0`), therefore the prices are normalised to a realistic Vietnamese
 * agricultural price range before they reach the UI.
 */

/** Lowest price (VND) a product may have per kilogram. */
export const MIN_PRICE = 15_000;

/** Highest price (VND) a product may have per kilogram. */
export const MAX_PRICE = 250_000;

/** Formats a number as a Vietnamese amount of money. */
export const formatVND = (value?: number | null): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return `${Math.round(value).toLocaleString("vi-VN")} đ`;
};

/** Formats a price per kilogram, e.g. `65.000 đ/kg`. */
export const formatPricePerKg = (value?: number | null): string =>
  `${formatVND(value)}/kg`;

/** Rounds a price to the nearest thousand đồng. */
export const roundPrice = (value: number): number =>
  Math.round(value / 1000) * 1000;

/** Clamps a price into the realistic range. */
export const clampPrice = (value: number): number =>
  Math.min(Math.max(value, MIN_PRICE), MAX_PRICE);

/**
 * Derives a realistic price (VND per kilogram) from a raw API value.
 *
 * The backend mixes two conventions: real amounts (`30000`) and placeholders
 * (`10`). Values below `1000` are therefore treated as "ten thousands of
 * đồng" and scaled into the realistic range.
 */
export const deriveRealisticPrice = (
  rawValue?: number | null,
  fallback = 45_000
): number => {
  if (rawValue === undefined || rawValue === null || Number.isNaN(rawValue)) {
    return clampPrice(fallback);
  }

  if (rawValue <= 0) return clampPrice(fallback);

  // Placeholder value, e.g. `10` means ten thousands of đồng.
  if (rawValue < 1000) {
    return clampPrice(rawValue * 5000);
  }

  return clampPrice(rawValue);
};

/**
 * Computes the three prices of an attribute so that they are consistent:
 *
 * - `discount_price = original_price * (1 - discounted_percent / 100)`
 * - `total_price = discount_price * weight`
 */
export const resolveAttributePrices = (
  attribute: {
    weight?: number | null;
    original_price?: number | null;
    discounted_percent?: number | null;
    discount_price?: number | null;
    total_price?: number | null;
  },
  /** Overrides the base price when the API value is only a placeholder. */
  basePrice?: number
) => {
  const weight = Number(attribute.weight) || 0;
  const percent = Math.min(
    Math.max(Number(attribute.discounted_percent) || 0, 0),
    90
  );

  const originalPrice =
    basePrice ?? deriveRealisticPrice(attribute.original_price);
  const discountPrice = Math.round((originalPrice * (100 - percent)) / 100);
  const totalPrice = Math.round(discountPrice * weight);

  return {
    original_price: originalPrice,
    discounted_percent: percent,
    discount_price: discountPrice,
    total_price: totalPrice,
  };
};

/** Computes the discount percentage between two prices. */
export const discountPercent = (
  originalPrice?: number | null,
  finalPrice?: number | null
): number => {
  if (!originalPrice || !finalPrice) return 0;
  if (finalPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};
