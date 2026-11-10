# 03. React & Next.js (Part 11)

> Nguyên tắc: chỉ tài liệu hoá những gì **thực sự có trong dự án**. Phần Next.js được trình bày như **kiến thức nền để học**, và được đánh dấu rõ là **CHƯA có trong Agrimarket**.

---

## Phần A — React

> Agrimarket dùng **React 18** với **function component** + **hooks**. Không có class component.

---

## 1. Component architecture

**Ba khái niệm:**

| Khái niệm | Ý nghĩa | Ví dụ trong dự án |
|-----------|---------|-------------------|
| **Presentational** | Chỉ nhận props, không tự gọi API | `ButtonClick`, `Loading`, `NotFound` |
| **Container / Page** | Gọi API, quản lý state, ghép component | `CartProduct`, `Payment`, `MainProfile` |
| **Feature component** | Gom các phần của 1 tính năng | `src/container/Admin/` |

**Quy tắc phân tầng trong dự án:**

```
src/components/   ← tái sử dụng, nhận props
src/container/    ← page-level, gọi API + dispatch
src/apis/         ← tầng giao tiếp backend
src/utils/        ← hạ tầng (axios, adapter, storage)
src/redux/        ← shared state
```

Component trong `src/components/` **không nên** gọi API trực tiếp (trừ khi đó là điểm vào của feature như `CartProducts`).

---

## 2. Props & State

```typescript
type ProductCardProps = {
  product: productTypes;
  onAdd: (id: string) => void;
};

const ProductCard = ({ product, onAdd }: ProductCardProps) => (
  <button onClick={() => onAdd(product._id)}>Add</button>
);
```

**State — 3 loại:**

| Loại | Khai báo | Dùng khi |
|------|----------|----------|
| Local state | `useState` | State chỉ 1 component dùng |
| Derived state | tính trực tiếp trong render | Giá trị suy ra từ state/props khác |
| Global state | `useSelector` / `useDispatch` | State dùng ở nhiều component |

**Ví dụ derived state trong dự án:**

```typescript
// src/components/CartProducts/CartProduct.tsx
const product = useSelector((state: RootState) => state.user.product);
const lengthProduct = product.length;
const filterProduct = lengthProduct > 5 ? product.slice(0, 8) : product;
// ↑ Không cần useState cho filterProduct — suy ra trực tiếp
```

**Anti-pattern:** lưu vào `useState` thứ gì đó hoàn toàn suy ra được từ props/state khác → gây bug đồng bộ.

---

## 3. Component lifecycle (qua hooks)

| Giai đoạn | Class component | Function component |
|-----------|-----------------|--------------------|
| Khởi tạo | `constructor` / `state` | `useState` initial value |
| Render | `render` | Thân hàm component |
| Sau render (DOM updated) | `componentDidMount` / `componentDidUpdate` | `useEffect` (không có deps) |
| Trước khi DOM update | `componentWillUnmount` | `useEffect` return cleanup |
| Sẵn sàng dùng | `componentDidMount` | `useLayoutEffect` |

---

## 4. `useState`

```typescript
const [count, setCount] = useState(0);
const [user, setUser] = useState<profileType | null>(null);

// Cập nhật dựa trên state trước đó
setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
// ↑ Dùng functional update khi state mới phụ thuộc state cũ
```

**Áp dụng:**

```typescript
// src/container/Payment/Payment.tsx
const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
const [open, setOpen] = useState(false);
```

**Quy tắc quan trọng:**
- `setState` là **async** (batched). Đọc ngay sau `setState` trong cùng lệnh sẽ ra giá trị cũ.
- State không thay đổi trực tiếp: `setUser({...user, name: "x"})` — phải tạo object mới.

---

## 5. `useEffect`

```typescript
useEffect(() => {
  // 1. chạy sau render
  return () => {
    // 2. cleanup trước khi unmount / chạy lại
  };
}, [deps]);   // 3. deps: khi nào chạy lại
```

**Quy tắc deps:**

