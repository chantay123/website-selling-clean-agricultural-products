# 02. Roadmap TypeScript (Part 10)

> Mỗi topic: cú pháp → cách dùng thực tế → lỗi thường gặp → câu hỏi phỏng vấn → áp dụng cho Agrimarket.

---

## Mục lục

- [10.1 TypeScript Fundamentals](#101-typescript-fundamentals)
- [10.2 TypeScript Intermediate](#102-typescript-intermediate)
- [10.3 TypeScript Advanced](#103-typescript-advanced)
- [Typing trong Agrimarket](#typing-trong-agrimarket)

---

# 10.1 TypeScript Fundamentals

## 1. Vì sao dùng TypeScript?

| Lợi ích | Giải thích |
|---------|------------|
| Bắt lỗi sớm | Sai kiểu dữ liệu → lỗi compile, không phải lỗi runtime |
| Tự động hoàn thành | Editor biết shape của object |
| Tài liệu hóa | Interface là "hợp đồng" dữ liệu |
| Refactor an toàn | Đổi tên field → compiler chỉ ra chỗ cần sửa |

**Quan trọng:** TypeScript **không** làm code an toàn hơn ở runtime. Types bị **xoá khi compile**. Ranh giới: TS bảo vệ lúc viết code, runtime validation (zod, class-validator) bảo vệ lúc chạy.

---

## 2. Type inference

```typescript
let count = 5;        // number (suy ra từ giá trị)
let name = "Rose";    // string
let items = [];       // any[] ⚠️ — tránh, dùng `const items: ProductType[] = []`
```

**Quy tắc:** để TS tự suy ra khi rõ ràng; chỉ annotate khi:
- Khai báo rỗng → `const items: ProductType[] = []`
- Biến có thể đổi kiểu → `let value: string | number`
- Function return → `function getId(): string`

---

## 3. Type annotations

```typescript
const productName: string = "Apple";
const price: number = 8.5;
const inStock: boolean = true;
const nothing: undefined = undefined;
const empty: null = null;
const anyValue: any = "anything";      // ⚠️ tắt type check
const safe: unknown = "anything";       // ✅ an toàn hơn any
```

---

## 4. Primitive types

```typescript
let age: number = 25;
let name: string = "Rodriguez";
let isAdmin: boolean = false;
let big: bigint = 100n;
let id: symbol = Symbol("id");
```

---

## 5. Arrays & Tuples

```typescript
const products: productTypes[] = [];
const names: string[] = ["a", "b"];
const scores: number[] = [1, 2, 3];

// Tuple — số phần tử & kiểu cố định
type ProductAttribute = {
  _id: string;
  weight: number;
};

type Coords = [number, number];
const point: Coords = [10, 20];

// Tuple có label (TS 4.0+)
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```

**Áp dụng:** `src/@type/global.type.ts` định nghĩa `productTypes`, `cartTypes`, `cartItemType`...

---

## 6. Objects

```typescript
const product: productTypes = {
  _id: "abc",
  name: "Apple",
  slug: "apple",
  description: "...",
  origin: "Vietnam",
  category_id: {},
  thumbnail_url: "...",
  productAttributes: [],
  category: { _id: "c1", name: "Fruit", slug: "fruit" },
  total_price: 100,
};
```

---

## 7. Interfaces

```typescript
interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  items?: productTypes[];   // optional
  image?: string;
}
```

**Đặc điểm:**
- Chỉ dùng cho **object**.
- **Declaration merging** (khai báo cùng tên ở 2 nơi → gộp lại) — ưu điểm lớn cho library.
- `interface X extends Y` — kế thừa.

### Áp dụng

```typescript
// src/@type/global.type.ts
export type categoryTypes = {
  _id: string;
  name: string;
  slug: string;
};
```

> Dự án dùng `type` alias thay vì `interface` cho hầu hết — hoàn toàn hợp lệ.

---

## 8. Type aliases

```typescript
type ProductId = string;
type Id = string | number;
type Handler = (id: string) => void;
type Nullable<T> = T | null;
```

**Khác interface:**
| | `type` | `interface` |
|---|---|---|
| Primitive | ✅ | ❌ |
| Union | ✅ | ❌ (phải qua `type`) |
| Intersection | ✅ | ✅ (`extends`) |
| Declaration merging | ❌ | ✅ |
| Generic | ✅ | ✅ |

**Quy tắc thực tế:** dùng `type` cho hầu hết; dùng `interface` khi cần declaration merging hoặc khi muốn mở rộng type từ module khác.

---

## 9. Optional properties

```typescript
interface Product {
  name: string;
  description?: string;   // có thể undefined
}

const p: Product = { name: "Apple" };   // ✅
const q: Product = { name: "Apple", description: undefined };  // ✅ (exactOptionalPropertyTypes tắt)
```

**Khác với `| undefined`:** `a?: string` nghĩa là "có thể không có" và cũng cho phép gán `undefined` khi `exactOptionalPropertyTypes` tắt.

---

## 10. Union types

```typescript
type Status = "idle" | "loading" | "success" | "error";
type Role = "User" | "Admin";
type Value = string | number | boolean;
```

### Discriminated union (xem 10.2)

---

## 11. Intersection types

```typescript
type Base = { id: string; createdAt: string };
type WithUser = { userId: string };

type User = Base & WithUser;
// User = { id, createdAt, userId }
```

**Áp dụng:** `src/@type/global.type.ts` → `extendedProductType = productTypes & { key: string }`.

```typescript
export type extendedProductType = productTypes & { key: string };
```

---

## 12. Literal types

```typescript
type Direction = "left" | "right";
type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

const status: StatusCode = 200;   // ✅
const bad: StatusCode = 999;     // ❌
```

---

## 13. Enums

```typescript
enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
}

const s: Status = Status.Idle;
```

**Vấn đề của enum:** tạo runtime object, không tương thích `isolatedModules` hoàn hảo, tăng bundle size.

**Khuyến nghị hiện đại:** dùng **union type + `as const`** thay vì enum:

```typescript
const STATUS = {
  Idle: "idle",
  Loading: "loading",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
// Status = "idle" | "loading"
```

> Dự án có `http-status-codes` trong deps nhưng không dùng enum ở code mới.

---

## 14. Function types

```typescript
type ApiFn = (endpoint: string, method: string) => Promise<unknown>;

const handler: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
  console.log(e);
};
```

**Optional & default params:**

```typescript
const getApiErrorMessage = (error: unknown, fallback = "Đã xảy ra lỗi") => { ... };
```

**Rest params:**

```typescript
const sum = (...nums: number[]): number => nums.reduce((a, b) => a + b, 0);
```

---

## 15. `void` và `never`

```typescript
function logMessage(msg: string): void { console.log(msg); }   // không return giá trị

function throwError(msg: string): never { throw new Error(msg); }  // không bao giờ return
```

**Ứng dụng `never`:** exhaustiveness check.

```typescript
type Action =
  | { type: "ADD"; product: productTypes }
  | { type: "REMOVE"; id: string };

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": return { ...state, items: [...state.items, action.product] };
    case "REMOVE": return { ...state, items: state.items.filter(i => i._id !== action.id) };
    default: {
      const _exhaustive: never = action;   // compile error nếu thêm case mà quên xử lý
      return _exhaustive;
    }
  }
}
```

---

## 16. `any` vs `unknown`

| | `any` | `unknown` |
|---|---|---|
| Gán giá trị bất kỳ | ✅ | ✅ |
| Dùng như bất kỳ kiểu | ✅ | ❌ phải narrow |
| Mất type safety | ❌ | ✅ |
| ESLint | `@typescript-eslint/no-explicit-any` error | OK |

```typescript
let a: any = "hello";
a.foo();          // ✅ biên dịch được — mất hoàn toàn an toàn

let u: unknown = "hello";
u.foo();          // ❌ lỗi compile — phải narrow trước
if (typeof u === "string") { u.toUpperCase(); }   // ✅
```

**Áp dụng:** `src/utils/api.adapter.ts` dùng `LooseRecord = Record<string, unknown>` thay vì `any` — đúng hướng.

---

## 17. Type assertions

```typescript
const data = response.data as apiResponseType<productTypes[]>;
const el = document.getElementById("root")!;
```

**Quy tắc:** assertion là "tôi chắc chắn". Chỉ dùng khi thật sự chắc. Sai → lỗi runtime im lặng.

**Áp dụng:** `src/apis/index.ts` dùng `response.data as apiResponseType<T>` — chấp nhận được vì `requestApi` trả `AxiosResponse` đã biết kiểu.

---

# 10.2 TypeScript Intermediate

## 1. Generics

```typescript
function identity<T>(arg: T): T { return arg; }

const num = identity<number>(5);
const str = identity("hello");   // T suy ra = string
```

---

## 2. Generic functions

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const p = first<productTypes>(products);   // productTypes | undefined
```

**Áp dụng trong adapter:**

```typescript
// src/utils/api.adapter.ts
export const normalizeProduct = <T extends LooseRecord>(product: T) => { ... };
export const normalizeProducts = <T extends LooseRecord>(products: T[] | null | undefined) =>
  Array.isArray(products) ? products.map(normalizeProduct) : [];
```

Generic giữ **thông tin kiểu gốc** trong khi vẫn cho phép thêm field. Nếu dùng `any` → mất hết thông tin.

> ⚠️ Lưu ý cú pháp trong file `.ts` (không phải `.tsx`): `<T extends LooseRecord>` OK. Trong `.tsx` phải viết `<T extends LooseRecord,>` hoặc `<T extends LooseRecord>` với `extends` (TS đã hỗ trợ từ 4.x với `extends`).

---

## 3. Generic interfaces

```typescript
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
}
```

**Áp dụng — đây chính là envelope của Agrimarket:**

```typescript
// src/@type/global.type.ts
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};
```

Dùng ở `src/apis/index.ts`:

```typescript
const payload = response.data as apiResponseType<productTypes[]>;
```

→ `payload.data` có kiểu `productTypes[]` (không phải `any`).

---

## 4. Generic constraints

```typescript
function getId<T extends { _id: string }>(item: T): string {
  return item._id;
}

getId({ _id: "1", name: "Apple" });   // ✅
getId({ name: "Apple" });             // ❌ thiếu _id
```

---

## 5. `keyof`

```typescript
interface Product {
  name: string;
  price: number;
}

type ProductKeys = keyof Product;   // "name" | "price"

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

get(product, "price");   // number
get(product, "oops");    // ❌ lỗi compile
```

---

## 6. `typeof`

```typescript
const product = { name: "Apple", price: 8 };
type Product = typeof product;   // { name: string; price: number }
```

**Dùng với `keyof`:**

```typescript
type ProductKeys = keyof typeof product;   // "name" | "price"
```

---

## 7. Indexed access types

```typescript
type Product = { name: string; attributes: { weight: number }[] };

type Attr = Product["attributes"][number]["weight"];   // number
```

**Tương đương `ReturnType`:**

```typescript
type Fn = () => string;
type Result = Fn extends () => infer R ? R : never;   // string
```

---

## 8. Type narrowing

```typescript
function print(value: string | number | undefined) {
  if (value === undefined) return;
  if (typeof value === "string") {
    value.toUpperCase();    // ✅ narrowed to string
  } else {
    value.toFixed(2);      // ✅ narrowed to number
  }
}
```

**Các guard có sẵn:** `typeof`, `instanceof`, `in`, `=== null`, truthiness, `Array.isArray`.

---

## 9. Type guards (custom)

```typescript
interface Product { name: string; }
interface Category { slug: string; }

function isProduct(x: unknown): x is Product {
  return typeof x === "object" && x !== null && "name" in x;
}
```

**Áp dụng — `getApiErrorMessage` dùng duck typing:**

```typescript
// src/utils/api.adapter.ts
const axiosError = error as {
  message?: string;
  response?: { data?: LooseRecord };
};
const data = axiosError?.response?.data;
if (typeof data?.message === "string") return data.message;
```

---

## 10. Discriminated unions

```typescript
type Response<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handle<T>(res: Response<T>) {
  if (res.status === "success") {
    res.data;        // ✅ T
  } else {
    res.error;       // ✅ string
  }
}
```

**Áp dụng — envelope API có `statusCode`:**

```typescript
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};

export type apiErrorType = {
  message: string;
  errors?: Record<string, { type: string; msg: string; path: string }>;
  statusCode?: number;
};
```

Có thể dùng `statusCode` làm discriminant để narrow giữa success/error.

---

## 11–19. Utility types

```typescript
interface Product {
  _id: string;
  name: string;
  price: number;
  hot?: boolean;
}

// Partial<T> — tất cả field optional
type P = Partial<Product>;
// { _id?: string; name?: string; price?: number; hot?: boolean }

// Required<T> — tất cả field bắt buộc
type R = Required<Product>;

// Pick<T, K> — chọn field
type PickP = Pick<Product, "_id" | "name">;

// Omit<T, K> — loại field
type OmitP = Omit<Product, "hot">;

// Record<K, V> — object có key định kiểu
type ById = Record<string, productTypes>;
const map: ById = { a: product };

// Readonly<T> — không sửa được
type RO = Readonly<Product>;

// Exclude<T, U> — loại thành viên khỏi union
type E = Exclude<"a" | "b" | "c", "b">;   // "a" | "c"

// Extract<T, U> — giữ thành viên khớp
type X = Extract<"a" | "b" | "c", "a" | "b">;   // "a" | "b"

// NonNullable<T> — loại null | undefined
type NN = NonNullable<string | null>;   // string
```

**Áp dụng thực tế — `src/apis/index.ts`:**

```typescript
export const getFavoriteProducts = async () => {
  const response = await requestApi("users/products/favorites", "GET", {});
  const payload = response.data as apiResponseType<FavoriteType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};
```

`Array.isArray` hoạt động như một **type guard** — sau đó `payload.data` được narrow thành `FavoriteType[]`.

---

## 20. `ReturnType`

```typescript
function getProducts() { return [1, 2, 3]; }
type R = ReturnType<typeof getProducts>;   // number[]
```

**Dùng để tránh lặp type:**

```typescript
type ApiHelper = typeof requestApi;
type ProfileResponse = Awaited<ReturnType<typeof getMyProfile>>;
```

---

## 21. `Parameters`

```typescript
function update(id: string, payload: { name: string }) {}
type P = Parameters<typeof update>;   // [id: string, payload: { name: string }]
```

---

## 22. Extending interfaces

```typescript
interface Base { _id: string; createdAt: string; }
interface Product extends Base {
  name: string;
  attributes: ProductAttribute[];
}

// Kết hợp với utility type
interface ProductRow extends Omit<Product, "hot"> {
  key: string;
}
```

**Áp dụng:** `extendedProductType = productTypes & { key: string }` (dùng intersection vì `productTypes` là `type` alias, không `interface`).

---

## 23. Declaration files (`.d.ts`)

```typescript
// src/vite-env.d.ts — khai báo env variables
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_OTP_LENGTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Tại sao quan trọng:** khai báo `ImportMetaEnv` giúp `import.meta.env.VITE_API_URL` có kiểu `string` thay vì `any`, và báo lỗi compile nếu typo tên biến.

---

## 24. Typing API responses

**Pattern chuẩn — generic envelope:**

```typescript
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};

// Helper
export const getProducts = async () => {
  const response = await requestApi("products", "GET", {});
  const payload = response.data as apiResponseType<productTypes[]>;
  return { ...payload, data: normalizeProducts(payload.data) };
};
```

**Vấn đề:** `as` là assertion — không kiểm tra runtime. Nếu backend đổi shape → lỗi runtime im lặng.

**Giải pháp nâng cao — runtime validation:**

```typescript
// Dùng zod
import { z } from "zod";

const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  attributes: z.array(z.object({ weight: z.number() })).optional(),
});

const product = productSchema.parse(response.data.data);  // throw nếu sai shape
```

> Dự án **chưa** dùng runtime validation. Đây là **đề xuất cải tiến**, không phải hiện trạng.

---

## 25. Typing React props & hooks

```typescript
// Props
type ProductCardProps = {
  product: productTypes;
  onAdd: (id: string) => void;
};

const ProductCard = ({ product, onAdd }: ProductCardProps) => { ... };

// Children
type LayoutProps = {
  children: React.ReactNode;
};

// Custom hook
function useProducts() {
  const [products, setProducts] = useState<productTypes[]>([]);
  const [loading, setLoading] = useState(false);
  return { products, loading };
}
```

**Áp dụng — `src/@type/button.type.ts`:**

```typescript
type buttonType = {
  onclick?: () => void | Promise<void>;
  className?: string;
};
const ButtonClick: React.FC<buttonType> = ({ onclick, className }) => { ... };
```

---

# 10.3 TypeScript Advanced

## 1. Conditional types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;    // true
type B = IsString<number>;    // false
```

**Phân phối trên union:**

```typescript
type ToArray<T> = T extends any ? T[] : never;
type C = ToArray<string | number>;   // string[] | number[]
```

**Ứng dụng thực tế — `apiResponseType`:**

```typescript
type ApiResult<T> = {
  statusCode: number;
  data: T;
};

type Unwrap<T> = T extends ApiResult<infer U> ? U : never;
type P = Unwrap<ApiResult<productTypes>>;   // productTypes
```

---

## 2. Mapped types

```typescript
type Getters<T> = { [K in keyof T]: () => T[K] };

type ProductGetters = Getters<{ name: string; price: number }>;
// { name: () => string; price: () => number }

// Kèm modifier
type ReadonlyAll<T> = { readonly [K in keyof T]: T[K] };
type OptionalAll<T> = { [K in keyof T]?: T[K] };
```

**Áp dụng — `Partial`, `Pick`, `Omit` đều là mapped types.**

---

## 3. Template literal types

```typescript
type Event = "click" | "focus";
type Handler = `on${Capitalize<Event>}`;
// "onClick" | "onFocus"

type Path = `/products/${string}`;
// "/products/abc" | "/products/xyz" | ...
```

**Ứng dụng:** type-safe route params, typed design system props.

---

## 4. `infer` keyword

```typescript
type Unpack<T> = T extends Array<infer U> ? U : never;
type Item = Unpack<productTypes[]>;   // productTypes

type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;
type R = GetReturn<typeof getProducts>;   // Promise<...>
```

**Áp dụng trong `src/apis/index.ts` — tránh viết lại kiểu response:**

```typescript
type ResponseOf<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>;
```

---

## 5. Recursive types

```typescript
type Category = {
  name: string;
  children: Category[];   // đệ quy
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
```

**Ứng dụng:** cây category, cây menu admin (`items` có `children`).

---

## 6. Generic utility design

```typescript
// Utility: trả về kiểu của hàm, bọc promise
type Api<T> = () => Promise<T>;

function createApi<T>(fn: Api<T>) {
  return async (...args: Parameters<Api<T>>): Promise<T> => fn(...args);
}
```

**Áp dụng — `src/apis/index.ts` có thể refactor thành:**

```typescript
const endpoint = <T>(path: string, method: string, body?: unknown) =>
  requestApi(path, method, body).then((r) => r.data as apiResponseType<T>);
```

> Chưa áp dụng trong dự án (giữ nguyên code hiện tại theo yêu cầu bảo toàn).

---

## 7. Strict type checking

`tsconfig.json` hiện tại của dự án:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Ý nghĩa từng flag:**

| Flag | Tác dụng |
|------|----------|
| `strict` | Bật tất cả strict checks |
| `strictNullChecks` | `null`/`undefined` không gán được cho mọi kiểu → bắt lỗi phổ biến nhất |
| `noImplicitAny` | Biến không kiểu mà không suy ra được → lỗi |
| `noUnusedLocals` | Biến import không dùng → lỗi (giúp dọn code) |
| `noUnusedParameters` | Param không dùng → lỗi |
| `noFallthroughCasesInSwitch` | `case` thiếu `break` → lỗi |

**Kết quả:** `npx tsc --noEmit` → **0 error**.

---

## 8. Type-safe API clients

```typescript
// Pattern: generic envelope + typed helper
export type apiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  dateTime: string;
};

export type apiErrorType = {
  message: string;
  errors?: Record<string, { type: string; msg: string; path: string }>;
  statusCode?: number;
};
```

**Áp dụng — đây chính là 2 type được thêm trong task này**, dùng ở mọi helper của `src/apis/index.ts`.

---

## 9. Runtime validation vs compile-time types

| | Compile-time (TS) | Runtime validation (zod/yup) |
|---|---|---|
| Khi chạy | Không | Có |
| Bắt lỗi data từ API | ❌ | ✅ |
| Overhead | 0 | Nhỏ |
| Khi nào cần | Luôn | Khi data đến từ nguồn ngoài (API, localStorage, URL) |

**Áp dụng cho Agrimarket — các nguồn data không tin được:**

| Nguồn | Rủi ro |
|-------|--------|
| API response | Shape có thể đổi bất cất |
| `localStorage` | User có thể sửa DevTools |
| `URLSearchParams` | User có thể sửa URL |
| `import.meta.env` | Chuỗi, không kiểu |

**Đề xuất (chưa áp dụng):**

```typescript
const tokenSchema = z.string().min(20);
const accessToken = tokenSchema.safeParse(getStore(ACCESS_TOKEN));
if (!accessToken.success) clearTokens();
```

---

## 10. TypeScript compiler configuration

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

**Giải thích từng flag quan trọng:**

| Flag | Tác dụng |
|------|----------|
| `target` | ES syntax được hỗ trợ |
| `moduleResolution: "bundler"` | Theo cách Vite resolve import |
| `isolatedModules` | Mỗi file phải độc lập (yêu cầu của esbuild/Vite) |
| `noEmit` | Chỉ type-check, Vite lo build |
| `skipLibCheck` | Bỏ qua lỗi type trong `node_modules` (nhanh hơn nhiều) |
| `resolveJsonModule` | Import file `.json` như object |

---

## 11. Type-safe error handling

**Pattern:**

```typescript
// 1. Định nghĩa error type
export type apiErrorType = {
  message: string;
  errors?: Record<string, { type: string; msg: string; path: string }>;
  statusCode?: number;
};

// 2. Hàm trích message an toàn
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
  const errors = data.errors as Record<string, { msg?: string } | string> | undefined;
  const first = errors ? Object.values(errors)[0] : undefined;
  if (first && typeof first === "object") return first.msg || fallback;
  if (typeof first === "string") return first;
  return fallback;
};
```

**Điểm mấu chốt:** nhận `error: unknown` (không phải `any`) → buộc caller phải xử lý an toàn.

---

# Typing trong Agrimarket

## Bảng type ↔ nơi sử dụng

| Type | Định nghĩa | Dùng ở |
|------|-----------|---------|
| `routeTypes` | `src/@type/global.type.ts` | `src/config/routes.ts` |
| `productTypes` | `src/@type/global.type.ts` | `apis/index.ts`, `CartProduct.tsx`, `Admin.tsx`… |
| `ProductAttribute` | `src/@type/global.type.ts` | `normalizeProduct`, `Admin.tsx` |
| `cartTypes` / `cartItemType` | `src/@type/global.type.ts` | `Payment.tsx`, `apis/index.ts` |
| `CategoryType` | `src/@type/global.type.ts` | `apis/index.ts`, `CartProduct.tsx` |
| `FavoriteType` | `src/@type/global.type.ts` | `apis/index.ts`, `Myfavorite.tsx` |
| `profileType` | `src/@type/global.type.ts` | `apis/index.ts`, `MainProfile.tsx` |
| `SupplierType` | `src/@type/global.type.ts` | `apis/index.ts`, `ProductAdmin.tsx` |
| `apiResponseType<T>` | `src/@type/global.type.ts` | **mọi** helper trong `apis/index.ts` |
| `apiErrorType` | `src/@type/global.type.ts` | Mô tả shape lỗi |
| `loginPayloadType` | `src/@type/user.type.ts` | `apis/index.ts` → `login` |
| `registerPayloadType` | `src/@type/user.type.ts` | `apis/index.ts` → `register` |
| `addToCartPayloadType` | `src/@type/user.type.ts` | `apis/index.ts` → `addToCart` |
| `updateProfilePayloadType` | `src/@type/user.type.ts` | `apis/index.ts` → `updateMyProfile` |
| `buttonType` | `src/@type/button.type.ts` | `src/components/Button/ButtonClick.tsx` |

## Kiểu dữ liệu "an toàn" trong dự án

```typescript
// Không dùng `any` ở tầng API
export const getMyProfile = async () => {
  const response = await requestApi("users/@me/profile", "GET", {});
  const payload = response.data as apiResponseType<profileType>;
  return { ...payload, data: normalizeProfile(payload.data) };
};
```

## Nợ kỹ thuật về type (đề xuất cải tiến)

| # | Vấn đề | Vị trí | Đề xuất |
|---|--------|--------|---------|
| 1 | `any` ở form handler | `Login.tsx`, `Register.tsx`, `MainProfile.tsx`, `Payment.tsx` | Định nghĩa type cho form values |
| 2 | `Record<string, any>` cho update product | `apis/index.ts` → `updateProduct` | Định nghĩa `updateProductPayloadType` |
| 3 | `any` cho `history` | `src/main.tsx` | `History` type từ package `history` |
| 4 | `Object` (không phải `object`) | `global.type.ts` → `category_id: Object` | `category_id: string \| CategoryType` |
| 5 | `any` trong `utils/setting.ts` | `setStore`, `getStoreJson` | `unknown` + type guard |
