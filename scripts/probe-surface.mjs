const BASE = "https://agrimarket-z5f0.onrender.com/api/v1";

const paths = [
  // groups already integrated
  ["users/register", ["POST"]],
  ["users/login", ["POST"]],
  ["users/logout", ["POST"]],
  ["users/token/refresh", ["POST"]],
  ["users/@me/profile", ["GET", "PUT"]],
  ["users/password/change", ["POST"]],
  ["users/password/forgot", ["POST"]],
  ["users/password/forgot/authenticate", ["POST"]],
  ["users/password/reset", ["POST"]],
  ["users/otp/authenticate", ["POST"]],
  ["users/otp/revalidate", ["POST"]],
  ["products", ["GET"]],
  ["products/674331d6311874334634de60", ["GET", "PUT"]],
  ["products/categories/67c2020845dcd030137b4d3a", ["GET"]],
  ["products/search", ["POST"]],
  ["products/674331d6311874334634de60/like", ["POST"]],
  ["products/674331d6311874334634de60/unlike", ["POST"]],
  ["products?id=674331d6311874334634de60", ["DELETE"]],
  ["users/products/favorites", ["GET"]],
  ["categories", ["GET"]],
  ["categories/67c2020845dcd030137b4d3a", ["GET"]],
  ["suppliers", ["GET"]],
  ["suppliers/663ae8f0e4283648ab23666b", ["GET"]],
  ["carts", ["GET"]],
  ["carts/items", ["POST"]],
  ["carts/items/abc", ["PUT", "DELETE"]],
  ["orders", ["GET", "POST"]],
  // NEW groups discovered by probing
  ["banners", ["GET", "POST", "DELETE"]],
  ["banners/671be6a240f4b0b84b8c571c", ["GET", "PUT", "DELETE"]],
  ["blogs", ["GET", "POST", "DELETE"]],
  ["blogs/674c8ffaa6f6dc2213b4b57f", ["GET", "PUT", "DELETE"]],
  ["blogs/674c8ffaa6f6dc2213b4b57f/like", ["POST"]],
  ["blogs/674c8ffaa6f6dc2213b4b57f/comments", ["GET", "POST"]],
  ["blogs/674c8ffaa6f6dc2213b4b57f/comments/abc", ["DELETE"]],
  ["hashtags", ["GET", "POST", "DELETE"]],
  ["hashtags/674413762dae35194b40bb1b", ["GET", "PUT", "DELETE"]],
  ["hashtags/products", ["GET"]],
  ["hashtags/blogs", ["GET"]],
  ["hashtags/trending", ["GET"]],
  ["hashtags/search", ["GET"]],
  ["roles", ["GET", "POST", "DELETE"]],
  ["roles/admin", ["GET", "PUT", "DELETE"]],
  ["reports", ["GET", "POST", "DELETE"]],
  ["reports/abc", ["GET", "DELETE"]],
  ["stocks", ["GET", "POST", "DELETE"]],
  ["stocks/abc", ["GET", "PUT", "DELETE"]],
  ["products/674331d6311874334634de60/comments", ["GET", "POST"]],
  ["products/674331d6311874334634de60/comments/abc", ["DELETE"]],
  ["auth/users", ["GET"]],
  ["auth/users/login", ["POST"]],
  ["auth/users/register", ["POST"]],
  ["auth/users/logout", ["POST"]],
  ["auth/users/carts", ["GET"]],
  ["auth/users/orders", ["GET"]],
  ["auth/users/token", ["GET"]],
  ["auth/users/@me", ["GET"]],
  ["auth/users/products", ["GET"]],
  ["auth/users/password", ["GET"]],
  ["auth/users/otp", ["GET"]],
];

const results = [];

async function probe(path, method) {
  const url = `${BASE}/${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "GET" || method === "DELETE" ? undefined : "{}",
    });
    return res.status;
  } catch (e) {
    return `ERR:${e.message}`;
  }
}

for (const [path, methods] of paths) {
  const row = { path, statuses: {} };
  for (const m of methods) {
    row.statuses[m] = await probe(path, m);
    await new Promise((r) => setTimeout(r, 120));
  }
  results.push(row);
}

console.log(JSON.stringify(results, null, 1));