| Deps | Hành vi |
|------|---------|
| `[]` | Chạy 1 lần khi mount |
| `[a, b]` | Chạy lại khi `a` hoặc `b` đổi (so sánh bằng `Object.is`) |
| Không truyền | Chạy sau **mọi** render |

**Áp dụng — 3 pattern quan trọng trong dự án:**

```typescript
// Pattern 1: Fetch data khi dependency đổi
// src/container/Detail/page/ProductDetail/ProductDetail.tsx
useEffect(() => {
  const fetchProduct = async () => {
    const response = await getProductById(productId ?? "");
    dispatch(setProduct([response.data]));
  };
  fetchProduct();
}, [productId]);

// Pattern 2: Đồng bộ local state khi props/store đổi
// src/container/Payment/Payment.tsx
useEffect(() => {
  if (renderlist) {
    const initialQuantities = renderlist.reduce((acc, item) => {
      acc[item.product_id._id] = item.quantity;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }
}, [renderlist]);

// Pattern 3: Guard trước khi fetch
// src/container/Profile/Page/MainProfile.tsx
useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [isAuthenticated]);
```

**⚠️ Anti-pattern đã gặp trong dự án:**

```typescript
// ❌ SAI — gọi useEffect trong event handler
const handleInputChange = async (event: any) => {
  setAmount(event.target.value);
  useEffect(() => { handleInputChange; }, []);   // ❌ Vi phạm Rules of Hooks
};
```

Hook chỉ được gọi ở **top level** của component. Đã sửa trong task này.

**⚠️ Anti-pattern khác — gọi API trong render body:**

```typescript
// ❌ SAI — dispatch trong render → re-render → gọi lại → vòng lặp vô hạn
const supplier = async () => { ... };
supplier();

// ✅ ĐÚNG
useEffect(() => { supplier(); }, []);
```

Đã gặp & sửa trong `src/container/Admin/page/ProductAdmin/ProductAdmin.tsx`.

---

## 6. `useMemo`

```typescript
const filtered = useMemo(
  () => products.filter((p) => p.category?.slug === slug),
  [products, slug]
);
```

**Khi nào dùng:** phép tính **tốn** và tạo object/array mới (gây re-render con nếu truyền làm prop).

**Khi nào KHÔNG dùng:** phép tính rẻ (`length`, `slice` của mảng nhỏ). `useMemo` có chi phí (so sánh deps, cấp phát) — thường lớn hơn lợi ích.

**Áp dụng trong dự án:** chưa dùng ở đâu. Danh sách sản phẩm ≤ 8 item → chưa cần.

---

## 7. `useCallback`

```typescript
const handleAdd = useCallback((id: string) => { ... }, [dispatch]);
```

**Mục đích:** giữ **ổn định tham chiếu** để truyền cho component đã `React.memo`.

**⚠️ Không dùng để "tối ưu" — luôn.** `useCallback` chỉ có tác dụng khi:
1. Truyền cho `React.memo` component.
2. Truyền cho hook phụ thuộc vào định danh function (`useEffect` deps).

Nếu không → chỉ thêm chi phí.

---

## 8. `useRef`

```typescript
const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null));
inputRef.current[index + 1]?.focus();
```

**Áp dụng — `src/container/Auth/pages/Verification/Verification.tsx`:**

```typescript
const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null));
// ref callback gán DOM node
ref={(ref) => (inputRef.current[id] = ref as HTMLInputElement)}
```

**Khác `useState`:** `useRef` **không** gây re-render; giá trị `.current` đọc/ghi đồng bộ ngay.

---

## 9. Custom hooks

