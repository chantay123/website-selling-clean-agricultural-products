# 07. Chuẩn bị phỏng vấn (Part 14)

> Câu hỏi dành cho vị trí **Fresher / Junior Frontend & Fullstack**.
> Mỗi câu: ❓ Câu hỏi → 🎯 Đánh giá gì → 💬 Gợi ý trả lời → 💻 Code → ➕ Follow-up → ❌ Câu trả lời sai thường gặp.

---

## Mục lục

1. [HTML & CSS](#1-html--css)
2. [JavaScript](#2-javascript)
3. [TypeScript](#3-typescript)
4. [React](#4-react)
5. [Next.js](#5-nextjs)
6. [RESTful API](#6-restful-api)
7. [Axios & Fetch](#7-axios--fetch)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [JWT & Refresh Token](#9-jwt--refresh-token)
10. [Git & GitHub](#10-git--github)
11. [Database](#11-database)
12. [MongoDB](#12-mongodb)
13. [Node.js & Express](#13-nodejs--express)
14. [Debugging](#14-debugging)
15. [Performance](#15-performance-optimization)
16. [Security](#16-security)
17. [Software Architecture](#17-software-architecture)
18. [Câu hỏi về dự án Agrimarket](#18-câu-hỏi-về-dự-project-agrimarket)

---

# 1. HTML & CSS

### Q1.1. Semantic HTML là gì? Vì sao quan trọng?

🎯 Đánh giá: hiểu cấu trúc & accessibility.

💬 **Trả lời:** Semantic HTML dùng đúng thẻ theo ý nghĩa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) thay vì `<div>` cho mọi thứ. Nó giúp:
1. **SEO** — crawler hiểu cấu trúc trang.
2. **Accessibility** — screen reader điều hướng theo landmark.
3. **Maintainability** — dev đọc code hiểu ngay.

**Áp dụng:** trong `src/container/Payment/Payment.tsx` dùng `<table>`, `<thead>`, `<tbody>` đúng chuẩn cho dữ liệu dạng bảng.

❌ **Trả lời sai:** "Semantic HTML giúp code đẹp hơn."

---

### Q1.2. Box model là gì? `box-sizing: border-box` khác gì?

🎯 Đánh giá: nền tảng CSS layout.

```css
/* content-box (mặc định): width = width của content */
div { width: 200px; padding: 20px; border: 2px solid; }
/* tổng = 200 + 40 + 4 = 244px */

/* border-box: width bao gồm cả padding + border */
div { box-sizing: border-box; width: 200px; padding: 20px; border: 2px solid; }
/* tổng = 200px */
```

💬 **Trả lời:** `border-box` giúp tính toán kích thước dễ hơn — đặt width là kích thước thực tế hiển thị. Tailwind mặc định đã dùng `border-box` cho mọi element.

❌ **Trả lời sai:** "Box model chỉ có 1 kiểu."

---

### Q1.3. Flexbox vs Grid — khi nào dùng gì?

🎯 Đánh giá: layout hiện đại.

| | Flexbox | Grid |
|---|---|---|
| Chiều | 1 chiều (hàng hoặc cột) | 2 chiều (hàng + cột) |
| Dùng cho | thanh nav, list, canh giữa | layout trang, dashboard, card grid |
| Overflow | content quyết định | container quyết định |

💬 **Trả lời:** trong dự án, `src/components/CartProducts/CartProduct.tsx` dùng Flexbox (`<Flex wrap="wrap" gap="35px">`) để xếp card sản phẩm; Admin dùng `<Row>`/`<Col>` của antd (dựa trên Grid) cho layout cột.

---

### Q1.4. `rem` vs `px` vs `%`?

💬 **Trả lời:**
- `px` — pixel tuyệt đối, không đổi theo font-size user.
- `rem` — theo font-size gốc của `<html>` → hỗ trợ user tăng cỡ chữ (accessibility).
- `%` — theo phần tử cha → responsive.

**Áp dụng:** dự án dùng Tailwind (`text-4xl`, `ml-20`) → Tailwind dùng `rem` cho spacing & font-size, `px` cho width/height.

---

### Q1.5. Specificity (độ ưu tiên) trong CSS?

💬 **Trả lời:** Thứ tự (không có `!important`):
1. Inline style
2. ID (`#id`) — 100
3. Class (`.class`), pseudo-class (`:hover`), attribute (`[type="text"]`) — 10
4. Element (`div`), pseudo-element (`::before`) — 1

**Cách tính:** nhân số → `#a .b c` = 1×100 + 1×10 + 1×1 = 111.

---

### Q1.6. CSS specificity tie — cùng độ ưu tiên thì dùng quy tắc nào?

💬 **Trả lời:** Thứ tự xuất hiện trong stylesheet (file sau đè file trước), và `@media` không ảnh hưởng specificity.

---

# 2. JavaScript

### Q2.1. `var`, `let`, `const` — khác nhau thế nào?

💬 Xem `01-javascript-roadmap.md` § 1. Tóm tắt: `let`/`const` block-scoped, TDZ, `const` không gán lại. **Quy tắc: mặc định `const`, `let` khi cần gán lại.**

---

### Q2.2. Closure là gì? Cho ví dụ.

💬 **Trả lời:** Closure là hàm nhớ biến từ scope cha ngay cả khi scope cha đã kết thúc. Dùng cho encapsulation, tạo hàm riêng, memoization.

```javascript
function createCounter() {
  let count = 0;
  return { increment: () => ++count, get: () => count };
}
```

**Áp dụng:** `src/utils/api.adapter.ts` là các hàm thuần không closure; nhưng `src/utils/setting.ts` đóng gói state ẩn trong object `config` — pattern tương tự encapsulation.

---

### Q2.3. `this` hoạt động thế nào? `call`/`apply`/`bind`?

💬 **Trả lời:** `this` xác định theo thứ tự: `new` → `call/apply/bind` → method của object → arrow (không có `this` riêng) → global/undefined.

- `call(thisArg, a, b)` — tham số lẻ.
- `apply(thisArg, [a, b])` — mảng tham số.
- `bind(thisArg, a, b)` — trả hàm mới đã bind.

---

### Q2.4. Event loop hoạt động thế nào? Microtask vs Macrotask?

💬 **Trả lời:** Call stack → Web APIs → (microtask queue) → (macrotask queue) → render.

**Thứ tự:** code sync → hết microtask → mới tới macrotask.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 1, 4, 3, 2
```

---

### Q2.5. `async/await` khác Promise chain như thế nào?

💬 **Trả lời:** `async/await` là cú pháp sugar trên Promise. Ưu điểm: đọc tuyến tính, `try/catch` bắt được rejection. Điểm quan trọng: `try/catch` **không** bắt được lỗi async nếu không `await`.

---

### Q2.6. `==` vs `===`?

💬 **Trả lời:** `===` so sánh kiểu + giá trị, không ép kiểu. `==` ép kiểu theo bảng coercion. Luôn dùng `===` trong code thật.

---

### Q2.7. Shallow copy vs deep copy?

💬 **Trả lời:**
- `{...obj}`, `Object.assign({}, obj)`, `[...arr]` → shallow (copy 1 cấp).
- `structuredClone(obj)` → deep (native, hiện đại).
- `JSON.parse(JSON.stringify(obj))` → deep nhưng mất `Date`, `undefined`, `function`.

**Áp dụng:** `src/utils/api.adapter.ts` dùng spread — an toàn vì chỉ **thêm** alias, không mutate nested.

---

### Q2.8. Debounce vs Throttle?

💬 **Trả lời:**
- **Debounce** — chỉ gọi sau khi ngừng gọi trong `delay`. Dùng cho search/autocomplete.
- **Throttle** — gọi tối đa 1 lần mỗi `delay`. Dùng cho scroll/mousemove.

**Áp dụng:** ô tìm kiếm trong `src/components/Categories/Categories.tsx` nên debounce 300ms (hiện chưa áp dụng).

---

### Q2.9. Immutability tại sao quan trọng trong React?

💬 **Trả lời:** React so sánh state bằng `Object.is` (tham chiếu). Mutate object → cùng tham chiếu → React bỏ qua → UI không cập nhật.

**Áp dụng:** `setQuantities((prev) => ({ ...prev, [id]: ... }))` tạo object mới. Redux Toolkit dùng Immer nên mutation trong reducer là an toàn.

---

### Q2.10. `Promise.all` vs `Promise.allSettled` vs `Promise.race`?

💬 **Trả lời:**
- `all` — chờ tất cả, reject ngay khi 1 reject.
- `allSettled` — chờ tất cả, luôn resolve với mảng kết quả từng cái.
- `race` — lấy kết quả cái nào settle trước.

**Áp dụng:** trang Home nên dùng `allSettled` để `getCart()` fail (401) không làm hỏng danh sách sản phẩm.

---

# 3. TypeScript

### Q3.1. `type` vs `interface`?

💬 **Trả lời:**

| | `type` | `interface` |
|---|---|---|
| Primitive/union | ✅ | ❌ |
| Declaration merging | ❌ | ✅ |
| Error message | Đọc kiểu | "Interface 'X' incorrectly extends" (rõ hơn) |
| Dùng trong class `implements` | ✅ | ✅ (thường ưu tiên hơn) |

**Áp dụng:** dự án dùng `type` cho hầu hết (`productTypes`, `cartTypes`) và `type` cho generic envelope `apiResponseType<T>`.

---

### Q3.2. `any` vs `unknown`?

💬 **Trả lời:** `any` tắt type check hoàn toàn. `unknown` là kiểu "an toàn tối thiểu" — phải narrow trước khi dùng. `unknown` là lựa chọn đúng cho dữ liệu từ nguồn ngoài.

**Áp dụng:** `src/utils/api.adapter.ts` dùng `type LooseRecord = Record<string, unknown>` thay vì `any`.

---

### Q3.3. Generics dùng để làm gì?

💬 **Trả lời:** Giữ thông tin kiểu gốc trong khi vẫn cho phép mở rộng. Quan trọng nhất: **type-safe API client**.

```typescript
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};

const payload = response.data as apiResponseType<productTypes[]>;
payload.data  // productTypes[]
```

---

### Q3.4. `unknown` vs generic `T extends unknown` khi nào dùng?

💬 **Trả lời:** `unknown` khi không cần biết kiểu cụ thể (chỉ cần an toàn). Generic khi cần **giữ** kiểu gốc qua hàm.

```typescript
// Giữ kiểu gốc
export const normalizeProduct = <T extends LooseRecord>(product: T) => ({
  ...product,
  productAttributes: [...],
});
```

---

### Q3.5. Type narrowing là gì? Type guard tự viết?

💬 **Trả lời:** TS tự thu hẹp kiểu trong `if (typeof x === "string")`, `instanceof`, `in`, `=== null`, `Array.isArray`. Type guard tự viết dùng `x is T`:

```typescript
function isProduct(x: unknown): x is Product {
  return typeof x === "object" && x !== null && "name" in x;
}
```

---

### Q3.6. Utility types thường dùng?

💬 **Trả lời:** `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`.

**Áp dụng:** `extendedProductType = productTypes & { key: string }` — intersection để thêm `key` cho Ant Design Table.

---

### Q3.7. `strict: true` bật những gì?

💬 **Trả lời:** `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `useUnknownInCatchVariables`.

**Quan trọng nhất:** `strictNullChecks` — bắt lỗi phổ biến nhất (`null`/`undefined` gán cho kiểu khác).

---

### Q3.8. TypeScript có bảo vệ runtime không?

💬 **Trả lời:** **Không.** Types bị xoá khi compile. TS bảo vệ lúc viết code; runtime cần validation (zod, class-validator) hoặc defensive coding (`?.`, `??`).

**Áp dụng:** dữ liệu từ API là nguồn không tin được → `src/utils/api.adapter.ts` dùng `??` và `Array.isArray` guard ở mọi nơi.

---

# 4. React

### Q4.1. `useState` vs `useReducer`?

💬 **Trả lời:**
- `useState` — state đơn giản, đổi trực tiếp.
- `useReducer` — logic phức tạp, nhiều state liên quan, cần action có kiểu rõ ràng.

**Áp dụng:** dự án dùng `useState` ở component và Redux Toolkit (`createSlice` — chính là mẫu reducer) cho state toàn cục.

---

### Q4.2. `useEffect` chạy khi nào? Dependency array?

💬 **Trả lời:** Chạy sau render. `[]` → 1 lần khi mount. `[a, b]` → chạy lại khi `a`/`b` đổi (so sánh `Object.is`). Không truyền → mỗi render.

**Phải cleanup** khi effect tạo tài nguyên (timer, listener, subscription).

---

### Q4.3. Rules of Hooks?

💬 **Trả lời:**
1. Chỉ gọi Hook ở **top level** của function component.
2. Không gọi trong loop, condition, `if`, hay event handler.
3. Chỉ gọi trong function component hoặc custom hook.

**Áp dụng:** đã gặp lỗi `useEffect` trong event handler tại `src/components/Categories/Categories.tsx` → đã sửa.

---

### Q4.4. `useMemo` vs `useCallback` — khi nào dùng?

💬 **Trả lời:**
- `useMemo` — cache **giá trị** (kết quả tính, object/array).
- `useCallback` — cache **hàm**.

**Chỉ dùng khi có lợi ích thật:** truyền cho `React.memo` component, hoặc phụ thuộc của `useEffect`. Không dùng "để tối ưu" chung — overhead > lợi ích.

**Áp dụng:** danh sách ≤ 8 sản phẩm trong dự án → chưa cần memoization.

---

### Q4.5. `useRef` khác `useState`?

💬 **Trả lời:** `useState` gây re-render; `useRef` không. `useRef.current` đọc/ghi đồng bộ, dùng cho DOM node, timer id, giá trị "latest".

**Áp dụng:** mảng 6 ô OTP trong `Verification.tsx` dùng `useRef` để focus, không dùng `useState` cho DOM node.

---

### Q4.6. Khi nào component re-render?

💬 **Trả lời:** (1) `setState` của chính nó, (2) props đổi, (3) `useSelector` trả giá trị mới, (4) `useContext` value đổi, (5) parent re-render.

**Cách giảm:** selector hẹp, `React.memo`, `useMemo`/`useCallback`, cấu chuyển state.

---

### Q4.7. `key` trong `map` — tại sao quan trọng?

💬 **Trả lời:** React dùng key để định danh component giữa các lần render. Key theo index → khi sort/reorder/filter, React tái sử dụng component cũ → state bị gán nhầm → hiển thị sai.

**Áp dụng:** `Payment.tsx` đang dùng `key={index}` → nên đổi sang `cart.product_id._id`.

---

### Q4.8. Controlled vs Uncontrolled input?

💬 **Trả lời:** Controlled — state trong React, đọc qua `value`. Uncontrolled — DOM giữ state, đọc qua `ref`.

**Áp dụng:** ô OTP là controlled (cần validate từng ký tự + auto-focus). Ant Design `Form` quản lý state nội bộ.

---

### Q4.9. Custom hook là gì? Khi nào tách?

💬 **Trả lời:** Hàm bắt đầu bằng `use`, dùng hook khác bên trong, chia sẻ logic có state. Tách khi logic **dùng lại ≥ 2 chỗ** hoặc tách để component gọn hơn.

**Áp dụng:** logic fetch sản phẩm đang lặp ở `CartProduct.tsx`, `Cart.tsx`, `Admin.tsx`, `ProductAdmin.tsx` → cơ hội tách `useProducts()`.

---

### Q4.10. Error Boundary? Có bắt được lỗi async không?

💬 **Trả lời:** Error Boundary bắt lỗi **render** (và lifecycle). Không bắt được lỗi trong event handler, async function, hay server-side rendering. Bắt buộc là **class component**.

**Áp dụng:** dự án chưa có → đề xuất bọc `<Routes>`.

---

### Q4.11. `React.lazy` + `Suspense` — lợi ích?

💬 **Trả lời:** Code splitting theo route → giảm bundle ban đầu. `Suspense` hiển thị fallback trong lúc chờ chunk.

**Áp dụng:** `src/routes/routes.ts` lazy-load **toàn bộ** 16 route → user chỉ tải chunk cần dùng.

---

### Q4.12. StrictMode ở React 18 mount 2 lần — lỗi à?

💬 **Trả lời:** Không phải lỗi. React 18 cố tình mount → unmount → mount để phát hiện effect không cleanup. Nếu cleanup đúng thì lần 2 hoàn hành bình thường.

---

# 5. Next.js

### Q5.1. Next.js khác Vite React SPA như thế nào?

💬 **Trả lời:**

| | Vite SPA (Agrimarket) | Next.js |
|---|---|---|
| Rendering | CSR | SSR/SSG/ISR/CSR |
| Routing | `react-router-dom` (thủ công) | File-based |
| Backend | Riêng | API routes tích hợp |
| SEO | Yếu | Mạnh |

**Áp dụng:** Agrimarket dùng Vite + React Router, tất cả là CSR. Nếu cần SEO cho trang sản phẩm thì chuyển sang Next.js với SSG là hợp lý.

---

### Q5.2. Pages Router vs App Router?

💬 **Trả lời:**

| | Pages | App |
|---|---|---|
| Thư mục | `pages/` | `app/` |
| Data fetching | `getServerSideProps`/`getStaticProps` | async Server Component |
| API routes | `pages/api/*` | `app/api/*/route.ts` |
| Layout | `_app.tsx` | `app/layout.tsx` |
| Rendering mặc định | Client | Server Components |

---

### Q5.3. `getServerSideProps` vs `getStaticProps` vs `getStaticPaths`?

💬 **Trả lời:**
- `getServerSideProps` — render mỗi request (SSR). Dùng cho data theo user / real-time.
- `getStaticProps` — build 1 lần (SSG). Dùng cho data tĩnh.
- `getStaticPaths` + `getStaticProps` — pre-render các path động (SSG + dynamic route).

---

### Q5.4. API Routes trong Next.js?

💬 **Trả lời:** `pages/api/hello.ts` (Pages) hoặc `app/api/hello/route.ts` (App) → export `GET/POST/...`. Chạy server-side → dùng được `process.env` cho secret (không phải `NEXT_PUBLIC_`).

---

### Q5.5. Middleware trong Next.js dùng để làm gì?

💬 **Trả lời:** Chạy trước khi render route, ở edge runtime. Dùng cho: auth guard, redirect, geo/IP, A/B test, rewrite.

**Áp dụng:** nếu Agrimarket chuyển sang Next.js → `middleware.ts` là nơi đúng để guard `/admin` và `/payment` bằng cookie, thay vì check trong component.

---

### Q5.6. `NEXT_PUBLIC_` vs biến thường?

💬 **Trả lời:** `NEXT_PUBLIC_*` được **inject vào bundle client** → công khai, ai cũng đọc được. Biến thường chỉ có ở server → dùng cho secret. Tương đương Vite: `VITE_*` = public.

**Liên hệ yêu cầu task:** Swagger credentials phải được load từ server-side, không đưa vào `NEXT_PUBLIC_`/biến client.

---

### Q5.7. Image optimization của Next.js?

💬 **Trả lời:** `<Image>` tự sinh `srcset`, chọn size phù hợp, lazy-load mặc định, blur placeholder, chống CLS. Đòi hỏi `width`/`height` hoặc `fill`.

**Áp dụng:** dự án dùng `<img>` thuần với URL từ API → nên thêm `loading="lazy"` + `decoding="async"`.

---

# 6. RESTful API

### Q6.1. REST là gì? Các thành phần?

💬 **Trả lời:** **Representational State Transfer** — mô hình kiến trúc dựa trên HTTP. Ràng buộc:
1. **Client–Server** — tách biệt.
2. **Stateless** — mỗi request chứa đủ thông tin.
3. **Cacheable** — response có header cache.
4. **Uniform Interface** — URI thống nhất cho resource.
5. **Layered System** — có thể đặt proxy/gateway.

---

### Q6.2. HTTP methods — ý nghĩa?

| Method | Ý nghĩa | Idempotent | Trong dự án |
|--------|---------|------------|------------|
| GET | Đọc | ✅ | `GET /products` |
| POST | Tạo | ❌ | `POST /users/register` |
| PUT | Thay thế toàn bộ | ✅ | `PUT /users/@me/profile` |
| PATCH | Sửa một phần | ❌ | (không dùng) |
| DELETE | Xoá | ✅ | `DELETE /products?id=` |

**Lưu ý:** `PUT /carts/items/:cartId` cập nhật số lượng → về mặt REST nên là PATCH, nhưng backend quy định PUT → frontend tuân theo backend.

---

### Q6.3. Status codes thường gặp?

| Code | Ý nghĩa | Gặp ở đâu trong dự án |
|------|---------|------------------------|
| 200 | OK | `GET /products` |
| 201 | Created | `POST /users/register` |
| 400 | Bad Request | Sai payload, sai format |
| 401 | Unauthorized | Chưa đăng nhập / token hết hạn |
| 403 | Forbidden | Đã đăng nhập nhưng thiếu quyền |
| 404 | Not Found | Sai path |
| 409 | Conflict | Trùng email |
| 500 | Internal Server Error | `Failed to send OTP` |

---

### Q6.4. `idempotent` nghĩa là gì? Vì sao quan trọng?

💬 **Trả lời:** Gọi N lần cho cùng tác động như gọi 1 lần. Quan trọng cho retry: nếu server bị timeout nhưng đã xử lý, retry lại có thể tạo trùng.

**Áp dụng:** `POST /orders` **không** idempotent → cần `Idempotency-Key` header để tránh tạo đơn trùng khi user bấm nhiều lần.

---

### Q6.5. Phân trang — offset vs cursor?

| | Offset (`?page=2&limit=20`) | Cursor (`?cursor=abc`) |
|---|---|---|
| Trang đầu | Nhanh | Nhanh |
| Trang sâu | Chậm (offset scan) | Nhanh |
| Trang mới thêm | Dữ liệu bị trôi | Ổn định |
| Số trang tổng | Có | Không |

**Áp dụng:** `GET /products` hiện trả toàn bộ — backend nên hỗ trợ `page`/`limit` + `meta`.

---

### Q6.6. Phân biệt 401 vs 403?

💬 **Trả lời:**
- **401 Unauthorized** — "Ai là bạn?" Không có token / token không hợp lệ / hết hạn. Client nên refresh hoặc login lại.
- **403 Forbidden** — "Bạn là ai, nhưng không đủ quyền." Token hợp lệ nhưng role không đủ.

**Áp dụng:** `src/utils/interceptors.tsx` xử lý 401 bằng refresh flow. 403 nên hiện thông báo "không đủ quyền".

---

### Q6.7. API versioning?

💬 **Trả lời:** Đưa version vào path (`/api/v1/...`) hoặc header. Dự án dùng `/api/v1` → khi có breaking change sẽ ra `/api/v2`, giữ song song để client cũ không gãy.

---

# 7. Axios & Fetch

### Q7.1. Axios vs Fetch?

| | Axios | Fetch |
|---|---|---|
| JSON | Tự stringify/parse | Phải `.json()` |
| Timeout | Có sẵn | Không (dùng `AbortSignal`) |
| Interceptor | ✅ | ❌ (phải tự viết wrapper) |
| Error | Tạo `AxiosError` có `response` | Chỉ `TypeError` khi network fail |
| Progress | Có | Không (cần stream) |
| Cancel | `CancelToken` (mới: `AbortSignal`) | `AbortController` |

**Áp dụng:** dự án dùng Axios vì cần interceptor cho token refresh.

---

### Q7.2. Interceptor là gì?

💬 **Trả lời:** Hàm chạy trước/sau mỗi request/response. Request interceptor → gắn header. Response interceptor → xử lý lỗi chung.

**Áp dụng:** `src/utils/interceptors.tsx`:
- Request: gắn `Authorization: Bearer <access_token>`.
- Response: bắt 401 → refresh → retry 1 lần.

---

### Q7.3. `credentials: "include"` khi nào cần?

💬 **Trả lời:** Khi cần gửi cookie cross-origin (đặc biệt `SameSite=None` giữa các domain khác nhau). `fetch` mặc định `same-origin` → không gửi cookie cross-origin.

**Áp dụng:** refresh token trong cookie → nếu gọi `POST /users/token/refresh` bằng `fetch` từ domain khác thì cần `credentials: "include"`. Dự án gọi bằng `axios` với `refresh_token` trong body → không cần cookie.

---

### Q7.4. Cách huỷ request?

💬 **Trả lời:**

```javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();
```

Axios (≥ 0.22): `axios.get(url, { signal: controller.signal })`.

**Áp dụng:** search nên dùng `AbortController` để huỷ request cũ khi có request mới → tránh race condition.

---

### Q7.5. Xử lý lỗi API thế nào cho chuẩn?

💬 **Trả lời:**

```typescript
// 1. Chuẩn hoá lỗi về 1 nơi
export const getApiErrorMessage = (error: unknown, fallback: string): string => { ... };

// 2. Xử lý ở ranh giới component
try {
  const response = await createOrder({ ... });
  toast.success(response.message);
} catch (error) {
  toast.error(getApiErrorMessage(error, "Lỗi thanh toán"));
}
```

**Áp dụng:** `src/utils/api.adapter.ts` → `getApiErrorMessage` đọc `data.message` → `errors[field].msg` → `error.message` → fallback.

---

# 8. Authentication & Authorization

### Q8.1. Authentication vs Authorization?

💬 **Trả lời:**
- **Authentication** — xác thực "bạn là ai?" (login, token, OTP).
- **Authorization** — phân quyền "bạn được làm gì?" (role, permission).

**Áp dụng:** dự án tách rõ:
- Auth: `POST /users/login`, `POST /users/otp/authenticate`.
- Authorization: `GET /users/@me/profile` → `role` → `setAdminStatus`.

---

### Q8.2. Session vs JWT?

| | Session | JWT |
|---|---|---|
| Lưu token | Server (cookie id) | Client |
| Revoke | Dễ (xoá session) | Khó (cần blacklist / refresh rotation) |
| Payload | Chỉ id | Chứa claims (role...) |
| Scale | Cần shared store | Stateless, dễ scale |

**Áp dụng:** dự án dùng **hybrid**: access token JWT (stateless) + refresh token lưu server-side (có thể revoke → `POST /users/logout`).

---

### Q8.3. Route guard trong React Router?

💬 **Trả lời:**

```typescript
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
```

**Áp dụng:** dự án chưa có route guard component. `MainProfile.tsx` check trong `useEffect` → `navigate("/login")`; `Admin.tsx` dùng cờ `profileChecked` → chỉ `navigate("*")` sau khi profile đã về (tránh redirect oan lúc đang load).

**Đề xuất:** tách thành `<ProtectedRoute>` và `<AdminRoute>` để nhất quán.

---

### Q8.4. Phân biệt admin và user trong dự án?

💬 **Trả lời:** Backend trả `role` trong `GET /users/@me/profile` và trong response của `POST /users/login`. Frontend dispatch `setAdminStatus(role === "Admin")`. Trang admin kiểm tra `state.user.isAdmin`.

**Lưu ý quan trọng:** đây chỉ là **UI guard**. Backend phải kiểm tra role trên mọi endpoint admin — nếu không, bất kỳ ai gọi API trực tiếp cũng xoá được sản phẩm.

---

# 9. JWT & Refresh Token

### Q9.1. JWT gồm những gì?

💬 **Trả lời:** `header.payload.signature` (Base64URL). Payload chứa claims (`sub`, `iat`, `exp`, `role`). **Không mã hoá** — chỉ base64, ai cũng đọc được → không chứa secret trong payload.

---

### Q9.2. Access token vs Refresh token?

| | Access token | Refresh token |
|---|---|---|
| Sống | Ngắn (5–15 phút) | Dài (vài ngày) |
| Gửi mỗi request | ✅ | ❌ |
| Lưu ở | Memory / localStorage | httpOnly cookie |
| Mục đích | Xác thực API | Lấy access token mới |

**Áp dụng:** dự án đúng chuẩn: access token ngắn hạn trong `localStorage`, refresh token dài hạn trong cookie 7 ngày.

---

### Q9.3. Silent refresh hoạt động thế nào?

💬 **Trả lời:** Response interceptor bắt 401 → gọi `POST /users/token/refresh` → lưu token mới → replay request gốc → user không bị logout.

**Áp dụng — `src/utils/interceptors.tsx`:**

```typescript
if (status === 401 && originalRequest && !originalRequest._retried) {
  originalRequest._retried = true;             // chỉ retry 1 lần
  const newToken = await refreshAccessToken();
  if (newToken) {
    originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
    return instance.request(originalRequest);
  }
  clearTokens();
  window.location.href = "/login";
}
```

➕ **Follow-up:** "Tại sao cờ `_retried`?" → tránh vòng lặp vô hạn khi refresh token cũng hết hạn.

➕ **Follow-up:** "Nếu 5 request cùng lúc 401?" → nên dedupe: dùng 1 promise refresh chung. (Hiện tại chưa làm — cơ hội cải tiến.)

---

### Q9.4. Refresh token rotation là gì?

💬 **Trả lời:** Mỗi lần refresh, server trả **refresh token mới** và vô hiệu hoá token cũ. Nếu token cũ bị dùng lại → server phát hiện bất thường → huỷ toàn bộ session (có thể là dấu hiệu token bị đánh cắp).

**Quan sát được:** response refresh trả cả `access_token` lẫn `refresh_token` → backend **đã** triển khai rotation.

---

### Q9.5. Token lưu localStorage có an toàn không?

💬 **Trả lời:** **Không hoàn toàn.** Bất kỳ script nào chạy trên trang (XSS) đều đọc được `localStorage`. Cookie `httpOnly` thì JS không đọc được → chống được đánh cắp qua XSS.

**Giảm thiểu:** CSP header, sanitize input, tránh `dangerouslySetInnerHTML`, escape output.

**Áp dụng:** đề xuất cho dự án — để **backend** set refresh token cookie với `httpOnly; Secure; SameSite=Strict`.

---

### Q9.6. Logout cần gọi API không?

💬 **Trả lời:** **Có.** Chỉ xoá token ở client không vô hiệu hoá refresh token trên server → attacker vẫn dùng được. `POST /users/logout` là **server-side session invalidation**.

**Áp dụng:** `src/components/HeaderItem/HeaderItem.tsx` gọi `logoutApi(refreshToken)` rồi mới `clearTokens()`.

---

# 10. Git & GitHub

### Q10.1. Các lệnh Git thường dùng?

```bash
git status              # trạng thái
git diff                # thay đổi chưa stage
git diff --staged       # thay đổi đã stage
git add <file>          # stage
git commit -m "msg"     # commit
git log --oneline       # lịch sử
git switch -c <branch>  # tạo + chuyển branch
git restore <file>      # bỏ thay đổi (chưa stage)
git reset               # bỏ stage (giữ thay đổi)
git revert <commit>     # tạo commit đảo ngược (an toàn cho shared branch)
```

---

### Q10.2. Conventional Commits là gì?

💬 **Trả lời:** Quy ước commit message: `<type>(<scope>): <subject>`.

| Type | Ý nghĩa |
|------|---------|
| `feat` | Tính năng mới |
| `fix` | Sửa bug |
| `refactor` | Tái cấu trúc, không đổi hành vi |
| `docs` | Tài liệu |
| `test` | Test |
| `chore` | Việc vặt (deps, config) |

**Áp dụng:** các commit trong task này:
```
feat(api): integrate auth, profile and core API layer with normalization adapter
feat(ui): wire cart, checkout, favorites, categories and admin screens to live APIs
```

---

### Q10.3. `git reset` vs `git revert`?

💬 **Trả lời:**
- `reset` — di chuyển con trỏ commit, **viết lại lịch sử**. Dùng cho commit local chưa push.
- `revert` — tạo commit mới đảo ngược. Dùng cho commit đã push (an toàn, lịch sử không bị viết lại).

**Áp dụng:** trong task này chỉ dùng `reset` trên staging area, không viết lại lịch sử đã có.

---

### Q10.4. `.gitignore` là gì? Vì sao cần ignore `.env`?

💬 **Trả lời:** File chỉ định pattern file không track. `.env` chứa secret (API key, DB password) → commit = lộ secret vĩnh viễn trong lịch sử.

**Áp dụng:** `.env` đã được thêm vào `.gitignore` và `git rm --cached .env` trong commit `128b37c`.

➕ **Follow-up:** "File đã commit trước đó chứa secret thì sao?" → phải **rotate secret** (đổi trên provider) + `git filter-repo`/`BFG` để xoá khỏi history.

---

### Q10.5. Khi nào dùng `git stash`?

💬 **Trả lời:** Tạm cất thay đổi chưa commit để switch branch hoặc xử lý conflict. `git stash` lưu, `git stash pop` khôi phục.

---

# 11. Database

### Q11.1. SQL vs NoSQL?

| | SQL (relational) | NoSQL (document) |
|---|---|---|
| Schema | Cố định | Linh hoạt |
| Quan hệ | Foreign key, JOIN | Embed / reference |
| Scale | Vertical (dễ) | Horizontal (dễ) |
| Transaction | Mạnh | Yếu hơn (trước MongoDB 4.0) |

**Áp dụng:** dự án dùng **MongoDB** (Atlas) — dữ liệu sản phẩm có thuộc tính động (weight, certification, harvest_date…) → NoSQL hợp lý.

---

### Q11.2. Index là gì? Trade-off?

💬 **Trả lời:** Cấu trúc dữ liệu phụ (thường B-tree) giúp truy vấn nhanh, đánh đổi: **tốn storage** và **chậm insert/update/delete**.

**Quy tắc:** index trên field hay filter/sort, và đừng index mọi thứ.

---

### Q11.3. Normalization vs Denormalization?

💬 **Trả lời:**
- **Normalization** — tách bảng, giảm dư thừa, JOIN để lấy. Ít lỗi nhất quán, nhiều JOIN.
- **Denormalization** — lưu trùng lặp để đọc nhanh. Ít JOIN, nhưng phải đồng bộ.

**Áp dụng:** `GET /products` trả sẵn `category` đã populate → denormalize ở tầng đọc. Cart trả `productDetails` nhúng → tiện cho UI, đánh đổi là dữ liệu có thể stale.

---

### Q11.4. N+1 query problem?

💬 **Trả lời:** Query 1 lấy danh sách, rồi query lặp lại cho mỗi item → N+1 request.

```javascript
// ❌
const products = await Product.find();
for (const p of products) p.category = await Category.findById(p.category_id);

// ✅
const products = await Product.find().populate("category_id");
```

**Áp dụng:** backend đã populate `category` cho list endpoint → tránh được N+1.

---

### Q11.5. Transaction là gì? Khi nào cần?

💬 **Trả lời:** Nhóm thao tác phải cùng thành công hoặc cùng thất bại (ACID).

**Áp dụng:** tạo order phải: (1) tạo order, (2) trừ stock, (3) xoá item giỏ — nên trong transaction. Nếu (2) fail mà (1) đã xong → order không có hàng.

---

# 12. MongoDB

### Q12.1. Document vs Collection?

💬 **Trả lời:** Collection = tập hợp document (tương đương bảng). Document = JSON object (tương đương row). Field = key trong document (tương đương column).

**Áp dụng:** `products`, `users`, `carts`, `orders`, `categories`, `suppliers`.

---

### Q12.2. `_id` là gì?

💬 **Trả lời:** MongoDB tự sinh `ObjectId` 12 byte: 4 byte timestamp + 5 byte random + 3 byte counter. Đây là `_id` mà frontend dùng làm `product._id`.

---

### Q12.3. `populate` là gì?

💬 **Trả lời:** Thay thế `ObjectId` bằng document đầy đủ khi query (populate = join thủ công của Mongoose).

**Quan sát:** `GET /products` có `category` populated; `GET /products/:id` có `attribute` (số ít) → có thể dùng `$slice` hoặc populate giới hạn.

---

### Q12.4. Aggregation pipeline là gì?

💬 **Trả lời:** Pipeline các stage (`$match`, `$group`, `$sort`, `$limit`, `$project`, `$lookup`) để transform document. Giống SQL `GROUP BY` + `JOIN`.

**Áp dụng:** thống kê doanh thu theo category cho `SalesFunnelChart` trong Admin (hiện chưa có endpoint).

---

### Q12.5. Schema validation trong MongoDB?

💬 **Trả lời:** `$jsonSchema` validator cho collection, hoặc Mongoose schema. Tương đương `class-validator` ở tầng NestJS.

**Quan sát:** backend trả error shape `{ type: "field", msg, path }` → dùng `class-validator` + `ValidationPipe` ở tầng NestJS.

---

# 13. Node.js & Express

### Q13.1. Event loop trong Node.js khác trình duyệt thế nào?

💬 **Trả lời:** Cùng nguyên lý, nhưng có **phases** riêng: `timers` → `pending callbacks` → `poll` (I/O) → `check` (setImmediate) → `close callbacks`. `process.nextTick` chạy trước `Promise.then`.

**Áp dụng:** `process.nextTick` và `setImmediate` quyết định thứ tự trong callback của NestJS.

---

### Q13.2. `req` vs `res` vs `next()` trong middleware?

💬 **Trả lời:** Middleware là hàm `(req, res, next)`:
- `req` — request (method, params, query, body, headers).
- `res` — response (status, json, send, cookie).
- `next()` — chuyển sang middleware tiếp theo.

**Áp dụng:** guard JWT trong NestJS là middleware dạng `CanActivate`.

---

### Q13.3. NestJS — `@Controller`, `@Get`, `@UseGuards`?

💬 **Trả lời:**
- `@Controller("users")` — prefix route.
- `@Get(":id")` — handler.
- `@UseGuards(JwtAuthGuard)` — bảo vệ route.
- `@Body()` + DTO + `ValidationPipe` — validate input.

**Áp dụng:** `GET /users/@me/profile` có `JwtAuthGuard` + `RolesGuard` (role từ token), trả 401 nếu thiếu token.

---

### Q13.4. Exception Filter trong NestJS?

💬 **Trả lời:** Bọc lỗi thành response thống nhất. NestJS có `HttpException` filter mặc định; custom filter để format `{ message, errors }` → đúng shape mà `getApiErrorMessage` đang đọc.

---

# 14. Debugging

### Q14.1. Quy trình debug của bạn?

💬 **Trả lời (theo framework trong `06-problem-solving.md`):**
1. **Hiểu** — expected vs actual, reproduce steps.
2. **Tìm nguồn** — trace từ UI → handler → API → transport → backend.
3. **Debug** — Network tab (URL, headers, payload, response), Console, React DevTools, Redux DevTools.
4. **Root cause** — phân biệt lỗi frontend (sai endpoint/payload/mapping) vs backend.
5. **Sửa** — thay đổi nhỏ nhất, đúng tầng, giữ kiến trúc.
6. **Verify** — test lại + edge case + regression + `tsc`/`lint`/`build`.
7. **Document** — ghi root cause, giải pháp, file đã sửa.

---

### Q14.2. `console.log` ở đâu trong flow?

💬 **Trả lời:** Thứ tự kiểm tra: Network tab → Response payload → State trong Redux DevTools → Component props (React DevTools) → Giá trị biến (`debugger`).

**Lưu ý:** `console.log` trong production có thể lộ dữ liệu nhạy cảm → dùng logger có level, tắt ở production.

---

### Q14.3. Đọc stack trace như thế nào?

💬 **Trả lời:** Đọc **từ dưới lên trên** — frame gần nhất với file của bạn là nơi phát sinh lỗi; frame trên là nơi lỗi được gọi.

**Áp dụng:** trong `src/utils/api.adapter.ts`, `getApiErrorMessage` dùng duck typing vì lỗi có thể đến từ nhiều nguồn (axios, fetch, throw thủ công) → không dựa vào `instanceof`.

---

### Q14.4. Sửa bug nào khó nhất trong dự án?

💬 **Trả lời (chọn 1 — nên chuẩn bị sẵn):**

**Option A — Cart 400:** Triệu chứng là toast lỗi khi bấm "Add to cart". Root cause: backend yêu cầu `product_attribute_id` nhưng frontend chỉ gửi `product_id`. Bài học: **luôn đọc contract API trước khi gửi payload**, và error 400 thường có `errors` chi tiết — đọc message cụ thể thay vì "Validation error".

**Option B — Admin loop:** Triệu chứng là hàng trăm request `/suppliers`. Root cause: gọi API trong render body → dispatch → re-render → gọi lại. Bài học: **render phải thuần khiết quả**, mọi side-effect phải trong `useEffect`.

**Option C — Deep-link 404:** Triệu chức là mở `/product/:id` trực tiếp ra trang 404. Root cause: component phụ thuộc state của trang khác thay vì tự fetch theo route param. Bài học: **component nên tự chịu trách nhiệm dữ liệu nó cần**.

---

# 15. Performance optimization

### Q15.1. Làm sao để tối ưu performance của một React app?

💬 **Trả lời theo thứ tự ưu tiên:**
1. **Đo trước** (React DevTools Profiler, Lighthouse, Network tab) — không tối ưu mù.
2. **Giảm số request** — dedupe, cache, chỉ gọi khi cần, pagination.
3. **Giảm bundle** — code splitting (`React.lazy`), tree-shaking, lazy load thư viện nặng.
4. **Giảm re-render** — selector hẹp, `React.memo`, `useMemo`/`useCallback` khi có lợi ích.
5. **Tối ưu asset** — lazy image, resize, WebP, CDN.
6. **Cache phía server** — Redis, `Cache-Control`, `ETag`.

**Áp dụng:** dự án đã làm #3 (lazy routes), #4 (selector hẹp ở HeaderItem). Còn lại: dedupe `getCart`, debounce search, `loading="lazy"` cho ảnh.

---

### Q15.2. `React.memo` — khi nào KHÔNG dùng?

💬 **Trả lời:** Khi component nhẹ, hoặc props thay đổi mỗi render (object/array inline) → memo vô dụng nhưng vẫn tốn overhead so sánh props.

**Áp dụng:** danh sách ≤ 8 sản phẩm → chưa cần.

---

### Q15.3. `useMemo`/`useCallback` — khi nào KHÔNG dùng?

💬 **Trả lời:** Khi phép tính rẻ và giá trị không truyền cho component `memo` hay không phải dep của `useEffect`. Chúng có overhead (so sánh deps + cấp phát).

---

### Q15.4. Debounce search — implement thế nào?

```typescript
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

➕ **Follow-up:** "Thêm race condition protection?" → dùng `AbortController` hoặc sequence number.

---

### Q15.5. Code splitting lợi ích thế nào?

💬 **Trả lời:** Giảm bundle ban đầu → First Contentful Paint nhanh hơn, đặc biệt trên mobile & mạng chậm. Trade-off: nhiều request HTTP nhỏ hơn (giải quyết bằng HTTP/2).

**Áp dụng:** `src/routes/routes.ts` lazy-load 16 route → user tải đúng chunk cần.

---

# 16. Security

### Q16.1. XSS và cách phòng chống?

💬 **Trả lời:** Chèn script độc hại qua input không escape. Phòng chống:
1. **Escape output** — React tự làm trong JSX. Tránh `dangerouslySetInnerHTML`.
2. **Sanitize** — DOMPurify khi cần render HTML.
3. **CSP** — header giới hạn nguồn script.
4. **Validate input** — server-side.

**Áp dụng:** dự án không dùng `dangerouslySetInnerHTML` → an toàn.

➕ **Follow-up:** "Token trong localStorage có dính XSS không?" → có, JS đọc được. Nên cân nhắc httpOnly cookie.

---

### Q16.2. CSRF và cách phòng chống?

💬 **Trả lời:** Trình duyệt tự gửi cookie cross-site → website độc hại kích hoạt request giả.
Phòng chống: `SameSite` cookie, CSRF token, hoặc **không dùng cookie cho auth** (dùng `Authorization` header).

**Áp dụng:** access token qua header → không dính CSRF. Refresh token cookie nên có `SameSite`.

---

### Q16.3. NoSQL injection?

💬 **Trả lời:** Chèn object vào query thay vì string → `$ne`, `$gt` để bypass.

```javascript
// ❌
db.users.findOne({ email: req.body.email });
// nếu req.body.email = { $ne: null } → trả user đầu tiên

// ✅
db.users.findOne({ email: String(req.body.email) });
```

**Áp dụng:** backend nên dùng DTO + `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.

---

### Q16.4. Làm sao bảo vệ secret trong frontend?

💬 **Trả lời:** **Không thể.** Mọi thứ chạy trong browser đều công khai. Vite expose `VITE_*`, Next.js expose `NEXT_PUBLIC_*` → **không bao giờ** đặt secret ở đó.

Cách đúng: secret ở backend; frontend gọi qua API route/proxy; Swagger credentials load ở server-side.

---

### Q16.5. Clickjacking?

💬 **Trả lời:** Đặt website trong `<iframe>` của site khác để lừa user click. Phòng chống: header `X-Frame-Options: DENY` hoặc `Content-Security-Policy: frame-ancestors 'none'`.

---

### Q16.6. Rate limiting?

💬 **Trả lời:** Giới hạn số request trong khoảng thời gian để chống brute-force & spam. Backend: `@nestjs/throttler` hoặc nginx `limit_req`.

**Áp dụng:** nên rate-limit `POST /users/login` và `POST /users/otp/authenticate` (đoán mã OTP).

---

# 17. Software Architecture

### Q17.1. Monolith vs Microservice?

| | Monolith | Microservice |
|---|---|---|
| Deploy | 1 lần | Nhiều |
| Scale | Scale cả app | Scale từng service |
| Debug | Dễ | Khó (distributed tracing) |
| Độ phức tạp | Thấp | Cao |

**Áp dụng:** Agrimarket backend là **monolith** (NestJS). Với quy mô hiện tại, monolith là lựa chọn đúng — tách service sớm là over-engineering.

---

### Q17.2. Layered vs Clean Architecture?

💬 **Trả lời:**
- **Layered** (Controller → Service → Repository) — phổ biến, dễ hiểu.
- **Clean Architecture** — domain ở giữa, không phụ thuộc framework.

**Áp dụng:** frontend dùng kiểu tương tự: `Component → src/apis → adapter → transport`. Mỗi tầng hướng vào trong, tầng ngoài không biết chi tiết tầng trong.

---

### Q17.3. Separation of Concerns — áp dụng ở đâu?

💬 **Trả lời:** Mỗi tầng 1 trách nhiệm:
- `src/apis/index.ts` — contract với backend.
- `src/utils/api.adapter.ts` — mapping shape.
- `src/utils/interceptors.tsx` — transport + auth.
- Component — UI + interaction.

**Lợi ích:** đổi backend contract chỉ sửa 1 file, không đụng component.

---

### Q17.4. DRY — khi nào KHÔNG nên abstract?

💬 **Trả lời:** **Rule of three.** 2 chỗ giống nhau → chưa cần abstraction. Abstract sớm tạo abstraction sai, khó đổi, và coupling không cần thiết.

**Áp dụng:** trong task này chỉ tạo `api.adapter.ts` khi thực sự có ≥ 3 chỗ dùng shape giống nhau.

---

### Q17.5. Technical debt là gì?

💬 **Trả lời:** Code/kiến trúc tạm để ship nhanh, phải trả lại sau. Quy tắc: nếu biết là debt → ghi lại issue + comment "TODO(reason)" để có ngữ cảnh.

**Áp dụng:** các hạn chế đã biết được liệt kê ở `WORK.md` § 13 (10 items) kèm mức độ & hướng xử lý.

---

# 18. Câu hỏi về dự án Agrimarket

> Chuẩn bị kỹ các câu này — đây là phần **quyết định** kết quả phỏng vấn.

---

### Q18.1. Kiến trúc dự án này thế nào?

💬 **Trả lời:**

"Agrimarket là **SPA bán nông sản sạch**, build bằng **Vite 5 + React 18**, TypeScript strict.

**Tầng:**
- **UI**: React function component + hooks, Ant Design 5 cho form/table/modal, Tailwind + SCSS cho style.
- **Routing**: React Router v6, mọi route **lazy-load** qua `React.lazy` + `Suspense` → code splitting.
- **State**: Redux Toolkit + **redux-persist** (persist vào localStorage), một slice `userReducer` chứa user/sản phẩm/giỏ/category/favorite/supplier.
- **API**: 3 tầng — `src/apis/index.ts` (catalog endpoint) → `src/utils/api.adapter.ts` (chuẩn hoá shape) → `src/utils/interceptors.tsx` (Axios + token refresh).
- **Backend**: NestJS + Express + MongoDB Atlas, deploy trên Render, base URL `/api/v1`.

Điểm thiết kế đáng chú ý là **adapter layer** — backend trả `attributes` ở list nhưng `attribute` ở detail, cart trả `carts` nhưng UI đọc `items`, profile snake_case nhưng UI camelCase. Thay vì sửa hàng chục component, tôi gom việc dịch shape vào 1 file, giữ nguyên toàn bộ JSX."

---

### Q18.2. Frontend giao tiếp backend ra sao?

💬 **Trả lời:**

"Đi qua **một** entry point duy nhất:

```
Component → src/apis/index.ts → api.adapter.ts → interceptors.tsx → axios → backend
```

Mỗi tầng 1 trách nhiệm. `src/apis/index.ts` là nơi duy nhất biết endpoint — muốn đổi path chỉ sửa 1 chỗ. Component **không** bao giờ gọi `axios` trực tiếp.

Base URL đọc từ `import.meta.env.VITE_API_URL`, fallback về instance trên Render → trỏ về backend local chỉ cần đổi env, không sửa code.

Mọi request đều qua `requestApi()` → Axios instance có request interceptor gắn `Authorization: Bearer` và response interceptor xử lý 401."

---

### Q18.3. Login hoạt động thế nào?

💬 **Trả lời:**

"Form Ant Design validate client → `POST /users/login` với `{ email, password }`.

Backend trả envelope `{ statusCode, message, data: { access_token, refresh_token, role, ... } }`.

Frontend:
1. `access_token` → `localStorage` (dễ gắn header).
2. `refresh_token` → cookie 7 ngày (backend cũng set).
3. `dispatch(setAuthenticationStatus(true))`.
4. Nếu `role === "Admin"` → `setAdminStatus(true)`.
5. Navigate về `/`.

Lưu ý flow của dự án: **đăng ký phải verify OTP trước**. Backend trả 400 `Account is unverified.` nếu chưa verify — nên form Register chuyển hướng sang `/login` chứ không tự đăng nhập."

---

### Q18.4. Access token được xử lý thế nào?

💬 **Trả lời:**

"**Request interceptor** đọc token từ localStorage và gắn header cho mọi request.

**Response interceptor** bắt 401:
1. Đánh dấu request đó `_retried = true` để chỉ thử 1 lần.
2. Gọi `POST /users/token/refresh` với refresh token trong cookie.
3. Thành công → lưu token mới → replay request gốc với header mới.
4. Thất bại → `clearTokens()` + `window.location.href = "/login"`.

Cờ `_retried` là để tránh vòng lặp vô hạn khi refresh token cũng hết hạn.

**Cải tiến tôi biết:** hiện mỗi request 401 sẽ gọi refresh riêng. Nếu 5 request cùng fail sẽ có 5 lần refresh — nên dedupe bằng 1 promise chung."

---

### Q18.5. Protected routes được implement thế nào?

💬 **Trả lời (trung thực, nêu cả hạn chế):**

"Hiện tại dự án **chưa có** route guard component. Có 2 kiểu guard:

1. **Guard bằng API** — trang Admin gọi `GET /users/@me/profile`, so `role === "Admin"`, nếu không thì `navigate("*")`.
2. **Guard bằng state** — `MainProfile` check `isAuthenticated` trong `useEffect` → `navigate("/login")`.

Ngoài ra, **cơ chế bảo vệ thật sự là ở tầng API**: endpoint yêu cầu token sẽ trả 401 → interceptor refresh hoặc redirect `/login`. Nên kể cả user hack được UI, họ cũng không gọi được API admin.

**Hạn chế tôi nhận ra:** (a) guard admin dùng `navigate()` trong render — anti-pattern React, nên dùng `<Navigate to="*" replace />`; (b) `isadmin` mặc định `false` nên lúc chờ API user bị đẩy 404 — cần state `null` = loading; (c) nên tách thành `<ProtectedRoute>` và `<AdminRoute>` để nhất quán."

➕ **Follow-up:** "Nếu user sửa `isAdmin` trong localStorage?" → vẫn không gọi được API admin vì backend tự kiểm tra role. Redux persist chỉ là UI state.

---

### Q18.6. API response khác interface TS thì xử lý sao?

💬 **Trả lời:**

"Đây là tình huống thực tế rất hay gặp. Ví dụ backend trả:
- list products: `attributes: ProductAttribute[]`
- detail product: `attribute: ProductAttribute` (số ít)

mà component đọc `productAttributes`. Nếu sửa ở từng component → rất nhiều file, dễ sót, và phải sửa lại khi backend đổi.

Tôi tạo **adapter layer** ở `src/utils/api.adapter.ts`:

```typescript
export const normalizeProduct = <T extends LooseRecord>(product: T) => {
  const rawAttributes = product.attributes ?? product.attribute;
  const attributes = Array.isArray(rawAttributes)
    ? rawAttributes
    : rawAttributes ? [rawAttributes] : [];
  return { ...product, productAttributes: attributes, price: /* derive */ };
};
```

Quy tắc: adapter **giữ nguyên** field gốc (spread) và chỉ **thêm** alias → backward-compatible, không mất thông tin, và component không phải đổi 1 dòng nào.

Tương tự cho cart (`carts` → `items`, `productDetails` → `product_id`) và profile (`full_name` → `fullName`).

Điểm quan trọng: adapter đặt ở **tầng API**, không phải tầng component — nên khi backend đổi contract chỉ sửa 1 file."

➕ **Follow-up:** "Nếu backend đổi contract thường xuyên?" → nên dùng schema validation runtime (zod) để validate response, vì TS types bị xoá lúc runtime — assertion `as` không bắt được lỗi runtime.

---

### Q18.7. Danh sách sản phẩm hoạt động thế nào?

💬 **Trả lời:**

"Trang Home dùng `src/components/CartProducts/CartProduct.tsx`:
1. `useSearchParams()` đọc `?category=` từ URL.
2. `useEffect([query])` → có category thì `GET /products/categories/:id`, không thì `GET /products`.
3. Response qua `normalizeProducts` → `dispatch(setProduct(...))`.
4. `useEffect([])` gọi `GET /categories` cho menu filter.
5. `useEffect([])` gọi `GET /carts` để set badge số lượng.

Filter nằm trong **query string** chứ không phải state → URL có thể share, F5 không mất filter, hỗ trợ nút Back.

**Điểm tôi biết cần cải thiện:** `getCart()` được gọi khi user chưa đăng nhập → 401 → interceptor redirect `/login` → khách chưa đăng nhập mất trang chủ. Fix: guard theo `isAuthenticated`. Và `getCart()` bị gọi 2 lần (CartProduct + Cart) → nên dedupe."

---

### Q18.8. Giỏ hàng & thanh toán hoạt động thế nào?

💬 **Trả lời:**

"**Thêm vào giỏ** — payload bắt buộc:
```json
{ "items": [{ "product_id": "...", "product_attribute_id": "...", "quantity": 1 }] }
```
`product_attribute_id` là bắt buộc — ban đầu tôi chỉ gửi `product_id` và `quantity` → backend trả 400 `product_attribute_id should not be empty`. Đây là lý do tôi luôn đọc `errors` chi tiết trong response thay vì chỉ đọc `message` chung.

**Trang Payment:**
- Load giỏ → `GET /carts` → `normalizeCart` → `items[]`.
- Tăng/giảm số lượng giữ trong **local state**, chỉ gửi lên server khi bấm "Save" (`PUT /carts/items/:cartId`). Đây là pattern "local state + explicit commit" — tránh 1 request mỗi lần bấm `+`.
- Xoá → `DELETE /carts/items/:cartId?product_id=...`.
- Checkout → `POST /orders` với `product_attribute_ids` (không phải `product_id` — vì giá & tồn kho định nghĩa ở cấp attribute).

**Điểm quan trọng:** sau mỗi mutation tôi refetch `GET /carts` để đồng bộ. Tốn 1 request nhưng chắc chắn đúng, tránh phải lo logic optimistic update phức tạp."

---

### Q18.9. Search hoạt động thế nào?

💬 **Trả lời:**

"`POST /products/search?keyword=...` — method là **POST** chứ không phải GET, keyword nằm trong query string, body rỗng. Component `src/components/Categories/Categories.tsx` đồng bộ keyword vào URL bằng `setSearchParams` để có thể share link.

**Bug tôi đã sửa:** trong `handleInputChange` có lời gọi `useEffect` bên trong event handler — vi phạm Rules of Hooks, gây lỗi runtime React. Đã bỏ.

**Cải tiến tôi đề xuất:** (a) debounce 300ms — hiện gọi API mỗi lần gõ; (b) `AbortController` để huỷ request cũ, tránh race condition khi gõ nhanh (response cũ về sau ghi đè response mới); (c) filter Price/Additional hiện chỉ là UI tĩnh vì backend chưa có endpoint lọc theo giá."

---

### Q18.10. Admin quản lý sản phẩm thế nào?

💬 **Trả lời:**

"3 trang:
- `Admin.tsx` — bảng sản phẩm + xoá.
- `ProductAdmin.tsx` — bảng + cột ảnh + link sửa + danh sách supplier.
- `EditAdmin.tsx` — form sửa chi tiết, load bằng `getProductById(editId)` từ route param `/editadmin/:editId`.

**Bug đáng nhớ:** `getSuppliers()` bị gọi trong **render body** → dispatch → re-render → gọi lại → vòng lặp request vô hạn, trang giật. Sửa bằng cách bọc trong `useEffect`. Bài học: **render phải là hàm thuần khiết quả**, mọi side-effect phải nằm trong effect.

**Còn lại:** role check ở client chỉ là UI guard — backend phải tự verify role cho `PUT/DELETE /products`."

---

### Q18.11. Xử lý API failure thế nào?

💬 **Trả lời:**

"3 tầng:

1. **Tầng transport** (`interceptors.tsx`): 401 → refresh token → retry 1 lần → fail thì clear token + về `/login`. Lỗi khác propagate ra.

2. **Tầng chuẩn hoá lỗi** (`api.adapter.ts` → `getApiErrorMessage`): đọc `data.message` → `errors[field].msg` → `error.message` → fallback. Nhờ vậy mọi lỗi đều có message tiếng Anh cụ thể từ server thay vì "Something went wrong".

3. **Tầng component**: `try/catch` + `toast.error(getApiErrorMessage(error, "Lỗi thanh toán"))`.

**Nguyên tắc:** không nuốt lỗi, không thay bằng mock data. Nếu API fail thì UI phải nói rõ thất bại.

**Còn thiếu (tôi biết):** chưa có Error Boundary → 1 component lỗi render sẽ làm sập cả app. Nên bọc `<Routes>` trong ErrorBoundary."

---

### Q18.12. Làm sao tránh request trùng lặp?

💬 **Trả lời:**

"Hiện trạng có 2 chỗ gọi `GET /carts` trên trang Home (`CartProduct.tsx` và `Cart.tsx`) → 2 request cho cùng dữ liệu.

**Cách tôi sẽ sửa (không thêm dependency):** cache ở tầng module với promise dedupe:

```typescript
let cartPromise: Promise<cartTypes> | null = null;
export const getCartCached = () => {
  if (!cartPromise) {
    cartPromise = getCart().then(r => r.data).finally(() => { cartPromise = null; });
  }
  return cartPromise;
};
```
Dùng `finally` để reset promise → lần sau gọi mới thực sự gọi API (không cache stale).

**Cách chuyên nghiệp hơn:** thêm React Query / TanStack Query — tự dedupe, cache, revalidate, retry, stale-while-revalidate, và xử lý race condition. Nhưng task này yêu cầu không thêm dependency nên tôi ghi nhận để phase sau."

➕ **Follow-up:** "Không dùng React Query thì cache thủ công có hạn chế gì?" → không có stale-while-revalidate, không có retry, phải tự quản lý vòng đời cache, dễ sai khi nhiều component cùng dùng.

---

### Q18.13. Quản lý shared state thế nào?

💬 **Trả lời:**

"Dùng **Redux Toolkit** với **1 slice** `userReducer` + `redux-persist` vào localStorage.

Các state: `login`, `register`, `verify`, `email`, `isAuthenticated`, `isAdmin`, `isForgotPassword`, `product`, `cart`, `profile`, `cartnumber`, `category`, `favorite`, `supplier`, `loading`.

**Tại sao 1 slice?** Vì app chưa lớn; tách nhiều slice sớm là over-engineering.

**Tại sao persist?** Để user không bị mất trạng thái khi F5 (cart, profile, sản phẩm đã tải).

**Điểm tôi nhận ra:** `redux-persist` chưa blacklist `isAuthenticated`/`isAdmin` → sau logout rồi reload, state có thể bị rehydrate từ storage. Cần `persistor.purge()` khi logout. Đây là hạn chế tôi đã ghi vào tài liệu."

---

### Q18.14. Tối ưu rendering thế nào?

💬 **Trả lời:**

"Hiện tại:
- **Code splitting** toàn bộ route qua `React.lazy` + `Suspense` → user chỉ tải chunk cần.
- **Selector hẹp** — `useSelector(s => s.user.cartnumber)` thay vì lấy cả `s.user` → chỉ re-render khi field đó đổi.
- **Derived state tính trực tiếp** — `filterProduct` suy ra từ `product`, không lưu vào `useState`.

**Chưa làm & tôi biết lý do:**
- `React.memo` / `useMemo` — danh sách chỉ ≤ 8 item, thêm memo sẽ tốn hơn lợi ích. **Không nên bừa bờ thêm.**
- `loading="lazy"` cho ảnh — nên làm, ảnh sản phẩm nhiều.
- Debounce search — nên làm.
- Dedupe `getCart` — nên làm.

Quan trọng: tôi **đo trước khi tối ưu** (React DevTools Profiler, Network tab), không tối ưu mù."

---

### Q18.15. Debug 401 thế nào?

💬 **Trả lời:**

"Theo thứ tự:
1. **Network tab** → request nào trả 401? Header `Authorization` có được gắn?
2. Console → `localStorage.getItem("ACCESS_TOKEN")` có giá trị không?
3. Token còn hạn không? (decode payload JWT, xem `exp`)
4. Cookie `REFRESH_TOKEN` còn không, còn hạn không?
5. Thử tay `POST /users/token/refresh` với cookie → xem backend trả gì.
6. Kiểm tra đúng endpoint chưa — nếu gọi endpoint không cần auth mà không có token cũng trả 401 → có thể là guard chưa chạy đúng.

**Phân biệt nguyên nhân:**
- Token thiếu → chưa login hoặc đã bị clear.
- Token hết hạn → interceptor sẽ refresh tự động; nếu vẫn 401 → refresh token cũng hết hạn → phải login lại.
- 401 nhưng backend trả 400 'Account is unverified.' → **không phải** 401, đó là flow verify OTP.
- Role không đủ → là **403** chứ không phải 401."

---

### Q18.16. Trang trắng / không render thì debug thế nào?

💬 **Trả lời:**

"1. **Console** — có error không? React có warning không?
2. **React DevTools** — component có render không? props đúng không?
3. **Redux DevTools** — state có đúng không? Action nào dispatch sai?
4. **Network tab** — API có trả data không? Response shape có khớp component đọc không? (rất hay bị: API trả `carts`, component đọc `items` → render mảng rỗng, không phải lỗi)
5. **Sources → Pause on exceptions** → xem stack chính xác.
6. Kiểm tra route — deep-link có đúng param không? `useParams()` có trả giá trị không?
7. Kiểm tra điều kiện render — `detail === undefined → navigate('*')` có đang chạy oan không (do data chưa về)?"

---

### Q18.17. Nếu phải cải tiến dự án, bạn làm gì?

💬 **Trả lời (theo thứ tự ưu tiên, có lý do):**

"**Ưu tiên 1 — Sửa các bug đã biết về auth flow:**
- `GET /carts` và `GET /users/@me/profile` gọi khi chưa đăng nhập → 401 → redirect `/login`, khách mất trang chủ. Guard theo `isAuthenticated`.
- `navigate()` trong render → đổi sang `<Navigate replace />`.
- `isAdmin` mặc định `false` → cần state `null` = loading.
- `redux-persist` chưa purge khi logout.

**Ưu tiên 2 — Chất lượng dữ liệu:**
- Dedupe `getCart` (2 request/1 lần tải trang).
- `Promise.allSettled` cho Home để `getCart` fail không làm hỏng danh sách.
- Debounce + `AbortController` cho search.
- Guard `detail?.productAttributes?.map` ở Product Detail để không crash khi product không có attribute.

**Ưu tiên 3 — Trải nghiệm:**
- Thêm Error Boundary.
- Skeleton loading thay vì spinner.
- `loading="lazy"` cho ảnh.
- Empty state cho search không có kết quả.

**Ưu tiên 4 — Kiến trúc (khi app lớn hơn):**
- Thêm React Query để quản lý server state (cache, dedupe, retry) thay vì `useEffect` + `useState` thủ công.
- Tách `useProducts()`, `useCart()` custom hooks — hiện logic fetch lặp ở 4 file.
- Backend: thống nhất field `attributes`/`attribute`, hỗ trợ pagination.

**Tôi ưu tiên theo impact/user-visible risk, không theo 'thêm công nghệ mới'."**

---

### Q18.18. Bạn học được gì từ dự án này?

💬 **Trả lời:**

"Ba bài học lớn nhất:

1. **Đọc contract API trước khi code.** Bug 400 khi thêm giỏ hàng chỉ giải quyết được sau khi tôi đọc `errors` chi tiết trong response — biết `product_attribute_id` là bắt buộc. Đoán sẽ tốn thời gian hơn nhiều.

2. **Tách biệt 'gọi API' và 'làm UI'.** Khi backend đổi shape, chỉ sửa adapter — không đụng component. Đây là bài học lớn nhất về thiết kế.

3. **Render phải thuần khiết quả.** Bug vòng lặp request ở Admin đến từ gọi API trong render body. React không được thiết kế cho side-effect trong render — mọi I/O phải nằm trong effect.

Ngoài ra tôi cũng học cách **ghi lại known issues thay vì giấu**: tôi tài liệu hoá 10 hạn chế còn lại với mức độ & hướng xử lý, để người tiếp nhận biết đâu là điểm cần chú ý."

---

## Tổng hợp: checklist trước khi phỏng vấn

- [ ] Đọc lại `WORK.md` § 1 (kiến trúc) và `docs/10-features.md` (từng feature)
- [ ] Nắm 29 endpoint + method + auth requirement
- [ ] Vẽ được sơ đồ luồng login và luồng add-to-cart trên giấy
- [ ] Giải thích được adapter layer tại sao tồn tại
- [ ] Biết 3 bug lớn đã sửa + root cause
- [ ] Biết 10 known issues + hướng xử lý
- [ ] Chuẩn bị 3 câu hỏi dự án mình muốn hỏi interviewer:
  1. "Quy trình review code của team thế nào?"
  2. "Team có dùng React Query / SWR không, hay quản lý server state thủ công?"
  3. "Backend có hỗ trợ pagination và endpoint upload ảnh không?"
