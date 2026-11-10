# 09. Lộ trình học tuần tự (Part 16)

> 10 giai đoạn, mỗi giai đoạn có: Kiến thức cần học → Khái niệm quan trọng → Bài tập thực hành → Kết quả đạt được → Áp dụng vào Agrimarket → Dấu hiệu sẵn sàng cho giai đoạn kế tiếp.

---

## Mục lục

- [Tổng quan lộ trình](#tổng-quan-lộ-trình)
- [Phase 1 — JavaScript Fundamentals](#phase-1--javascript-fundamentals)
- [Phase 2 — JavaScript Intermediate](#phase-2--javascript-intermediate)
- [Phase 3 — TypeScript Fundamentals](#phase-3--typescript-fundamentals)
- [Phase 4 — TypeScript Advanced](#phase-4--typescript-advanced)
- [Phase 5 — React Fundamentals](#phase-5--react-fundamentals)
- [Phase 6 — Next.js](#phase-6--nextjs)
- [Phase 7 — API Integration](#phase-7--api-integration)
- [Phase 8 — State Management & Optimization](#phase-8--state-management--optimization)
- [Phase 9 — Debugging & Problem Solving](#phase-9--debugging--problem-solving)
- [Phase 10 — Project Explanation & Interview Prep](#phase-10--project-explanation--interview-prep)

---

## Tổng quan lộ trình

```
Phase 1  JS Fundamentals        ─┐
                                 ├─→ Phase 5  React Fundamentals ─┐
Phase 2  JS Intermediate        ─┘                                │
                                                                  ├─→ Phase 8  State & Optimization
Phase 3  TS Fundamentals        ─┐                                │
                                 ├─→ Phase 7  API Integration ────┘
Phase 4  TS Advanced            ─┘
                                                                  │
Phase 6  Next.js ─────────────────────────────────────────────────┤
                                                                  │
Phase 9  Debugging & Problem Solving ──────────────────────────────┤
                                                                  ▼
                                          Phase 10  Project Explanation & Interview Prep
```

**Gợi ý thời gian (Fresher/Junior, mỗi ngày 2–3h):**

| Phase | Nội dung | Thời gian ước tính |
|-------|----------|---------------------|
| 1 | JS Fundamentals | 2 tuần |
| 2 | JS Intermediate | 2 tuần |
| 3 | TS Fundamentals | 1.5 tuần |
| 4 | TS Advanced | 1.5 tuần |
| 5 | React Fundamentals | 3 tuần |
| 6 | Next.js | 2 tuần |
| 7 | API Integration | 2 tuần |
| 8 | State Management & Optimization | 2 tuần |
| 9 | Debugging & Problem Solving | 1.5 tuần |
| 10 | Project Explanation & Interview Prep | 1 tuần |

**Nguyên tắc:** không chuyển phase khi chưa đạt "Dấu hiệu sẵn sàng" của phase hiện tại. Học kiến thức mà chưa dùng được thì không giữ được lâu.

---

# Phase 1 — JavaScript Fundamentals

## Kiến thức cần học

- Biến: `var` / `let` / `const` và phạm vi (scope).
- Kiểu dữ liệu nguyên thủy vs tham chiếu.
- Type coercion, toán tử, so sánh.
- Truthy / falsy.
- Câu lệnh điều kiện, vòng lặp.
- Hàm: declaration, expression, arrow function.
- Scope & hoisting.
- Closure.
- `this`, `call`/`apply`/`bind`.
- Destructuring, spread/rest, template literals.
- Optional chaining `?.`, nullish coalescing `??`.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Scope chain | Giải thích tại sao biến bên trong function không thấy biến khai báo sau |
| Hoisting | `var` được nâng lên nhưng `let/const` ở TDZ → `ReferenceError` |
| Closure | Nền tảng của `useState`, `useEffect`, debounce, factory function |
| Reference vs value | Quyết định `.map()` có tạo mảng mới hay không, `.push()` mutate hay không |
| Type coercion | `"5" + 1 === "51"` nhưng `"5" - 1 === 4` |
| `this` trong arrow function | Arrow không có `this` riêng → dùng trong class component & callback |

## Bài tập thực hành

1. Viết `fizzBuzz` — [bài 1.1](08-exercises.md#bài-11-fizzbuzz)
2. Đảo chuỗi không dùng `reverse()` — [bài 1.2](08-exercises.md#bài-12-đảo-chuỗi-không-dùng-reverse)
3. `isPalindrome` 2 con trỏ — [bài 1.3](08-exercises.md#bài-13-ispalindrome)
4. Đếm từ trong chuỗi — [bài 1.4](08-exercises.md#bài-14-đếm-từ-trong-chuỗi)
5. Tự giải thích output của các đoạn code trong `docs/01-javascript-roadmap.md` § 9.3 (prototype chain, `this`).
6. Refactor 1 component của Agrimarket để dùng destructuring + optional chaining.

## Kết quả đạt được

- Đọc được code JS của người khác mà không cần Google từng dòng.
- Dự đoán được output của code có closure, `this`, hoisting.
- Biết khi nào `.map()` trả về mảng mới và khi nào mutate.

## Áp dụng vào Agrimarket

- `src/utils/setting.ts` — đọc/ghi `localStorage` & cookie với try/catch.
- `src/components/Categories/Categories.tsx` — `useState`, destructuring props, `Number()` coercion.
- `src/apis/index.ts` — arrow functions, template literal trong URL.

## Dấu hiệu sẵn sàng cho Phase 2

- [ ] Viết được hàm `fizzBuzz`, `isPalindrome`, `groupBy` không cần tra cứu.
- [ ] Giải thích được "temporal dead zone" trong 3 câu.
- [ ] Phân biệt được `==` và `===` kèm ví dụ coercion.
- [ ] Đọc 1 file bất kỳ trong `src/` và nói được nó làm gì.

---

# Phase 2 — JavaScript Intermediate

## Kiến thức cần học

- Array methods: `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flatMap`, `includes`, `sort`.
- Object manipulation: spread, `Object.entries/keys/values`, `Object.fromEntries`.
- Shallow copy vs deep copy.
- Higher-order function, callback.
- Promise: `then`/`catch`/`finally`, `Promise.all`, `Promise.allSettled`.
- `async` / `await`.
- `try` / `catch` / `finally`.
- Event Loop, microtask vs macrotask.
- `setTimeout` / `setInterval`.
- ES Modules: `import` / `export` (default, named, `import type`).
- Error handling: `Error`, `try/catch`, custom error.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Promise chaining vs `async/await` | `async/await` chỉ là cú pháp sugar của Promise |
| `Promise.all` fail-fast vs `allSettled` | Chọn sai → 1 API lỗi làm mất dữ liệu cả nhóm |
| Event Loop | Giải thích vì sao `setTimeout(0)` chạy sau `Promise.resolve().then()` |
| Microtask vs Macrotask | Queue riêng → thứ tự thực thi |
| Shallow vs deep copy | `spread` chỉ copy 1 tầng → nested object vẫn shared reference |
| ES Module hoisting | Import được nâng lên → có thể dùng trước dòng khai báo |

## Bài tập thực hành

1. `groupBy` — [bài 2.1](08-exercises.md#bài-21-group-by-key)
2. `chunk` — [bài 2.2](08-exercises.md#bài-22-chunk--chia-mảng)
3. `unique` / `uniqueBy` — [bài 2.3](08-exercises.md#bài-23-unique--loại-trùng)
4. `deepMerge` — [bài 2.4](08-exercises.md#bài-24-deepmerge)
5. Viết `delay(ms)` bằng Promise rồi dùng `async/await`.
6. Đoán thứ tự output của: `console.log(1); setTimeout(...,0); Promise.resolve().then(); console.log(2);`
7. Dùng `Promise.allSettled` refactor trang Home — [bài 9.2](08-exercises.md#bài-92-promisesallsettled-cho-trang-home)

## Kết quả đạt được

- Xử lý API bất đồng bộ không cần `.then` lồng nhau.
- Biết khi nào dùng `all` vs `allSettled`.
- Hiểu vì sao setState sau `await` trong component đã unmount gây warning.

## Áp dụng vào Agrimarket

- `src/apis/index.ts` — toàn bộ helper là `async/await`.
- `src/utils/interceptors.tsx` — `await axios.post(...)` trong interceptor 401.
- `src/utils/api.adapter.ts` — hàm thuần đồng bộ để map dữ liệu.
- `scripts/verify-integration.mjs` — `Promise.all` chạy song song nhiều probe.

## Dấu hiệu sẵn sàng cho Phase 3

- [ ] Viết được hàm async với `try/catch/finally` và trả về `null` khi lỗi.
- [ ] Giải thích được thứ tự chạy của microtask/macrotask.
- [ ] Biết khi nào `Promise.all` khiến app "mất trắng" vì 1 request fail.

---

# Phase 3 — TypeScript Fundamentals

## Kiến thức cần học

- Vì sao cần TypeScript.
- Type inference vs type annotation.
- Primitive types, `string | number | boolean`.
- Array, tuple.
- Object type.
- `interface` vs `type`.
- Optional properties (`?`), `null`, `undefined`.
- Union type, intersection type.
- Literal type.
- `enum` vs `as const`.
- Function types, `void`, `never`.
- `any` vs `unknown`.
- Type assertion (`as`).

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| `interface` mở rộng được, `type` không | `type` dùng cho union/intersection, `interface` cho object shape |
| Structural typing | Object khác tên vẫn assign được nếu shape giống |
| `unknown` an toàn hơn `any` | `unknown` bắt buộc narrow trước khi dùng |
| `strictNullChecks` | Bật → bắt buộc xử lý `null` → giảm bug runtime |
| Excess property check | Object literal gán vào type có field thừa → lỗi compile |

## Bài tập thực hành

1. Định nghĩa `apiResponseType<T>` — [bài 3.1](08-exercises.md#bài-31-type-envelope-api)
2. Viết type guard `asString`/`asNumber` — [bài 3.2](08-exercises.md#bài-32-narrow-unknown)
3. Viết generic `normalizeCollection` — [bài 3.3](08-exercises.md#bài-33-generic-normalize)
4. Viết `getApiErrorMessage` type-safe — [bài 3.4](08-exercises.md#bài-34-type-safe-error-handler)
5. Định nghĩa `updateProductPayloadType` — [bài 4.2](08-exercises.md#bài-42-implement-updateproduct-với-payload-type-đầy-đủ)
6. Đọc toàn bộ `src/@type/*.ts` và giải thích từng type.

## Kết quả đạt được

- Đọc type của dự án mà không cần tra cứu.
- Bắt được lỗi contract mismatch trước khi chạy.
- Biết khi nào dùng `interface`, khi nào dùng `type`.

## Áp dụng vào Agrimarket

- `src/@type/global.type.ts` — `apiResponseType`, `productTypes`, `cartTypes`.
- `src/@type/user.type.ts` — `userTypes`, `profileTypes`.
- `src/apis/index.ts` — mọi helper trả `apiResponseType<T>`.

## Dấu hiệu sẵn sàng cho Phase 4

- [ ] Tự viết được generic function có constraint.
- [ ] Phân biệt được `interface` và `type` khi nào dùng.
- [ ] Đọc 1 file type trong dự án và mô tả được shape của API response.

---

# Phase 4 — TypeScript Advanced

## Kiến thức cần học

- Generics: function, interface, class.
- Generic constraints (`extends`).
- `keyof`, `typeof`.
- Indexed access types (`T["a"]["b"]`).
- Type narrowing, type guards (`in`, `typeof`, custom).
- Discriminated unions.
- Utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `Exclude`, `Extract`, `ReturnType`, `Parameters`.
- Conditional types, mapped types, template literal types.
- `infer`.
- Strict compiler flags.
- Runtime validation vs compile-time types.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Discriminated union | Mô hình chuẩn cho state machine: `{status: "loading"} \| {status: "success"; data: T}` |
| `Exclude`/`Extract` | Lọc union type → type-safe enum hóa string literal |
| `ReturnType<typeof fn>` | Tránh lặp lại signature phức tạp |
| `infer` | Viết conditional type mà không cần định nghĩa thủ công |
| Compile-time ≠ runtime | TS không validate response runtime → cần adapter + runtime check |

## Bài tập thực hành

1. Viết `useAsync<T>` hook với discriminated union — [bài 6.2](08-exercises.md#bài-62-useasync--xử-lý-loadingerrordata)
2. Viết `ApiState<T>` discriminated union dùng cho 1 feature.
3. Tạo `DeepPartial<T>` bằng conditional type.
4. Tạo `GetById<T>` helper type: `{ [K in keyof T as `${K}Id`]: string }`.
5. Bật `noUncheckedIndexedAccess` trong `tsconfig.json` và fix lỗi phát sinh.

## Kết quả đạt được

- Viết được generic hook tái sử dụng.
- Model được trạng thái loading/error/success chặt chẽ.
- Hiểu rõ ranh giới giữa "type đúng" và "runtime đúng".

## Áp dụng vào Agrimarket

- `src/utils/api.adapter.ts` — generic normalization.
- `src/hooks/useAsync.ts` (bài 6.2) — discriminated union cho async state.
- `src/apis/index.ts` — `apiResponseType<T>` xuyên suốt.

## Dấu hiệu sẵn sàng cho Phase 5

- [ ] Viết được 1 generic hook có type parameter đúng.
- [ ] Dùng được `Pick`/`Omit`/`Exclude` trong code thật mà không tra cứu.
- [ ] Giải thích được vì sao TS không bảo vệ khỏi API trả sai shape.

---

# Phase 5 — React Fundamentals

## Kiến thức cần học

- Component, props, state.
- JSX & render.
- `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`.
- Custom hooks.
- Context API.
- Controlled vs uncontrolled component.
- Re-render: khi nào component render lại.
- Conditional rendering, list rendering & keys.
- Error boundary.
- State lifting, component composition.
- `React.lazy` + `Suspense`.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Rules of Hooks | Hook chỉ gọi ở top-level, không trong condition/loop/event handler |
| Render phải thuần khiết quả | Side-effect trong render → vòng lặp vô hạn (bug đã gặp ở `ProductAdmin.tsx`) |
| Dependency array | Quyết định effect chạy khi nào → sai là bug stale closure |
| `useCallback`/`useMemo` | Chỉ dùng khi tham chiếu ổn định quan trọng (memo child, effect dep) |
| Controlled vs uncontrolled | Controlled = React giữ state; uncontrolled = DOM giữ → khác cách đọc value |
| `key` = identity | Dùng index → bug khi reorder/xoá |

## Bài tập thực hành

1. Tạo `ProductCard` presentational — [bài 5.1](08-exercises.md#bài-51-component-productcard)
2. Fix bug `useEffect` trong event handler — [bài 5.2](08-exercises.md#bài-52-fix-bug-useeffect-trong-event-handler)
3. Fix vòng lặp request — [bài 5.3](08-exercises.md#bài-53-fix-vòng-lặp-request)
4. Thêm loading state cho `ProductDetail` — [bài 5.4](08-exercises.md#bài-54-productdetail--handle-loading-state)
5. Viết `useDebounce` — [bài 6.1](08-exercises.md#bài-61-usedebounce)
6. Viết `useCart` — [bài 6.3](08-exercises.md#bài-63-usecart--tách-logic-giỏ-hàng)
7. Tích hợp `useDebounce` vào ô search của `Categories.tsx`.

## Kết quả đạt được

- Debug được lỗi "component vô hạn render", "effect chạy 2 lần", "state không cập nhật".
- Tự tách custom hook khi thấy logic lặp 3 nơi.
- Biết khi nào dùng `useMemo` và khi nào thừa.

## Áp dụng vào Agrimarket

- `src/container/...` — các page.
- `src/components/...` — component dùng chung.
- `src/redux/userReducer/userReducer.ts` — global state.
- `src/hooks/` — nơi tích hợp các custom hook mới.

## Dấu hiệu sẵn sàng cho Phase 6

- [ ] Giải thích được chính xác khi nào component re-render.
- [ ] Sửa được lỗi vòng lặp render mà không cần thêm `useRef` để "chặn".
- [ ] Viết được 1 custom hook và dùng lại được ở 2 component.

---

# Phase 6 — Next.js

## Kiến thức cần học

- Kiến trúc Next.js (Pages Router vs App Router).
- Routing, dynamic routes (`[id].tsx`), catch-all.
- API Routes (`pages/api/*` hoặc `app/api/*/route.ts`).
- Middleware.
- Rendering: SSR, SSG, ISR, CSR.
- Data fetching: `getServerSideProps`, `getStaticProps`, `useSWR`/`react-query`.
- Authentication tích hợp (middleware, server session).
- Environment variables (`NEXT_PUBLIC_`).
- `next/image`, `next/font`.
- SEO (`next/head`, metadata API).
- Loading & error handling (`loading.tsx`, `error.tsx`, Suspense).

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Rendering strategy trade-off | SSR (SEO + TTFB chậm) vs SSG (nhanh, static) vs CSR (đơn giản, SEO kém) |
| App Router vs Pages Router | App Router dùng React Server Components + Server Actions |
| Middleware chạy trước render | Chặn request không authorized → redirect sớm, tiết kiệm |
| `NEXT_PUBLIC_` bị expose | Không được chứa secret trong biến này |
| Client vs Server Component | Chỉ component có `"use client"` mới dùng `useState`/event handler |

## Áp dụng vào Agrimarket (đối chiếu)

| Khái niệm Next.js | Agrimarket hiện tại (Vite SPA) | Nếu chuyển sang Next.js |
|-------------------|--------------------------------|------------------------|
| Routing | `react-router-dom` `useRoutes` | File-based routing trong `app/` |
| Data fetching | `useEffect` + `useState` + axios | Server Component fetch trực tiếp |
| Auth guard | `<ProtectedRoute>` component | `middleware.ts` + server session |
| SEO | Không có (SPA) | `metadata` export trong `app/layout.tsx` |
| Image | `<img>` thuần | `next/image` tối ưu tự động |
| API routes | Backend NestJS riêng (`onrender.com`) | `app/api/*/route.ts` proxy hoặc BFF |

**Bài tập thực hành:**
1. Dựng 1 project Next.js App Router tối giản: layout, dynamic route, server component fetch dữ liệu từ `https://agrimarket-z5f0.onrender.com/api/v1/products`.
2. Viết `middleware.ts` chặn `/admin` nếu không có cookie session.
3. So sánh TTFB của route đó với phiên bản CSR tương đương.
4. Viết 1 trang SSR cho SEO sản phẩm, dùng `generateMetadata`.

## Kết quả đạt được

- Nói được vì sao dự án này dùng Vite SPA thay vì Next.js (không có SSR/SEO requirement, backend tách riêng).
- Nếu được yêu cầu chuyển sang Next.js, biết bắt đầu từ đâu.
- Hiểu `middleware` khác `ProtectedRoute` client component như thế nào.

## Dấu hiệu sẵn sàng cho Phase 7

- [ ] Vẽ được sơ đồ: request → middleware → render → data fetch → response.
- [ ] Giải thích được khi nào chọn SSR vs SSG vs CSR.
- [ ] Biết vì sao không đặt secret vào `NEXT_PUBLIC_*`.

---

# Phase 7 — API Integration

## Kiến thức cần học

- HTTP methods: GET, POST, PUT, PATCH, DELETE; idempotency.
- REST conventions, resource naming, status code.
- Axios: instance, `baseURL`, `timeout`, `headers`.
- Request/response interceptors.
- Fetch API (alternative).
- Query params vs path params vs body.
- Error handling: 400/401/403/404/422/500.
- Authentication: Bearer token, JWT, access + refresh.
- Environment config (`import.meta.env`).
- Swagger/OpenAPI đọc hiểu.
- Pagination, filtering, sorting, search.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Interceptor | Gom logic chung (auth header, error format, refresh) 1 chỗ |
| 401 vs 403 | 401 = chưa xác thực (→ refresh/login), 403 = đã xác thực nhưng không đủ quyền |
| Token refresh | Access token ngắn hạn + refresh token dài hạn → cân bằng bảo mật & UX |
| Race condition khi refresh | Nhiều request 401 cùng lúc → cần dedupe promise |
| Contract mismatch | Backend trả field khác tên → cần adapter layer, không sửa component |
| Validation error envelope | NestJS `class-validator` → `errors: { field: { msg } }` |

## Bài tập thực hành

1. Đọc Swagger `https://agrimarket-z5f0.onrender.com/api-docs/#/` và liệt kê toàn bộ endpoint — [docs/04-api-integration.md](04-api-integration.md)
2. Viết helper `getProductsByCategory` — [bài 4.1](08-exercises.md#bài-41-thêm-endpoint-getproductsbycategory-đã-có--viết-lại-từ-đầu)
3. Viết `updateProduct` với payload type — [bài 4.2](08-exercises.md#bài-42-implement-updateproduct-với-payload-type-đầy-đủ)
4. Xử lý response không phải JSON — [bài 4.3](08-exercises.md#bài-43-xử-lý-response-không-phải-json)
5. Viết test cho adapter — [bài 4.4](08-exercises.md#bài-44-viết-test-cho-adapter)
6. Chạy `node scripts/verify-integration.mjs` và giải thích từng assertion.
7. Implement `useAuth` — [bài 7.1](08-exercises.md#bài-71-viết-lại-useauth)
8. Viết `ProtectedRoute` / `AdminRoute` — [bài 7.2](08-exercises.md#bài-72-guard-route-bằng-component)
9. Implement refresh token dedupe — [bài 7.3](08-exercises.md#bài-73-refresh-token-dedupe)

## Kết quả đạt được

- Đọc Swagger mà không cần hướng dẫn.
- Tự tạo adapter khi backend đổi shape mà không sửa component.
- Debugg được lỗi auth một mình.

## Áp dụng vào Agrimarket

- `src/apis/index.ts` — 29 endpoint helper.
- `src/utils/api.adapter.ts` — lớp mapping.
- `src/utils/interceptors.tsx` — auth + refresh.
- `scripts/verify-integration.mjs` — kiểm chứng live API.

## Dấu hiệu sẵn sàng cho Phase 8

- [ ] Vẽ được sequence diagram của 1 request 401 → refresh → retry.
- [ ] Giải thích vì sao cần adapter thay vì sửa type.
- [ ] Tự map được 1 endpoint mới vào đúng feature trong ≤ 30 phút.

---

# Phase 8 — State Management & Optimization

## Kiến thức cần học

- State management: local → context → Redux Toolkit.
- Redux: slice, reducer, action, selector, dispatch.
- Redux Persist, localStorage.
- Selector hẹp vs rộng, `shallowEqual`.
- Re-render optimization: `React.memo`, `useMemo`, `useCallback`.
- Code splitting: dynamic import, `React.lazy`, `Suspense`.
- Bundle analysis (Vite build output).
- Image optimization (`loading="lazy"`, CDN).
- API caching, dedupe, request cancellation (`AbortController`).
- Debounce vs throttle.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Immer & reference change | Mỗi action tạo object mới cho slice → selector rộng gây re-render |
| `useSelector` hẹp | Chọn đúng field thay vì cả slice |
| `React.memo` | Chặn re-render khi props không đổi tham chiếu |
| Code splitting | Giảm initial bundle → First Contentful Paint nhanh hơn |
| Debounce (chờ im lặng) vs Throttle (giới hạn tần suất) | Search → debounce; scroll/resize → throttle |
| AbortController | Huỷ request cũ khi user đổi filter → tránh race condition |

## Bài tập thực hành

1. Dedupe `getCart` — [bài 9.1](08-exercises.md#bài-91-dedupe-getcart)
2. `Promise.allSettled` cho trang Home — [bài 9.2](08-exercises.md#bài-92-promisesallsettled-cho-trang-home)
3. Đo performance trước khi tối ưu — [bài 9.3](08-exercises.md#bài-93-đo-performance-trước-khi-tối-ưu)
4. Sửa `key={index}` trong `Payment.tsx` — [bài 9.4](08-exercises.md#bài-94-key-ổn-định-trong-list)
5. Tối ưu `useSelector` — [bài 9.5](08-exercises.md#bài-95-tối-ưu-useselector)
6. Thêm `React.lazy` cho route Admin.
7. Thêm `loading="lazy"` cho ảnh sản phẩm.
8. Tạo cache cho `getCategories` với hàm `invalidate`.

## Kết quả đạt được

- Có số liệu trước khi tối ưu, không tối ưu mù.
- Giảm số request trùng.
- Biết khi nào `useMemo` là thừa.

## Áp dụng vào Agrimarket

- `src/redux/userReducer/userReducer.ts` — slice `user`.
- `src/redux/config.ts` — store + persist.
- `src/utils/setting.ts` — `setStore`/`getStore` cho redux persist.

## Dấu hiệu sẵn sàng cho Phase 9

- [ ] Đo được số request trước/sau 1 tối ưu.
- [ ] Nêu được 1 trường hợp `useMemo` không đáng dùng.
- [ ] Giải thích được Immer ảnh hưởng thế nào tới `useSelector`.

---

# Phase 9 — Debugging & Problem Solving

## Kiến thức cần học

- Quy trình 7 bước (Understand → Locate → Debug → Root cause → Implement → Verify → Document).
- DevTools: Console, Network, Sources, Application.
- React DevTools (Props/State, Profiler, Highlight).
- Redux DevTools (actions, state diff, time travel).
- Debugger: breakpoints, conditional, step over/into, watch.
- Đọc stack trace.
- Phân biệt lỗi frontend / backend / network / auth.
- Tìm và loại bỏ lỗi, kiểm thử hồi quy.
- Viết test tối thiểu để tái hiện bug.

## Khái niệm quan trọng

| Khái niệm | Tại sao quan trọng |
|-----------|-------------------|
| Root cause vs symptom | Sửa symptom → bug quay lại |
| Frontend vs backend | 400 do payload sai (FE), 500 do server (BE) |
| Regression | Sửa 1 chỗ làm hỏng chỗ khác → luôn verify flow liên quan |
| Reproduce minimum | Code nhỏ nhất tái hiện → cô lập nhanh |
| Time travel debugging | Redux DevTools quay lại state trước khi bug xảy ra |

## Bài tập thực hành

1. Điều tra "Add to cart không hoạt động" — [bài 8.1](08-exercises.md#bài-81-điều-tra-bấm-add-to-cart-không-hoạt-động)
2. Điều tra trang Admin gọi API liên tục — [bài 8.2](08-exercises.md#bài-82-điều-tra-trang-admin-gọi-api-liên-tục)
3. Điều tra màn hình trắng — [bài 8.3](08-exercises.md#bài-83-điều-tra-tôi-không-thấy-gì-cả-màn-hình-trắng)
4. Tự tạo 3 bug nhỏ trong nhánh riêng, debug lại từ đầu, ghi root cause vào `docs/06-problem-solving.md`.
5. Đọc lại 4 case study trong `docs/06-problem-solving.md` và kể lại bằng lời của mình.

## Kết quả đạt được

- Debug 1 bug trong ≤ 20 phút mà không cần hỏi ai.
- Luôn tìm được root cause, không chỉ symptom.
- Biết khi nào bug thuộc frontend, khi nào thuộc backend.

## Dấu hiệu sẵn sàng cho Phase 10

- [ ] Kể lại 4 case study Agrimarket mà không cần mở code.
- [ ] Biết chính xác bước nào trong DevTools bạn mở đầu tiên và vì sao.
- [ ] Viết được 1 hướng dẫn debug cho người khác.

---

# Phase 10 — Project Explanation & Interview Preparation

## Kiến thức cần học

- Cách trình bày kiến trúc dự án trong 2 phút.
- Trình bày 1 feature end-to-end (luồng đầy đủ).
- Các quyết định kỹ thuật & trade-off.
- Đọc code của người khác.
- Chuẩn bị câu hỏi phỏng vấn theo 18 nhóm.
- Viết README/tài liệu kỹ thuật.
- Trả lời câu hỏi hệ thống (system design) cơ bản.

## Bài tập thực hành

1. Viết lời giới thiệu 2 phút về Agrimarket (dựa trên [WORK.md](../WORK.md)).
2. Vẽ kiến trúc tổng thể bằng Mermaid (đã có trong `WORK.md`).
3. Trình bày luồng login + refresh token trong 3 phút.
4. Trả lời 18 câu hỏi dự án trong `docs/07-interview-questions.md` § "Project-based interview questions".
5. Chọn 30 câu hỏi xỉu nhất trong `docs/07-interview-questions.md`, trả lời bằng miệng (không đọc) mỗi ngày 1 câu trong 1 tuần.
6. Giải 3 bài bất kỳ từ `docs/08-exercises.md` mà không mở lời giải.
7. Chuẩn bị 3 câu hỏi hỏi ngược interviewer.

## Kết quả đạt được

- Tự tin trình bày dự án trước interviewer.
- Trả lời câu hỏi kỹ thuật bằng ngôn ngữ tự nhiên, không học thuộc.
- Nêu được trade-off (ví dụ: "chọn adapter thay vì đổi component vì giữ nguyên UI theo yêu cầu").

## Áp dụng vào Agrimarket

Tài liệu chuẩn bị:
- [WORK.md](../WORK.md) — kiến trúc, tính năng, luồng.
- [docs/04-api-integration.md](04-api-integration.md) — bảng mapping API.
- [docs/06-problem-solving.md](06-problem-solving.md) — case study.
- [docs/07-interview-questions.md](07-interview-questions.md) — ngân hàng câu hỏi.
- [docs/08-exercises.md](08-exercises.md) — bài tập.

## Dấu hiệu "đã sẵn sàng"

- [ ] Trình bày kiến trúc dự án trong 2 phút mà không cần mở tài liệu.
- [ ] Vẽ được luồng đăng nhập / giỏ hàng / thanh toán.
- [ ] Trả lời 30 câu hỏi phỏng vấn mà không cần đọc.
- [ ] Giải thích được tại sao chọn adapter layer thay vì sửa component.
- [ ] Nêu được 3 bug đã tự tìm & sửa, kèm root cause.
- [ ] Biết điểm yếu của dự án và đề xuất cải tiến có ưu tiên.

---

## Ghi chú cuối

Lộ trình này được thiết kế để **đi đúng thứ tự**:
- JavaScript trước TypeScript (vì TS là siêu tập của JS).
- JavaScript trước React (hook dựa trên closure).
- React trước Next.js (hiểu client component thì mới hiểu RSC).
- API Integration sau React (cần component để gọi).
- Debugging ở cuối (cần đủ kiến thức để debug).
- Interview ở cuối cùng (cần project + kỹ thuật).

Học song song nhiều phase sẽ khiến mọi thứ đều nông. Đi tuần tự.