```typescript
// Custom hook: dùng lại logic có state + effect
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

**Quy tắc:** tên bắt đầu bằng `use`, dùng hook khác bên trong, trả về giá trị (không phải JSX).

**Áp dụng — đề xuất cho dự án:**

```typescript
// src/hooks/useProducts.ts  (đề xuất, chưa tạo)
export function useProducts() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.user.product);
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((res) => { if (!cancelled) dispatch(setProduct(res.data)); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [dispatch]);

  return { products, loading };
}
```

Hiện tại logic fetch bị **lặp** ở `CartProduct.tsx`, `Cart.tsx`, `Admin.tsx`, `ProductAdmin.tsx` → cơ hội rút gọn.

---

## 10. Context API

```typescript
const ThemeContext = React.createContext<ThemeType>("light");

// Provider
<ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>

// Consumer
const { theme } = useContext(ThemeContext);
```

**Áp dụng trong dự án:** ❌ **không dùng**. Redux Toolkit đóng vai trò của global state.

**Khi nào dùng Context thay Redux:**
- State nhỏ, ít consumer (theme, locale, current user).
- Không cần devtools, middleware, persistence.

**Vấn đề của Context:** mọi consumer re-render khi value đổi → tách nhiều Context nhỏ, hoặc memoize value.

---

## 11. Controlled vs Uncontrolled components

| | Controlled | Uncontrolled |
|---|---|---|
| State nằm ở | React (props + onChange) | DOM ( uncontrolled input ) |
| Đọc giá trị | `value` | `ref.current.value` |
| Validate | Dễ | Khó |
| Ví dụ | Ant Design `<Form.Item name="email">` | `<input ref={...} />` |

**Áp dụng — `Verification.tsx` là controlled:**

```typescript
const [OTP, setOTP] = useState<string[]>(Array(6).fill(""));
// ...
<input
  value={number}
  onChange={(event) => handleTextChange(event, id)}
  maxLength={1}
/>
```

**Áp dụng — Ant Design Form:**

```typescript
<Form onFinish={loginSubmit} name="normal_login">
  <Form.Item name="email" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>
// ↑ Ant Design quản lý state, onFinish trả về values
```

---

## 12. Component re-rendering

**Khi nào component re-render:**

1. `setState` của chính nó.
2. Props đổi (cha re-render).
3. `useSelector` trả về giá trị mới (qua `Object.is`).
4. `useContext` value đổi.
5. `useReducer` dispatch.

**Cách giảm re-render:**

```typescript
// 1. Memo hóa component
const ProductCard = React.memo(ProductCardImpl);

// 2. Dùng selector hẹp (chỉ lấy state cần thiết)
const cartnumber = useSelector((state: RootState) => state.user.cartnumber);
// ↑ tốt hơn: const user = useSelector(s => s.user) → re-render khi user bất kỳ đổi

// 3. useMemo cho object/array truyền làm props
const list = useMemo(() => items.filter(...), [items]);

// 4. useCallback cho function truyền cho memo component
```

**Áp dụng — `HeaderItem.tsx` dùng selector hẹp:**

```typescript
const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
const cartnumber = useSelector((state: RootState) => state.user.cartnumber);
```

---

## 13. Conditional rendering

```typescript
// 1. Ternary
{isAuthenticated === true ? <UserMenu /> : <LoginButton />}

// 2. Logical AND — chỉ dùng khi giá trị có thể là boolean
{isAuthenticated && <UserMenu />}

// 3. && với số → bug: 0 sẽ render ra "0"
{count && <Badge count={count} />}   // ❌ count = 0 → hiện chữ "0"

// ✅
{count > 0 && <Badge count={count} />}
```

**Áp dụng:** `HeaderItem.tsx` dùng ternary — an toàn.

---

## 14. List rendering & keys

```typescript
{items.map((item) => <Row key={item._id} />)}
```

| Key | Ưu | Nhược |
|-----|-----|-------|
| `id` (unique) | ✅ Đúng | Cần id ổn định |
| `index` | Đơn giản | ❌ Sai khi sort/reorder/filter — React tái sử dụng sai component → hiển thị sai dữ liệu |

**Áp dụng:**

```typescript
// ✅ Đúng — src/components/CartProducts/CartProduct.tsx
{filterProduct.map((product) => <div key={product._id}>...</div>)}

