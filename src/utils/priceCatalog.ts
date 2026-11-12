/**
 * Catalogue of the realistic prices (VND) of the products that already exist
 * on the Agrimarket backend.
 *
 * The public test data uses placeholder numbers (`10`, `30`, `0`) that were
 * never meant to be real prices. This table maps every known product of the
 * backend to a price that matches the Vietnamese agricultural market, so the
 * shop never shows `10 đ` for a box of apples.
 *
 * The values are expressed per kilogram, except for the products that are
 * sold per piece / per box.
 */

export const CATALOG_PRICES: Record<string, number> = {
  /* -------------------------------- fruits -------------------------------- */
  "fresh-apple": 78_000, // Táo đỏ (Đà Lạt)
  "tao-do": 78_000,
  apple: 78_000,
  "tao-khoa": 72_000,
  durian: 165_000, // Sầu riêng Riêng Vàng
  "sau-rieng": 165_000,
  "sau-rieng-rieng-vang": 165_000,
  "thanh-long": 35_000,
  "dragon-fruit": 35_000,
  grape: 78_000, // Nho xanh
  "nho-xanh": 78_000,
  "nho-xanh-tay-ninh": 78_000,
  "bo-sap-034": 94_000,
  "bo-sap": 94_000,
  "xoai-cat-hoa-loc": 55_000,
  xoai: 55_000,
  "banh-chuoi": 30_000,
  "chuoi-nu-dong-nai": 30_000,
  "dua-hau-ruot-do": 28_000,
  "dua-hau": 28_000,
  "dua-tu-ben-tre": 25_000,
  "cam-sai": 45_000,
  "buoi": 35_000,
  "vai": 180_000,
  "xoai-cat": 55_000,

  /* ------------------------------ vegetables ----------------------------- */
  "red-tomato": 42_000, // Cà chua
  "ca-chua": 42_000,
  "ca-chua-bi": 42_000,
  tomato: 42_000,
  "ca-rok": 32_000, // Cà rốt
  "carrot": 32_000,
  "bap-cai-trang": 26_000,
  "bap-cai": 26_000,
  "rau-muong": 16_000,
  "muong": 16_000,
  "khoai-lang-dong-nai": 22_000,
  "khoai-lang": 22_000,
  "khoai-tay": 25_000,
  "khoai-chu": 20_000,
  "cai-be-lo": 18_000,
  "cai-xanh": 15_000,
  "dua-lep": 24_000,
  "bia": 18_000,
  "ot-chi-thang": 30_000,
  "nam": 90_000,
  "rau-muong-tay": 16_000,

  /* --------------------------------- meat -------------------------------- */
  "thit-bo-moc-chau": 225_000,
  "thit-bo": 225_000,
  "bo-moc-chau": 225_000,
  "thit-ga-ta": 121_500,
  "ga-ta": 121_500,
  "thit-ga": 121_500,
  "thit-heo": 145_000,
  "heo": 145_000,
  "ca-basa-an-giang": 66_300,
  "ca-basa": 66_300,
  "ca-hu": 120_000,
  "tom-su-camau": 206_800,
  "tom-su": 206_800,
  "tom": 206_800,
  "gao-lut-lang-que": 39_000,
  "gao-lut": 39_000,
  "gao": 39_000,
  "trung-ga": 32_000,

  /* -------------------------------- spices -------------------------------- */
  "mat-ong-rung": 124_200,
  "mat-ong": 124_200,
  honey: 124_200,
  "nam-huong-kho": 209_000,
  "nam-huong": 209_000,
  "muoi-bien-mien": 12_000,
  "muoi-bien": 12_000,
  "muoi": 12_000,
  "tuong-ot": 45_000,
  "gia-vi": 45_000,

  /* ------------------------- products sold per piece ---------------------- */
  "ht-vt-abcd": 4_500, // Hột vịt muối (hộp)
  "ht-vt-g": 4_500, // Hột vịt gà (hộp)
  "hot-vt-muoi": 4_500,
};

/** Normalises a name / slug so that lookups are case and accent tolerant. */
export const normalizeKey = (value?: string | null): string =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Looks the realistic price of a product up.
 *
 * The slug is tried first, then the product name. When nothing matches,
 * `undefined` is returned so the caller can fall back to the price that
 * comes from the API.
 */
export const lookupCatalogPrice = (product: {
  slug?: string | null;
  name?: string | null;
}): number | undefined => {
  const slug = normalizeKey(product.slug);
  if (slug && CATALOG_PRICES[slug] !== undefined) return CATALOG_PRICES[slug];

  const name = normalizeKey(product.name);
  if (name && CATALOG_PRICES[name] !== undefined) return CATALOG_PRICES[name];

  return undefined;
};
