/**
 * Verification script: exercises the exact URLs and payloads produced by
 * src/apis/index.ts against the live Agrimarket API and checks that the
 * response shape matches what the components read.
 */
const BASE = "https://agrimarket-z5f0.onrender.com/api/v1";

const results = [];
const check = (name, ok, detail = "") => {
  const line = `${ok ? "PASS" : "FAIL"}  ${name}${detail ? " :: " + detail : ""}`;
  results.push(line);
  console.log(line);
};

async function call(path, { method = "GET", body, token } = {}) {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* html error body */ }
  return { status: res.status, json };
}

// ---- adapter equivalents (mirrors src/utils/api.adapter.ts) ----
const normalizeProduct = (p) => {
  const raw = p.attributes ?? p.attribute;
  const attributes = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const category = p.category ?? { _id: p.category_id ?? "", name: "", slug: "" };
  const first = attributes[0] ?? {};
  const price = first.discount_price ?? first.total_price ?? first.original_price ?? p.sold;
  return { ...p, category, productAttributes: attributes, price };
};
const normalizeCart = (c) => {
  const rawCarts = Array.isArray(c.carts) ? c.carts : [];
  const items = rawCarts.map((item) => ({
    ...item,
    product_id: item.productDetails ?? item.product_id ?? {},
    productAttributeId: item.productAttributeId ?? item.product_attribute_id,
    quantity: item.quantity,
    price: item.price,
  }));
  return { ...c, items, carts: items, total_price: c.total_price ?? 0 };
};
const normalizeProfile = (p) => ({
  ...p,
  fullName: p.full_name ?? p.fullName ?? "",
  avatarUrl: p.avatar ?? p.avatarUrl ?? "",
  coverPhoto: p.thumbnail ?? p.cover_photo ?? "",
});