// ⚠️ Cần cải thiện — src/container/Payment/Payment.tsx
{renderlist.map((cart, index) => <tr key={index}>...</tr>)}
// → nên dùng key={cart.product_id._id}
```

---

## 15. Error boundaries

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}
```

**Lưu ý:** Error boundary **bắt buộc là class component** (React không hỗ trợ hook cho việc này). Nó chỉ bắt lỗi **render** — không bắt lỗi trong event handler hay async callback.

**Áp dụng:** ❌ **chưa có** trong dự án. Đề xuất bọc `<Routes>` trong `App.tsx`.

---

## 16. State lifting

Đưa state lên component cha khi nhiều con cần dùng.

**Áp dụng trong dự án:** `Payment.tsx` giữ `quantities` ở chính nó (cha của bảng) — đúng.

---

## 17. Component composition

```typescript
// Children pattern
type LayoutProps = { children: React.ReactNode };
const Layout = ({ children }: LayoutProps) => <div>{children}</div>;

// Render props
<Table dataSource={data} columns={columns} />

// Compound components
<Form>
  <Form.Item name="email"><Input /></Form.Item>
</Form>
```

**Áp dụng:** Ant Design `Form` / `Form.Item` là compound component — `Form.Item` đọc context từ `Form` để biết field name.

---

## 18. Suspense & Lazy

```typescript
// src/App.tsx
const App = () => (
  <Suspense fallback={<Loading />}>
    <Routes>...</Routes>
  </Suspense>
);

// src/routes/routes.ts
const MainHome = React.lazy(() => import("../container/Home/page/MainHome"));
```

**Cơ chế:** `React.lazy` trả component promise; `Suspense` render `fallback` trong lúc chờ chunk tải xong.

**Áp dụng — đã dùng ở toàn bộ routes.** Đây là code-splitting hiệu quả nhất cho SPA.

---

# Phần B — Next.js

> ⚠️ **QUAN TRỌNG:** Agrimarket **KHÔNG dùng Next.js**. Đây là Vite + React SPA thuần.
> Phần này trình bày kiến thức Next.js để bạn hiểu & phỏng vấn được, đồng thời chỉ rõ **sự khác biệt** so với dự án hiện tại.

## 1. Next.js là gì?

Framework React cho **full-stack**: gộp frontend (React) + backend (API routes, Server Actions) + build tool + SSR/SSG.

| | Vite (Agrimarket) | Next.js |
|---|---|---|
| Rendering | CSR (Client-Side Rendering) | SSR / SSG / ISR / CSR |
| Routing | `react-router-dom` (cấu hình thủ công) | File-based routing (`app/` hoặc `pages/`) |
| Backend | Backend riêng (NestJS) | API routes tích hợp |
| Build | `vite build` → static assets | `next build` → server + static |
| SEO | Yếu (SPA) | Tốt (SSR/SSG) |
| Deploy | Static hosting (Netlify, Vercel, Nginx) | Node server hoặc Vercel |

## 2. Pages Router vs App Router

| | Pages Router | App Router (mới, khuyến nghị) |
|---|---|---|
| Thư mục | `pages/` | `app/` |
| File page | `pages/index.tsx` | `app/page.tsx` |
| Layout | `_app.tsx`, `_document.tsx` | `app/layout.tsx` |
| Data fetching | `getServerSideProps`, `getStaticProps` | `async` Server Component, `fetch` trực tiếp |
| API routes | `pages/api/*.ts` | `app/api/*/route.ts` |
| Rendering | Tách rõ client/server | React Server Components mặc định |
| Metadata | `next/head` | `export const metadata` |

## 3. Routing

**Agrimarket (React Router):**

```typescript
// src/config/routes.ts
const routes: routeTypes = {
  home: "/",
  productDetail: "/product/:productId",
  ...
};

// src/routes/routes.ts
const ProductDetail = React.lazy(() => import("../container/Detail/page/ProductDetail/ProductDetail"));
export { publicRoute } from "./routes";

// src/App.tsx
<Routes>
  {publicRoute.map((route, index) => (
    <Route key={index} path={route.path} element={<route.component />} />
  ))}
</Routes>
```

