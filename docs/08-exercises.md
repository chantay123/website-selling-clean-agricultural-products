# 08. Bài tập thực hành (Part 15)

> Từ dễ → khó. Mỗi bài: Yêu cầu → Kỳ vọng → Gợi ý → Kiến thức kiểm tra → Lời giải → Giải thích → Hướng tiếp cận khác.

---

## Mục lục

- [Level 1 — JavaScript logic](#level-1--javascript-logic)
- [Level 2 — Array & Object](#level-2--array--object)
- [Level 3 — TypeScript](#level-3--typescript)
- [Level 4 — API Integration](#level-4--api-integration)
- [Level 5 — React](#level-5--react)
- [Level 6 — Custom Hooks](#level-6--custom-hooks)
- [Level 7 — Authentication](#level-7--authentication)
- [Level 8 — Debugging](#level-8--debugging)
- [Level 9 — Performance](#level-9--performance)

---

# Level 1 — JavaScript logic

## Bài 1.1. `fizzBuzz`

**Yêu cầu:** In ra `"FizzBuzz"` thay cho số chia hết 15, `"Fizz"` nếu chia hết 3, `"Buzz"` nếu chia hết 5, còn lại in số.

**Kỳ vọng:** `1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz`

**Gợi ý:** Kiểm tra 15 trước, rồi 3, rồi 5.

**Kiến thức kiểm tra:** `if/else`, `%`, thứ tự điều kiện.

<details>
<summary>Lời giải</summary>

```javascript
function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i);
  }
  return result;
}
```

**Giải thích:** Điều kiện `i % 15 === 0` phải đứng trước vì 15 chia hết cả 3 và 5 — nếu kiểm tra 3 trước thì 15 ra "Fizz" sai.
</details>

---

## Bài 1.2. Đảo chuỗi, không dùng `reverse()`

**Yêu cầu:** Viết hàm đảo ngược chuỗi.

**Kỳ vọng:** `reverse("hello")` → `"olleh"`

**Gợi ý:** `split("")` → `reverse()` → `join("")`, hoặc duyệt từ cuối.

**Kiến thức kiểm tra:** string methods, `reduce`.

<details>
<summary>Lời giải</summary>

```javascript
// Cách 1
const reverse = (s) => s.split("").reverse().join("");

// Cách 2 — không dùng reverse
const reverseManual = (s) => s.split("").reduce((acc, ch) => ch + acc, "");

// Cách 3 — dùng spread
const reverseSpread = (s) => [...s].reverse().join("");
```

**Giải thích:** Cách 2 dùng `reduce` với accumulator là chuỗi đã đảo — mỗi ký tự mới được nối lên đầu → đảo. Cách 3 dùng spread để xử lý được chuỗi có emoji/surrogate pair.
</details>

---

## Bài 1.3. `isPalindrome`

**Yêu cầu:** Kiểm tra chuỗi có đối xứng không, bỏ qua hoa thường & ký tự không phải chữ/số.

**Kỳ vọng:** `isPalindrome("A man, a plan, a canal: Panama")` → `true`

**Gợi ý:** `replace(/[^a-z0-9]/gi, "")` rồi so sánh với bản đảo.

**Kiến thức kiểm tra:** regex, string methods.

<details>
<summary>Lời giải</summary>

```javascript
const isPalindrome = (s) => {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
};

// Không dùng reverse — so sánh 2 đầu
const isPalindromeTwoPointers = (s) => {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
};
```

**Giải thích:** Cách 2 có O(n) time và O(1) space — tốt hơn cho chuỗi dài.
</details>

---

## Bài 1.4. Đếm từ trong chuỗi

**Yêu cầu:** Đếm số lần xuất hiện của mỗi từ, không phân biệt hoa thường.

**Kỳ vọng:** `countWords("Hello hello world")` → `{ hello: 2, world: 1 }`

**Gợi ý:** `split(/\s+/)` rồi `reduce` với object accumulator.

**Kiến thức kiểm tra:** `reduce`, object accumulator, `Map` vs `Object`.

<details>
<summary>Lời giải</summary>

```javascript
const countWords = (text) =>
  text.trim().toLowerCase().split(/\s+/).reduce((acc, word) => {
    if (!word) return acc;
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});

// Dùng Map — an toàn hơn với key đặc biệt ("__proto__", "constructor")
const countWordsMap = (text) => {
  const map = new Map();
  for (const word of text.trim().toLowerCase().split(/\s+/)) {
    if (!word) continue;
    map.set(word, (map.get(word) ?? 0) + 1);
  }
  return Object.fromEntries(map);
};
```

**Giải thích:** `Object` thuần có vấn đề với key `__proto__` — `Map` an toàn hơn. `?? 0` xử lý trường hợp key chưa tồn tại (tránh `NaN` từ `undefined + 1`).
</details>

---

# Level 2 — Array & Object

## Bài 2.1. Group by key

**Yêu cầu:** Group các phần tử theo 1 key.

**Kỳ vọng:**
```javascript
groupBy([{ n: "a", g: 1 }, { n: "b", g: 2 }, { n: "c", g: 1 }], "g")
// → { 1: [{n:"a",g:1},{n:"c",g:1}], 2: [{n:"b",g:2}] }
```

**Gợi ý:** `reduce`.

**Áp dụng trực tiếp:** `src/components/Categories/Categories.tsx` đang group sản phẩm theo `category.slug`.

**Kiến thức kiểm tra:** `reduce`, generic typing.

<details>
<summary>Lời giải</summary>

```javascript
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key];
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
```

**Giải thích:** `??=` (logical assignment) — gán nếu `undefined` hoặc `null`. Tương đương:
```javascript
if (!acc[k]) acc[k] = [];
acc[k].push(item);
```

**Lưu ý:** mutate accumulator `acc` — OK vì `acc` là object local. Nếu cần immutability: `{ ...acc, [k]: [...(acc[k] ?? []), item] }`.
</details>

---

## Bài 2.2. `chunk` — chia mảng

**Yêu cầu:** Chia mảng thành các mảng con độ dài `size`.

**Kỳ vọng:** `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`

**Gợi ý:** `for` loop với `slice`, hoặc `reduce`.

<details>
<summary>Lời giải</summary>

```javascript
const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// Cách 1 liner
const chunkReduce = (arr, size) =>
  arr.reduce((acc, item, i) => {
    if (i % size === 0) acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
```

**Áp dụng:** dùng để phân trang client-side khi backend chưa hỗ trợ.
</details>

---

## Bài 2.3. `unique` — loại trùng

**Yêu cầu:** Loại bỏ phần tử trùng, giữ thứ tự.

**Gợi ý:** `Set` hoặc `filter` + `indexOf`.

<details>
<summary>Lời giải</summary>

```javascript
const unique = (arr) => [...new Set(arr)];

// Giữ thứ tự chèn đầu vào — cho object
const uniqueBy = (arr, key) => {
  const seen = new Set();
  return arr.filter((item) => {
    const k = typeof key === "function" ? key(item) : item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
```

**Áp dụng:** `uniqueBy(products, "_id")` để dedupe khi API trùng dữ liệu.
</details>

---

## Bài 2.4. `deepMerge`

**Yêu cầu:** Merge 2 object sâu, object con được merge chứ không bị thay thế.

**Kỳ vọng:**
```javascript
deepMerge({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 4, e: 5 } })
// → { a: 1, b: { c: 2, d: 4, e: 5 } }
```

**Gợi ý:** `Object.entries` + đệ quy.

**Kiến thức kiểm tra:** đệ quy, `Object.entries`, spread.

<details>
<summary>Lời giải</summary>

```javascript
const isPlainObject = (v) =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const deepMerge = (target, source) => {
  const output = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
};
```

**Giải thích:** Kiểm tra `isPlainObject` cho cả 2 vế — nếu chỉ source là object mà target là primitive thì phải thay thế, không merge.
</details>

---

## Bài 2.5. `groupProductsByCategory` — bài tập theo dự án

**Yêu cầu:** Từ danh sách sản phẩm (đã qua `normalizeProducts`), group theo `category.slug` và đếm số lượng.

**Kỳ vọng:**
```javascript
groupProductsByCategory(products)
// → [{ slug: "fresh-fruits", name: "Fresh Fruits", count: 3 }, ...]
```

**Gợi ý:** Dùng `groupBy` từ bài 2.1 + `Object.entries`.

**Kiến thức kiểm tra:** kết hợp các bài trước, xử lý dữ liệu thực.

<details>
<summary>Lời giải</summary>

```typescript
type CategoryGroup = { slug: string; name: string; count: number };

const groupProductsByCategory = (products: productTypes[]): CategoryGroup[] => {
  const grouped = products.reduce<Record<string, productTypes[]>>((acc, product) => {
    const slug = product.category?.slug;
    if (!slug) return acc;              // bỏ qua product không có category
    (acc[slug] ??= []).push(product);
    return acc;
  }, {});

  return Object.entries(grouped).map(([slug, items]) => ({
    slug,
    name: items[0]?.category?.name ?? slug,
    count: items.length,
  }));
};
```

**Áp dụng:** đây là bản cải tiến của logic group trong `Categories.tsx` — hiện tại component đang group từ `state.user.product` (danh sách hiện tại) nên danh sách category **đổi theo kết quả search**. Bản chuẩn nên dùng `state.user.category` (từ API) → ổn định.
</details>

---

# Level 3 — TypeScript

## Bài 3.1. Type envelope API

**Yêu cầu:** Viết type cho envelope API của Agrimarket và 1 helper type-safe.

**Gợi ý:** Generic `apiResponseType<T>`.

<details>
<summary>Lời giải</summary>

```typescript
// src/@type/global.type.ts
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

// Helper type-safe
type ApiOf<T> = Awaited<ReturnType<T>>;

const unwrap = <T>(response: apiResponseType<T>): T => response.data;
```

**Áp dụng:** `apiResponseType<T>` đã có trong dự án — dùng ở mọi helper trong `src/apis/index.ts`.
</details>

---

## Bài 3.2. `narrow` unknown

**Yêu cầu:** Viết hàm nhận `unknown` và trả về string an toàn.

**Gợi ý:** Type guard với `typeof`.

<details>
<summary>Lời giải</summary>

```typescript
const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
```

**Áp dụng:** `src/utils/api.adapter.ts` đang làm đúng việc này ở dạng inline. Tách ra sẽ dễ test hơn.
</details>

---

## Bài 3.3. Generic `normalize`

**Yêu cầu:** Viết hàm generic chuẩn hoá mọi collection.

**Gợi ý:** `<T extends Record<string, unknown>, R>(items: T[], fn: (item: T) => R): R[]`

<details>
<summary>Lời giải</summary>

```typescript
const normalizeCollection = <T extends Record<string, unknown>, R>(
  items: T[] | null | undefined,
  normalize: (item: T) => R
): R[] => (Array.isArray(items) ? items.map(normalize) : []);
```

**Áp dụng:** `normalizeProducts` trong `src/utils/api.adapter.ts` chính là trường hợp cụ thể của hàm này.
</details>

---

## Bài 3.4. Type-safe error handler

**Yêu cầu:** Viết `getApiErrorMessage` không dùng `any`.

<details>
<summary>Lời giải</summary>

```typescript
type LooseRecord = Record<string, unknown>;

export const getApiErrorMessage = (error: unknown, fallback = "Đã xảy ra lỗi"): string => {
  const err = error as { message?: string; response?: { data?: LooseRecord } };
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data.message === "string") return data.message;
  const errors = data.errors as Record<string, { msg?: string } | string> | undefined;
  const first = errors ? Object.values(errors)[0] : undefined;
  if (first && typeof first === "object") return first.msg || fallback;
  if (typeof first === "string") return first;
  return fallback;
};
```

**Điểm kiểm tra:** dùng `unknown` (không `any`) → buộc caller xử lý an toàn. Dùng duck typing vì lỗi có thể từ nhiều nguồn.
</details>

---

# Level 4 — API Integration

## Bài 4.1. Thêm endpoint `getProductsByCategory` (đã có — viết lại từ đầu)

**Yêu cầu:** Viết helper trong `src/apis/index.ts` gọi `GET /products/categories/:categoryId`.

**Kỳ vọng:** Trả `{ statusCode, message, data: productTypes[], dateTime }` với `data` đã normalize.

**Gợi ý:** Xem pattern của `getProducts`.

**Kiến thức kiểm tra:** pattern consistency trong 1 module.

<details>
<summary>Lời giải</summary>

```typescript
/** `GET /products/categories/:categoryId` */
export const getProductsByCategory = async (categoryId: string) => {
  const response = await requestApi(`products/categories/${categoryId}`, "GET", {});
  const payload = response.data as apiResponseType<productTypes[]>;
  return {
    ...payload,
    data: normalizeProducts(payload.data),
  };
};
```

**Bài học:** Mọi helper trong `src/apis/index.ts` tuân theo **cùng 1 khuôn mẫu** → đọc 1 là hiểu hết. Đó là giá trị của consistency.
</details>

---

## Bài 4.2. Implement `updateProduct` với payload type đầy đủ

**Yêu cầu:** Hiện `updateProduct(id, payload: Record<string, any>)` — hãy định nghĩa type cụ thể.

**Gợi ý:** Dựa trên `ProductAttribute` + `productTypes`.

<details>
<summary>Lời giải</summary>

```typescript
// src/@type/user.type.ts
export type updateProductPayloadType = {
  name?: string;
  slug?: string;
  description?: string;
  origin?: string;
  sold?: number | string;
  thumbnail_url?: string;
  hot?: boolean | string;
  numberOfReview?: number | string;
  rating?: number | string;
  attribute?: {
    weight?: number | string;
    original_price?: number | string;
    discounted_percent?: number | string;
    dimensions?: string;
    unit_of_measurement?: string;
    quantity_per_unit?: number | string;
    certification?: string;
    harvest_date?: string;
    link?: string;
    expiration_date?: string;
  };
};
```

**Lưu ý thực tế:** form `EditAdmin.tsx` đang convert tất cả về `String` (vì `<Input>` cần string) → khi gửi lên nên `Number()` các field số nếu backend yêu cầu number.
</details>

---

## Bài 4.3. Xử lý response không phải JSON

**Yêu cầu:** Khi server trả HTML (502 từ proxy, 404 từ sai path), `response.json()` sẽ throw. Viết helper an toàn.

<details>
<summary>Lời giải</summary>

```typescript
const safeJson = async (res: Response): Promise<unknown> => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { message: `HTTP ${res.status}`, raw: text.slice(0, 200) };
  }
};
```

**Áp dụng:** `scripts/verify-integration.mjs` đã làm đúng việc này — `try { json = JSON.parse(text) } catch { /* non-json */ }`.
</details>

---

## Bài 4.4. Viết test cho adapter

**Yêu cầu:** Viết test (không cần framework — dùng `node:test` hoặc assert thuần) cho `normalizeProduct`, `normalizeCart`, `normalizeProfile`.

**Kiến thức kiểm tra:** unit test cho hàm thuần — chứng minh adapter hoạt động đúng.

<details>
<summary>Lời giải</summary>

```typescript
// scripts/adapter.test.mjs (chạy: node --test scripts/)
import assert from "node:assert/strict";
import { normalizeProduct, normalizeCart, normalizeProfile } from "../src/utils/api.adapter.ts";

assert.deepEqual(
  normalizeProduct({ attributes: [{ _id: "a1", weight: 1 }] }).productAttributes,
  [{ _id: "a1", weight: 1 }]
);

assert.equal(
  normalizeProduct({ attribute: { _id: "b1", weight: 2 } }).productAttributes.length,
  1
);

assert.equal(
  normalizeProduct({ attributes: [], total_price: 50 }).price,
  50
);

assert.equal(normalizeCart({ carts: [{ productDetails: { _id: "p1" }, quantity: 2 }] }).items.length, 1);
assert.equal(normalizeProfile({ full_name: "Rodriguez" }).fullName, "Rodriguez");
```

**Lưu ý:** `api.adapter.ts` là file `.ts` — chạy trực tiếp bằng `node` cần `tsx` hoặc build trước. Có thể tách test vào `.mjs` với bản copy logic, hoặc dùng `vitest`.
</details>

---

# Level 5 — React

## Bài 5.1. Component `ProductCard`

**Yêu cầu:** Tạo component hiển thị 1 sản phẩm, nhận `product` và `onAdd` qua props. Không gọi API bên trong.

**Kỳ vọng:** Render tên, giá, ảnh, category, nút "Add to cart".

**Kiến thức kiểm tra:** Presentational component, typed props, tách khỏi container.

<details>
<summary>Lời giải</summary>

```tsx
// src/components/ProductCard/ProductCard.tsx
import { productTypes } from "../../@type/global.type";

type ProductCardProps = {
  product: productTypes;
  onAdd: (productId: string) => void;
};

const ProductCard = ({ product, onAdd }: ProductCardProps) => (
  <div className="rounded-[10px] relative">
    <div className="absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
      {product.category?.name}
    </div>
    <img
      className="w-[400px] h-[200px] rounded object-cover"
      src={product.thumbnail_url}
      alt={product.name}
      loading="lazy"
    />
    <h2 className="flex justify-center text-2xl font-bold mt-8">{product.name}</h2>
    <div className="flex items-center justify-evenly mt-5">
      <p className="text-xl font-semibold">{product.price}$/KG</p>
      <button onClick={() => onAdd(product._id)}>Add to cart</button>
    </div>
  </div>
);

export default ProductCard;
```

**Bài học:** Component này **không** biết API tồn tại. Nó chỉ nhận dữ liệu đã sẵn sàng → dễ test, dễ tái sử dụng, không coupling với backend.
</details>

---

## Bài 5.2. Fix bug `useEffect` trong event handler

**Yêu cầu:** Cho đoạn code này — giải thích lỗi & viết lại đúng.

```typescript
const handleInputChange = async (event: any) => {
  console.log(event.target.value);
  setAmount(event.target.value);
  useEffect(() => {
    handleInputChange;
  }, []);
};
```

**Kỳ vọng:** Giải thích Rules of Hooks + viết lại.

<details>
<summary>Lời giải</summary>

```typescript
const [amount, setAmount] = useState(0);

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setAmount(Number(event.target.value));
};
```

**Giải thích:**
1. `useEffect` bên trong event handler → vi phạm Rules of Hooks → React báo "Rendered fewer hooks than expected".
2. `useEffect(() => { handleInputChange; }, [])` về mặt logic vô nghĩa — chỉ tạo callback, không gọi.
3. `event.target.value` là string nhưng `amount` dùng để so sánh số → `Number()`.
4. `console.log` debug → xoá.
5. Xoá import `useEffect` không dùng.

**Đây chính xác là bug đã gặp & sửa trong `src/components/Categories/Categories.tsx`.**
</details>

---

## Bài 5.3. Fix vòng lặp request

**Yêu cầu:** Cho đoạn code — giải thích & sửa.

```typescript
const ProductAdmin = () => {
  const dispatch = useDispatch();

  const supplier = async () => {
    const response = await getSuppliers();
    dispatch(setsupplier(response.data));
  };
  supplier();

  return <div>...</div>;
};
```

<details>
<summary>Lời giải</summary>

```typescript
const ProductAdmin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const supplier = async () => {
      try {
        const response = await getSuppliers();
        dispatch(setsupplier(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    supplier();
  }, []);

  return <div>...</div>;
};
```

**Giải thích chuỗi vòng lặp:**
```
render → gọi supplier() → (async) dispatch → store đổi → component re-render → gọi supplier() → ...
```

Render phải là **hàm thuần khiết quả** — không được side-effect. Mọi I/O phải trong `useEffect`.
</details>

---

## Bài 5.4. `ProductDetail` — handle loading state

**Yêu cầu:** Hiện `ProductDetail` gọi `navigate("*")` khi `detail === undefined` → nháy 404 lúc đang load. Sửa để có loading state.

**Kỳ vọng:** Hiện `<Loading />` khi đang fetch, chỉ redirect 404 khi fetch xong và thật sự không tìm thấy.

<details>
<summary>Lời giải</summary>

```tsx
const ProductDetail = () => {
  const { productId } = useParams();
  const product = useSelector((state: RootState) => state.user.product);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId ?? "");
        if (!cancelled) dispatch(setProduct([response.data]));
      } catch (error) {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();

    return () => { cancelled = true; };
  }, [productId, dispatch]);

  const detail = product.find((p) => p._id === productId);

  if (loading) return <Loading />;
  if (notFound || !detail) return <NotFound />;
  // ...
};
```

**Bài học:**
1. Phân biệt 3 trạng thái: **loading / not-found / success**. Chỉ có 1 trạng thái → dễ render nhầm.
2. `cancelled` flag chống setState sau unmount (memory leak & warning React 18).
3. Dùng `<NotFound />` component thay vì `navigate("*")` trong render — tránh anti-pattern.
</details>

---

# Level 6 — Custom Hooks

## Bài 6.1. `useDebounce`

**Yêu cầu:** Viết hook trả về giá trị đã debounce.

**Kỳ vọng:** `const debounced = useDebounce(keyword, 300)` — chỉ cập nhật sau 300ms không thay đổi.

<details>
<summary>Lời giải</summary>

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

**Áp dụng:**
```typescript
// src/components/Categories/Categories.tsx
const [keyword, setKeyword] = useState("");
const debouncedKeyword = useDebounce(keyword, 300);

useEffect(() => {
  if (!debouncedKeyword) return;
  searchProducts(debouncedKeyword)
    .then((res) => dispatch(setProduct(res.data)))
    .catch(console.error);
}, [debouncedKeyword, dispatch]);
```

**Giải thích:** `useEffect` cleanup `clearTimeout` — mỗi lần `value` đổi, timer cũ bị huỷ và tạo timer mới → chỉ timer cuối cùng kích hoạt.
</details>

---

## Bài 6.2. `useAsync` — xử lý loading/error/data

**Yêu cầu:** Viết hook generic cho một async operation.

<details>
<summary>Lời giải</summary>

```typescript
import { useCallback, useEffect, useRef, useState } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> & { execute: () => Promise<T | null> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await fn();
      if (mounted.current) setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      if (mounted.current) {
        setState({ data: null, loading: false, error: error?.message ?? "Lỗi" });
      }
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}
```

**Áp dụng:** có thể thay thế pattern `useState + useEffect + try/catch` lặp lại ở `ProductDetail.tsx`, `MainProfile.tsx`, `Myfavorite.tsx`.
</details>

---

## Bài 6.3. `useCart` — tách logic giỏ hàng

**Yêu cầu:** Logic `getCart` + `setcartnumber` đang lặp ở 3 file. Tách thành hook.

**Kỳ vọng:**
```typescript
const { cart, count, refresh, addItem, updateItem, removeItem } = useCart();
```

<details>
<summary>Lời giải</summary>

```typescript
// src/hooks/useCart.ts
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/config";
import { getCart, addToCart, updateCartItems, removeCartItem } from "../apis";
import { setCart, setcartnumber } from "../redux/userReducer/userReducer";
import { cartTypes } from "../@type/global.type";

export function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.user.cart);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const refresh = useCallback(async () => {
    try {
      const response = await getCart();
      dispatch(setCart(response.data));
      dispatch(setcartnumber(response.data.items.length));
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;   // ✅ không gọi API khi chưa đăng nhập
    refresh();
  }, [isAuthenticated, refresh]);

  const addItem = async (productId: string, attributeId: string, quantity = 1) => {
    await addToCart({ items: [{ product_id: productId, product_attribute_id: attributeId, quantity }] });
    return refresh();
  };

  const updateItem = async (items: { product_id: string; product_attribute_id: string; quantity: number }[]) => {
    if (!cart) return null;
    await updateCartItems(cart._id, { items });
    return refresh();
  };

  const removeItem = async (productId: string) => {
    if (!cart) return null;
    await removeCartItem(cart._id, productId);
    return refresh();
  };

  return { cart, count: cart?.items.length ?? 0, refresh, addItem, updateItem, removeItem };
}
```

**Lợi ích:**
1. Fix luôn bug "gọi `getCart` khi chưa đăng nhập" → 401 → redirect.
2. Giảm 3 file lặp code.
3. `refresh` tập trung → dễ thêm cache/dedupe sau này.
</details>

---

# Level 7 — Authentication

## Bài 7.1. Viết lại `useAuth`

**Yêu cầu:** Gom logic auth (login, logout, profile, role) vào 1 hook.

<details>
<summary>Lời giải</summary>

```typescript
// src/hooks/useAuth.ts
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/config";
import {
  setAuthenticationStatus,
  setAdminStatus,
  setprofile,
} from "../redux/userReducer/userReducer";
import { getMyProfile, login as loginApi, logout as logoutApi } from "../apis";
import { getCookie, ACCESS_TOKEN, REFRESH_TOKEN, setCookie, setStore } from "../utils/setting";
import { clearTokens } from "../utils/interceptors";
import { getApiErrorMessage } from "../utils/api.adapter";

export function useAuth() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const profile = useSelector((s) => s.user.profile);

  const loadProfile = useCallback(async () => {
    try {
      const response = await getMyProfile();
      dispatch(setprofile(response.data));
      dispatch(setAdminStatus(response.data?.role === "Admin"));
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    const { access_token, refresh_token, role } = response.data;
    setStore(ACCESS_TOKEN, access_token);
    if (refresh_token) setCookie(REFRESH_TOKEN, refresh_token, 7);
    dispatch(setAuthenticationStatus(true));
    dispatch(setAdminStatus(role === "Admin"));
    return response.data;
  };

  const logout = async () => {
    const refreshToken = getCookie(REFRESH_TOKEN);
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } finally {
      clearTokens();
      dispatch(setAuthenticationStatus(false));
      dispatch(setAdminStatus(false));
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadProfile();
  }, [isAuthenticated, loadProfile]);

  return { isAuthenticated, isAdmin, profile, login, logout, loadProfile };
}
```

**Lợi ích:**
- `Login.tsx` + `HeaderItem.tsx` + `Admin.tsx` + `ProductAdmin.tsx` đều gọi `getMyProfile` → giờ 1 chỗ.
- `loadProfile` chỉ chạy khi `isAuthenticated` → **fix bug** khách chưa đăng nhập bị redirect.

---

## Bài 7.2. Guard route bằng component

**Yêu cầu:** Tạo `<ProtectedRoute>` và `<AdminRoute>`.

<details>
<summary>Lời giải</summary>

```tsx
// src/routes/guards.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/config";
import Loading from "../components/Loading";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const profile = useSelector((s) => s.user.profile);

  // null = chưa xác định (đang load profile) → hiện loading, chưa redirect
  if (!profile && isAdmin === false) return <Loading />;
  if (!isAdmin) return <Navigate to="*" replace />;
  return <>{children}</>;
};
```

**Áp dụng trong `App.tsx`:**
```tsx
<Route path={config.routes.admin} element={<AdminRoute><Admin /></AdminRoute>} />
```

**Bài học:**
1. `navigate()` trong render → dùng `<Navigate>`.
2. Cần phân biệt "chưa biết" (`null`) với "không có quyền" (`false`) → tránh redirect oan lúc đang load.
3. `location.state.from` cho phép redirect về đúng trang sau login.
</details>

---

## Bài 7.3. Refresh token dedupe

**Yêu cầu:** Hiện mỗi request 401 gọi refresh riêng. Sửa để 5 request đồng thời chỉ gọi refresh 1 lần.

<details>
<summary>Lời giải</summary>

```typescript
// src/utils/interceptors.tsx
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;    // reset để lần sau gọi mới thực sự refresh
    });
  }
  return refreshPromise;
};

const doRefresh = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${REFRESH_ENDPOINT}`,
      { refresh_token: refreshToken },
      { headers: { Accept: "application/json", "Content-Type": "application/json" } }
    );
    const payload = response.data?.data ?? response.data;
    if (!payload?.access_token) return null;
    saveTokens(payload.access_token, payload.refresh_token);
    return payload.access_token;
  } catch {
    return null;
  }
};
```

**Giải thích:** Các request 401 gần nhau sẽ **chia sẻ cùng 1 promise** → chỉ 1 HTTP call tới `/users/token/refresh`. `finally` reset promise sau khi xong để không cache kết quả cũ.
</details>

---

# Level 8 — Debugging

## Bài 8.1. Điều tra: bấm "Add to cart" không hoạt động

**Yêu cầu:** Cho triệu chứng & mô tả quy trình debug.

**Kỳ vọng:** Nêu đúng các bước và kiểm tra.

<details>
<summary>Lời giải</summary>

**Bước 1 — Hiểu:**
- Expected: sản phẩm vào giỏ, badge tăng.
- Actual: toast lỗi, badge không đổi.
- Reproduce: đăng nhập → Home → bấm "Add to card".

**Bước 2 — Tìm nguồn:**
```
src/components/CartProducts/CartProduct.tsx → buttonAdd
  → src/apis/index.ts → addToCart
  → src/utils/interceptors.tsx → requestApi
```

**Bước 3 — Debug (Network tab):**
- Request: `POST /api/v1/carts/items` → status **400**
- Payload: `{ product_id, quantity }` → **thiếu `product_attribute_id`**
- Response: `{ message: "Validation error.", errors: { items: { msg: "product_attribute_id should not be empty" } } }`

**Bước 4 — Root cause:** backend yêu cầu 3 field, frontend gửi 2. Đây là lỗi **frontend** (contract mismatch), không phải backend.

**Bước 5 — Sửa:**
```typescript
const target = product.find((item) => item._id === product_id);
const attributeId = target?.productAttributes?.[0]?._id;
if (!attributeId) {
  toast.error("Sản phẩm không có thuộc tính để thêm vào giỏ hàng");
  return;
}
await addToCart({ items: [{ product_id, product_attribute_id: attributeId, quantity: 1 }] });
```

**Bước 6 — Verify:** add thành công, badge tăng; áp dụng cho cả 3 nơi gọi; `tsc` + `build` pass.

**Bước 7 — Document:** ghi vào `docs/04-api-integration.md` § 6.
</details>

---

## Bài 8.2. Điều tra: trang Admin gọi API liên tục

**Kỳ vọng:** Nhận ra vòng lặp render → dispatch.

**Gợi ý:** Kiểm tra xem có side-effect trong render body không.

<details>
<summary>Lời giải</summary>

Xem lời giải bài 5.3.

**Cách phát hiện nhanh:**
1. Network tab → thấy `/suppliers` lặp.
2. React DevTools → highlight component render liên tục.
3. Redux DevTools → action `SET_SUPPLIER` lặp.
4. Đọc code → `supplier()` gọi ở top-level của component.

**Bài học cốt lõi:** React render phải thuần khiết quả. Mọi side-effect (network, dispatch, localStorage) phải nằm trong `useEffect`.
</details>

---

## Bài 8.3. Điều tra: "tôi không thấy gì cả" (màn hình trắng)

**Kỳ vọng:** Nêu checklist debug theo thứ tự ưu tiên.

<details>
<summary>Lời giải</summary>

1. **Console** → có error không? React warning?
2. **Network tab** → có request nào fail không? Response shape có khớp component đọc không?
   - Trường hợp kinh điển: API trả `carts`, component đọc `items` → `.map` trên `undefined` → crash; hoặc render mảng rỗng (không phải lỗi).
3. **React DevTools** → component có render không? props đúng không?
4. **Redux DevTools** → state đúng không?
5. **Sources → Pause on exceptions** → stack chính xác.
6. Route — dynamic param có đúng không? `useParams()` trả gì?
7. Điều kiện render — có nhánh `navigate("*")` chạy oan không?
8. CSS — element có `display: none` / `opacity: 0` không? (DevTools → Computed)

**Bài học:** Phân biệt "crash" (có error) với "render rỗng" (không lỗi) — 2 trường hợp khác nhau, cũng khác cách debug.
</details>

---

# Level 9 — Performance

## Bài 9.1. Dedupe `getCart`

**Yêu cầu:** `GET /carts` bị gọi 2 lần ở trang Home (`CartProduct.tsx` + `Cart.tsx`). Dedupe.

**Kỳ vọng:** 1 request cho cả trang.

<details>
<summary>Lời giải</summary>

**Cách 1 — Dùng custom hook (đã giải ở bài 6.3):** gom cả 2 chỗ dùng `useCart()` → 1 effect gọi API.

**Cách 2 — Cache ở tầng module:**
```typescript
// src/apis/index.ts
let cartPromise: Promise<apiResponseType<cartTypes>> | null = null;

export const getCart = async () => {
  if (!cartPromise) {
    cartPromise = requestApi("carts", "GET", {}).then((r) => {
      const body = r.data as apiResponseType<cartTypes>;
      return { ...body, data: normalizeCart(body.data) };
    }).finally(() => { cartPromise = null; });
  }
  return cartPromise;
};
```

> ⚠️ `finally` reset → đây là **dedupe request đồng thời**, không phải cache. Nếu muốn cache thật thì đừng reset, nhưng phải có hàm `invalidateCartCache()` gọi sau mỗi mutation.

**Bài học:** Phân biệt **dedupe** (gộp request đang chạy) với **cache** (giữ kết quả). Dedupe an toàn hơn, không có stale data.
</details>

---

## Bài 9.2. `Promise.allSettled` cho trang Home

**Yêu cầu:** `getCart()` fail (401) không nên làm hỏng danh sách sản phẩm.

<details>
<summary>Lời giải</summary>

```typescript
const fetchHomeData = async () => {
  const [productsResult, categoriesResult, cartResult] = await Promise.allSettled([
    getProducts(),
    getCategories(),
    isAuthenticated ? getCart() : Promise.resolve(null),
  ]);

  if (productsResult.status === "fulfilled") {
    dispatch(setProduct(productsResult.value.data));
  }
  if (categoriesResult.status === "fulfilled") {
    dispatch(setCategory(categoriesResult.value.data));
  }
  if (cartResult.status === "fulfilled" && cartResult.value) {
    dispatch(setcartnumber(cartResult.value.data.items.length));
  }
};
```

**Lợi ích:**
1. 3 request **song song** thay vì tuần tự → nhanh hơn.
2. 1 fail không ảnh hưởng 2 cái còn lại.
3. Bỏ được 3 `useEffect` riêng → 1 effect gọn hơn.
</details>

---

## Bài 9.3. Đo performance trước khi tối ưu

**Yêu cầu:** Mô tả cách đo & quyết định có tối ưu không.

**Kỳ vọng:** Nêu công cụ + tiêu chí quyết định.

<details>
<summary>Lời giải</summary>

**Công cụ:**
| Công cụ | Đo gì |
|---------|--------|
| Network tab | Số request, thời gian, payload size, request trùng |
| React DevTools Profiler | Số lần render, thời gian commit |
| Lighthouse | LCP, CLS, TBT, bundle size |
| `console.time` / `performance.now()` | Đo chính xác 1 đoạn |

**Quy trình:**
1. Đo baseline (trước khi sửa).
2. Xác định bottleneck: network hay render?
3. Sửa 1 thứ.
4. Đo lại → so sánh.
5. Giữ nếu cải thiện; revert nếu không.

**Tiêu chí "không cần tối ưu" trong dự án:**
- Danh sách ≤ 8 sản phẩm → `React.memo` không đáng.
- `products.slice(0, 8)` trên 8 phần tử → `useMemo` không đáng.
- `chart.js` chỉ ở trang Admin → lazy load được nhưng không gấp.

**Nguyên tắc:** tối ưu có **số liệu**, không có cảm tính.
</details>

---

## Bài 9.4. `key` ổn định trong list

**Yêu cầu:** `Payment.tsx` dùng `key={index}`. Hậu quả? Sửa?

<details>
<summary>Lời giải</summary>

**Hậu quả:** React dùng key để định danh instance component giữa các render. Với `key={index}`:
- Xoá item đầu → item thứ 2 thành index 0 → React **tái sử dụng** component của item cũ (đã bị xoá) → state bên trong (ví dụ focus, input value) gắn nhầm.
- Sort/reorder → hiển thị sai thứ tự với state cũ.

**Trong dự án:** `quantities` nằm ở component cha (không phải trong row) → thiệt hại nhỏ. Nhưng vẫn nên sửa.

**Sửa:**
```tsx
{renderlist.map((cart) => (
  <tr key={`${cart.product_id._id}-${cart.productAttributeId ?? ""}`}>
```
```

**Bài học:** key là **identity**, không phải vị trí. Dùng id ổn định từ dữ liệu.
</details>

---

## Bài 9.5. Tối ưu `useSelector`

**Yêu cầu:** `useSelector(s => s.user)` vs `useSelector(s => s.user.cartnumber)` — khác nhau gì?

<details>
<summary>Lời giải</summary>

```typescript
// ❌ Re-render mỗi khi BẤT KỲ field nào của user đổi
const user = useSelector((state: RootState) => state.user);

// ✅ Chỉ re-render khi cartnumber đổi
const cartnumber = useSelector((state: RootState) => state.user.cartnumber);
```

**Lý do:** Redux Toolkit dùng Immer → mỗi action tạo object mới cho slice bị thay đổi. `state.user` là **object mới** → `Object.is` false → re-render, dù chỉ 1 field khác.

**Áp dụng:** `HeaderItem.tsx` đã dùng selector hẹp cho `isAuthenticated` và `cartnumber` — ✅.

**Ngoại lệ:** nếu component cần nhiều field, dùng `useSelector` nhiều lần (React-Redux v7+ tự memoize) hoặc `shallowEqual`:
```typescript
import { shallowEqual } from "react-redux";
const { cartnumber, isAuthenticated } = useSelector(
  (s: RootState) => ({ cartnumber: s.user.cartnumber, isAuthenticated: s.user.isAuthenticated }),
  shallowEqual
);
```
</details>

---

## Checklist hoàn thành

- [ ] Tự giải được ít nhất 1 bài mỗi level
- [ ] Giải thích được **tại sao** lỗi xảy ra, không chỉ copy code
- [ ] Sau mỗi bài React/TS → chạy `npx tsc --noEmit` và `npm run build`
- [ ] Áp dụng ít nhất 3 bài vào codebase thật (đã có sẵn nhiều ví dụ ở trên)