const main = async () => {
  // 1. register a fresh probe user
  const email = `verify.${Date.now()}@gmail.com`;
  const reg = await call("users/register", {
    method: "POST",
    body: { email, phone: "0912345678", full_name: "Verify User", password: "Verify@12345", confirm_password: "Verify@12345" },
  });
  check("POST users/register -> 201", reg.status === 201, `status=${reg.status} body=${JSON.stringify(reg.json).slice(0, 500)}`);
  const token = reg.json?.data?.access_token;
  const refresh = reg.json?.data?.refresh_token;
  check("register returns access_token + refresh_token", !!token && !!refresh);

  // 2. public product list
  const products = await call("products");
  check("GET products -> 200", products.status === 200, `status=${products.status}`);
  const list = (products.json?.data ?? []).map(normalizeProduct);
  check("product has productAttributes[]", Array.isArray(list[0]?.productAttributes) && list[0].productAttributes.length > 0,
    JSON.stringify(Object.keys(list[0]?.productAttributes?.[0] ?? {})));
  check("product has category.name", typeof list[0]?.category?.name === "string", list[0]?.category?.name);
  check("product has price (derived)", list[0]?.price !== undefined, `price=${list[0]?.price}`);
  const firstProduct = list[0];
  const attrId = firstProduct.productAttributes[0]._id;

  // 3. product detail
  const detail = await call(`products/${firstProduct._id}`);
  check("GET products/:id -> 200", detail.status === 200, `status=${detail.status}`);
  const d = normalizeProduct(detail.json?.data ?? {});
  check("detail attribute -> productAttributes[0]", d.productAttributes.length === 1 && !!d.productAttributes[0].weight);

  // 4. categories
  const cats = await call("categories");
  check("GET categories -> 200", cats.status === 200, `status=${cats.status}`);
  const catId = cats.json?.data?.[0]?._id;
  const byCat = await call(`products/categories/${catId}`);
  check("GET products/categories/:id -> 200", byCat.status === 200, `status=${byCat.status}`);

  // 5. suppliers
  const sup = await call("suppliers");
  check("GET suppliers -> 200", sup.status === 200, `status=${sup.status}`);

  // 6. search
  const search = await call("products/search?keyword=apple", { method: "POST", body: {} });
  check("POST products/search?keyword= -> 200", search.status === 200, `status=${search.status}`);
  check("search returns products[]", Array.isArray(search.json?.data));

  // 7. profile
  const prof = await call("users/@me/profile", { token });
  check("GET users/@me/profile -> 200", prof.status === 200, `status=${prof.status} body=${JSON.stringify(prof.json).slice(0,300)}`);
  const p = normalizeProfile(prof.json?.data ?? {});
  check("profile full_name -> fullName", typeof p.fullName === "string" && p.fullName.length > 0, p.fullName);
  check("profile role present", typeof p.role === "string", p.role);

  // 8. profile update
  const upd = await call("users/@me/profile", {
    method: "PUT", token,
    body: { full_name: "Verify User", phone: "0912345678", address: "123 Nguyen Hue Street, District 1", gender: "Male" },
  });
  check("PUT users/@me/profile -> 200", upd.status === 200, `status=${upd.status}`);

  // 9. carts GET
  const cart0 = await call("carts", { token });
  check("GET carts -> 200", cart0.status === 200, `status=${cart0.status}`);

  // 10. carts POST items (exact payload the frontend now sends)
  const add = await call("carts/items", {
    method: "POST", token,
    body: { items: [{ product_id: firstProduct._id, product_attribute_id: attrId, quantity: 2 }] },
  });
  check("POST carts/items -> 200", add.status === 200, `status=${add.status}`);
  const cartId = add.json?.data?._id;
  check("cart _id returned", !!cartId, `cartId=${cartId}`);

  // 11. carts GET after add -> items[] must be populated
  const cart1 = await call("carts", { token });
  const nc = normalizeCart(cart1.json?.data ?? {});
  check("cart.items[] populated", nc.items.length === 1, `items=${nc.items.length}`);
  check("cart item product_id has thumbnail_url", typeof nc.items[0]?.product_id?.thumbnail_url === "string");
  check("cart item productAttributeId present", !!nc.items[0]?.productAttributeId, nc.items[0]?.productAttributeId);
  check("cart total_price numeric", typeof nc.total_price === "number", `total=${nc.total_price}`);

  // 12. carts PUT items
  const put = await call(`carts/items/${cartId}`, {
    method: "PUT", token,
    body: { items: [{ product_id: firstProduct._id, product_attribute_id: attrId, quantity: 3 }] },
  });
  check("PUT carts/items/:cartId -> 200", put.status === 200, `status=${put.status}`);

  // 13. like / unlike
  const like = await call(`products/${firstProduct._id}/like`, { method: "POST", token, body: {} });
  check("POST products/:id/like -> 200", like.status === 200, `status=${like.status}`);
  const fav = await call("users/products/favorites", { token });
  check("GET users/products/favorites -> 200", fav.status === 200, `status=${fav.status}`);
  check("favorites contains liked product", fav.json?.data?.some((x) => x._id === firstProduct._id));
  const unlike = await call(`products/${firstProduct._id}/unlike`, { method: "POST", token, body: {} });
  check("POST products/:id/unlike -> 200", unlike.status === 200, `status=${unlike.status}`);

  // 14. orders GET
  const orders = await call("orders", { token });
  check("GET orders -> 200", orders.status === 200, `status=${orders.status}`);

  // 15. cart DELETE item
  const del = await call(`carts/items/${cartId}?product_id=${firstProduct._id}`, { method: "DELETE", token });
  check("DELETE carts/items/:cartId?product_id= -> 200", del.status === 200, `status=${del.status}`);

  // 16. logout
  const out = await call("users/logout", { method: "POST", token, body: { refresh_token: refresh } });
  check("POST users/logout -> 2xx", out.status >= 200 && out.status < 300, `status=${out.status}`);

  console.log(results.join("\n"));
  const failed = results.filter((r) => r.startsWith("FAIL")).length;
  console.log(`\nTOTAL=${results.length} FAILED=${failed}`);
};

main().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(1); });