**Next.js (App Router):**

```
app/
  layout.tsx           ← root layout (tương đương Provider + PersistGate)
  page.tsx             ← trang "/"
  products/
    page.tsx           ← trang "/products"
    [id]/
      page.tsx         ← trang "/products/:id" (dynamic route)
  api/
    products/route.ts  ← API endpoint
```

```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.API_URL}/products/${params.id}`);
  const product = await res.json();
  return <div>{product.name}</div>;
}
```

## 4. Dynamic routes

| React Router | Next.js App Router |
|--------------|-------------------|
| `path: "/product/:productId"` | `app/product/[productId]/page.tsx` |
| `useParams().productId` | `params.productId` (server) hoặc `useParams()` (client) |

**Áp dụng Agrimarket:**

```typescript
// src/container/Detail/page/ProductDetail/ProductDetail.tsx
const { productId } = useParams();
```

## 5. API routes

```typescript
// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const products = await fetch(`${process.env.API_URL}/products`).then((r) => r.json());
  return NextResponse.json({ statusCode: 200, data: products.data });
}
```

**Khác biệt quan trọng:** trong Next.js, `process.env` (không phải `VITE_`) dùng được cho **secret** vì chạy server-side. Đây là lý do tác vụ này yêu cầu không expose Swagger credentials qua `NEXT_PUBLIC_`.

**Đối chiếu:** trong Agrimarket (Vite), secret **không thể** đặt trong frontend — mọi biến `VITE_*` đều public.

## 6. Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("ACCESS_TOKEN");
  if (!token && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
```

**Đối chiếu Agrimarket:** chưa có middleware; việc guard admin làm trong component (`Admin.tsx` → `profileChecked` + `navigate("*")`).

## 7. Server-side rendering (SSR)

```typescript
// Pages Router
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/products");
  return { props: { products: await res.json() } };
}

// App Router
export default async function Page() {
  const products = await getProducts();   // async server component
  return <ProductList products={products} />;
}
```

**Khi nào dùng:** nội dung phụ thuộc SEO (landing page, blog, sản phẩm), nội dung thay đổi theo user.

## 8. Static generation (SSG)

```typescript
// Pages Router
export async function getStaticProps() {
  return { props: { products }, revalidate: 60 };
}

// App Router
export const revalidate = 60;   // ISR
```

**Khi nào dùng:** nội dung không đổi hoặc đổi ít (trang tĩnh, blog).

## 9. Client-side rendering

```typescript
"use client";   // đánh dấu Client Component

"use client";

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

**Đối chiếu:** **Toàn bộ Agrimarket là CSR.** Mọi dữ liệu được fetch sau khi JS chạy.

**Hệ quả (nên nói trong phỏng vấn):**
- ✅ Ưu: deploy đơn giản, static hosting rẻ, tương tác mượt sau lần tải đầu.
- ❌ Nhược: SEO kém, first paint chậm, "flash of empty content" khi API chậm.

**Cải tiến có thể đề xuất cho Agrimarket:**
- Skeleton loading thay vì spinner.
- Preload data (React Router `loaders` — hiện đã có `defer`).
- SSR/SSG nếu cần SEO cho trang sản phẩm (chuyển sang Next.js hoặc dùng Vite SSR).

## 10. Data fetching

| Cách | Mô tả |
|------|-------|
| Server Component `fetch` | Mặc định trong App Router, cached |
| `useEffect` + fetch | Cách phổ biến nhất trong SPA — **Agrimarket dùng cách này** |
| SWR / React Query | Cache, revalidate, dedupe, optimistic update |
| Server Actions | Mutation từ server component |

**Áp dụng Agrimarket:** `useEffect` + helper trong `src/apis/index.ts`.

**Cải tiến đề xuất:** thêm **React Query** sẽ giải quyết 3 vấn đề hiện tại:
- Request trùng lặp (Header + CartProduct + Cart đều gọi `getCart`).
- Loading/error state thủ công.
- Cache & revalidation.

## 11. Authentication integration

| | Agrimarket (CSR) | Next.js |
|---|---|---|
| Nơi lưu token | `localStorage` + cookie | `httpOnly` cookie (khuyến nghị) |
| Middleware guard | ❌ (guard trong component) | ✅ `middleware.ts` |
| Server-side check | ❌ | `getServerSideProps` / Server Component đọc cookie |
| Ưu điểm cookie | — | JS không đọc được → chống XSS đánh cắp token |

**Áp dụng:** nếu chuyển Agrimarket sang Next.js, chuyển access token sang `httpOnly` cookie là bước nâng cấp bảo mật đáng làm nhất.

## 12. Environment variables

| Next.js | Vite (Agrimarket) |
|---------|--------------------|
| `process.env.X` — server only | `import.meta.env.VITE_X` — **luôn public** |
| `process.env.NEXT_PUBLIC_X` — public | `import.meta.env.VITE_X` |
| Đặt trong `.env.local` | `.env.local` |

> `NEXT_PUBLIC_*` = `VITE_*` → **không bao giờ** dùng cho secret.

## 13. Image optimization

```typescript
// Next.js
import Image from "next/image";
<Image src="/avatar.jpg" width={500} height={500} alt="Avatar" />
// → tự sinh srcset, lazy-load, placeholder blur
```

**Đối chiếu Agrimarket:** dùng `<img>` thuần với URL từ API. Đề xuất cải tiến:

```typescript
<img
  src={product.thumbnail_url}
  alt={product.name}
  loading="lazy"
  decoding="async"
  width={400}
  height={200}
/>
```

## 14. SEO

| | CSR (Agrimarket) | SSR/SSG (Next.js) |
|---|---|---|
| Crawler đọc nội dung | ❌ (JS chưa chạy) | ✅ |
| Meta tags | Phải dùng `react-helmet` | `export const metadata` |
| Open Graph | Như trên | Built-in |
| JSON-LD | Nhập tay | Nhập tay |

**Áp dụng Agrimarket:** trang chi tiết sản phẩm (`/product/:id`) là nơi SEO quan trọng nhất. Hiện tại nội dung chỉ có sau khi JS chạy.

**Đề xuất cải tiến (không làm trong task này):**
1. Thêm `react-helmet-async` cho meta tags.
2. Hoặc chuyển sang Next.js với SSG cho trang sản phẩm.

## 15. Loading & error handling

```typescript
// Next.js — loading.tsx / error.tsx
app/products/loading.tsx   → skeleton tự động
app/products/error.tsx     → error boundary
```

**Đối chiếu Agrimarket:**
- Loading: `src/components/Loading/Loading.tsx` + `<Suspense fallback={<Loading />}>`. Chưa có skeleton cho danh sách.
- Error: ❌ chưa có Error Boundary.

---

## Bảng tổng hợp: khái niệm nào dùng ở đâu

| Khái niệm | Agrimarket | Next.js |
|-----------|------------|---------|
| Function component | ✅ Mọi file | ✅ |
| Hooks (useState/useEffect/useRef) | ✅ | ✅ |
| `React.lazy` + `Suspense` | ✅ | ✅ (route-based splitting tự động) |
| Class component | ❌ | ✅ (Error Boundary bắt buộc class) |
| Context API | ❌ (dùng Redux) | ✅ |
| Custom hooks | ❌ (chưa có) | ✅ |
| React Router | ✅ `react-router-dom` | ❌ (dùng file routing) |
| Redux Toolkit | ✅ | ✅ (thường dùng server state thay vì client state) |
| `useSelector` | ✅ | ✅ |
| API routes | ❌ (backend riêng) | ✅ |
| Middleware | ❌ | ✅ |
| SSR/SSG | ❌ | ✅ |
| `next/image` | ❌ (dùng `<img>`) | ✅ |
| Metadata API | ❌ | ✅ |
