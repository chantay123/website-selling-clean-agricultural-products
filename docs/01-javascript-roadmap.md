# 01. Roadmap JavaScript (Part 9)

> Mỗi topic: Định nghĩa → Vì sao quan trọng → Cách hoạt động bên trong → Khi nào dùng → Ví dụ → Lỗi thường gặp → Câu hỏi phỏng vấn → Áp dụng cho Agrimarket.

---

## Mục lục

- [9.1 JavaScript Fundamentals](#91-javascript-fundamentals)
- [9.2 JavaScript Intermediate](#92-javascript-intermediate)
- [9.3 JavaScript Advanced](#93-javascript-advanced)

---

# 9.1 JavaScript Fundamentals

## 1. `var`, `let`, `const`

### Định nghĩa

Ba từ khoá khai báo biến, khác nhau ở **scope** và **tính gánh lại (reassignability)**.

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block `{ }` | block `{ }` |
| Gán lại | ✅ | ✅ | ❌ |
| Hoisting | ✅ (undefined) | ❌ (TDZ) | ❌ (TDZ) |
| Khai báo lại cùng tên | ✅ | ❌ | ❌ |

### Cách hoạt động bên trong

`var` được nâng (hoisted) lên đầu function scope và khởi tạo `undefined` ngay từ đầu. `let`/`const` cũng được hoist nhưng nằm trong **Temporal Dead Zone (TDZ)** — truy cập trước khi khai báo sẽ throw `ReferenceError`.

### Ví dụ trong Agrimarket

```javascript
// src/components/CartProducts/CartProduct.tsx (bản JS thuần)
const product = useSelector((state) => state.user.product); // const: không gán lại
let lengthProduct = product.length;                          // let: cần gán lại
var error = null;                                            // ❌ nên tránh
```

### Lỗi thường gặp

| Lỗi | Giải thích |
|------|------------|
| `ReferenceError: Cannot access 'x' before initialization` | Dùng `let`/`const` trước khi khai báo → TDZ |
| `TypeError: Assignment to constant variable` | Gán lại `const` |
| `var` trong `for` loop tạo biến dùng chung | Dùng `let` → mỗi iteration có binding riêng |

### Câu hỏi phỏng vấn

**Q: `let` và `const` khác `var` như thế nào?**
A: `let`/`const` có block scope (giới hạn trong `{}`), trong khi `var` có function scope và có thể bị "rò" ra ngoài block. `let`/`const` không bị hoist giá trị (TDZ) nên tránh được bug "undefined". `const` bắt buộc gán 1 lần. Quy tắc thực tế: **mặc định dùng `const`, chỉ dùng `let` khi cần gán lại**.

**Q: TDZ là gì?**
A: Vùng tạm thời giữa lúc biến được hoisted và lúc được khởi tạo. Truy cập biến `let`/`const` trong TDZ sẽ throw `ReferenceError` thay vì trả `undefined` như `var`.

---

## 2. Primitive và Reference types

### Định nghĩa

**Primitive** (7 loại): `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, `bigint`. Lưu trực tiếp giá trị.

**Reference**: `object`, `array`, `function`. Lưu **tham chiếu** tới object trong heap.

### Cách hoạt động bên trong

Khi gán biến, engine **copy giá trị** (primitive) hoặc **copy tham chiếu** (object). `===` so sánh primitive theo giá trị, so sánh object theo **tham chiếu**.

```javascript
const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a.x); // 2 → cùng 1 object

const c = { x: 1 };
console.log(a === c); // false → khác tham chiếu
```

### Áp dụng cho Agrimarket

```javascript
// src/utils/api.adapter.ts — spread tạo object MỚI, không mutate input
export const normalizeProduct = (product) => {
  const attributes = Array.isArray(product.attributes)
    ? product.attributes
    : product.attribute ? [product.attribute] : [];

  return {
    ...product,      // copy các field gốc
    productAttributes: attributes,  // thêm alias
  };
};
```

Đây là lý do adapter an toàn: **không mutate** object gốc từ API → Redux state vẫn immutable.

### Lỗi thường gặp

| Lỗi | Fix |
|-----|-----|
| `const arr = []; const arr2 = arr; arr2.push(1);` → `arr` cũng có 1 phần tử | Copy trước: `[...arr]` hoặc `arr.slice()` |
| `obj1 === obj2` cho object giống nhau | So sánh `JSON.stringify` hoặc deep equal |
| Mutate props/state → lỗi React không re-render | Immutability |

### Câu hỏi phỏng vấn

**Q: `[] == ![]` ra gì?**
A: `true`. Bước 1: `![]` = `false` (object là truthy → `!` thành `false`). Bước 2: `[] == false` → ép `false` thành `0`, `[]` thành `0` → `0 == 0` → `true`.

---

## 3. Type coercion

### Định nghĩa

JS tự động đổi kiểu khi so sánh/phép tính. Đây là nguồn của rất nhiều bug "không hiểu tại sao".

### Bảng coercion

| Toán hạng | Thành string | Thành number | Thành boolean |
|-----------|--------------|---------------|---------------|
| `undefined` | `"undefined"` | `NaN` | `false` |
| `null` | `"null"` | `0` | `false` |
| `""` | `""` | `0` | `false` |
| `"0"` | `"0"` | `0` | `true` |
| `"abc"` | `"abc"` | `NaN` | `true` |
| `[]` | `""` | `0` | `true` |
| `[1,2]` | `"1,2"` | `NaN` | `true` |

### Ví dụ thực tế

```javascript
// ⚠️ Bug: tổng tiền giỏ hàng
const total = "10" + 5;  // "105" (string concat!)
const correct = Number("10") + 5; // 15

// ⚠️ Bug: so sánh id
if (userId == "123") { ... }  // true cả với number 123
if (userId === "123") { ... } // false nếu userId là number
```

**Trong Agrimarket:** `Payment.tsx` dùng `quantities[cart.product_id._id]` — key của object luôn là string, nên `quantities[123]` và `quantities["123"]` là **cùng một key**. An toàn.

### Lỗi thường gặp

| Lỗi | Cách tránh |
|-----|-----------|
| `"5" * 2` = 10 nhưng `"5" + 2` = "52" | Luôn `Number()` khi cần số |
| `if (value)` với `value = "0"` (string) | `"0"` là truthy! Dùng `value !== ""` |
| `if (obj)` với `obj = {}` | `{}` truthy → dùng `Object.keys(obj).length > 0` |

### Câu hỏi phỏng vấn

**Q: Khi nào dùng `==` và khi nào dùng `===`?**
A: Luôn dùng `===` (và `!==`) trong code thật. `==` ép kiểu theo bảng coercion → dễ gây bug. `===` so sánh cả kiểu lẫn giá trị. ESLint mặc định cũng cấm `==` (`eqeqeq` rule).

---

## 4. Truthy & Falsy

### Danh sách Falsy (8 giá trị duy nhất)

```javascript
false, 0, -0, 0n, "", null, undefined, NaN
```

**Mọi thứ khác đều truthy**, kể cả `[]`, `{}`, `"0"`, `"false"`.

### Ví dụ

```javascript
if (amount) { ... }        // amount = 0 → false, bỏ qua
if (amount !== 0) { ... }  // luôn vào khi amount = 0
if (items.length) { ... }  // 0 = rỗng → skip
if (product) { ... }       // undefined = chưa tải → skip
```

### Áp dụng cho Agrimarket

```javascript
// src/container/Payment/Payment.tsx
if (!listcard || !renderlist || renderlist.length === 0) {
  toast.error("Giỏ hàng đang trống");
  return;
}
```

`!listcard` bắt `null`/`undefined`; `renderlist.length === 0` bắt mảng rỗng (vì `[]` là truthy, không thể dùng `!renderlist`).

### Câu hỏi phỏng vấn

**Q: `[]` là truthy hay falsy?**
A: Truthy. Object (kể cả array) luôn truthy. Nếu muốn check mảng rỗng phải dùng `arr.length === 0` hoặc `!arr.length`.

---

## 5. Conditional statements

```javascript
// Ternary
const label = role === "Admin" ? "Quản trị" : "Khách hàng";

// Logical AND — short-circuit
isAuthenticated && <Badge count={cartnumber} />

// Nullish — khác với || ở giá trị 0 / ""
const page = searchParams.get("page") ?? "1";   // "0" được giữ
const size = searchParams.get("size") || 10;    // "0" bị thay bằng 10
```

> **Áp dụng Agrimarket:** `src/utils/api.adapter.ts` dùng `??` đúng chỗ:
> ```javascript
> const price = first.discount_price ?? first.total_price ?? first.original_price ?? product.sold;
> ```
> Nếu dùng `||`, `discount_price = 0` sẽ bị coi là falsy và nhảy sang `total_price` → sai giá.

---

## 6. Loops

```javascript
// forEach — không break/return
arr.forEach((item) => console.log(item));

// map — tạo mảng mới
const ids = items.map((i) => i.productAttributeId);

// filter — lọc
const inStock = items.filter((i) => i.quantity > 0);

// find / findIndex
const product = products.find((p) => p._id === productId);

// reduce — gộp
const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
```

**Áp dụng:** `Categories.tsx` dùng `reduce` để group sản phẩm theo `category.slug`:

```javascript
const category = product.reduce((prev, curr) => {
  if (!prev[curr.category?.slug]) {
    prev[curr.category?.slug] = [curr];
  } else {
    prev[curr.category?.slug].push(curr);
  }
  return prev;
}, group);
```

> ⚠️ **Lưu ý:** `reduce` mutate `prev` (object accumulator). Với accumulator là object/array thì đây là mutation — nên dùng `{ ...prev, [key]: [...] }` nếu cần immutability. Ở đây `group` là local nên chấp nhận được.

### Câu hỏi phỏng vấn

**Q: `map` vs `forEach` vs `filter` vs `reduce`?**
A:
- `map` → biến đổi 1-1, trả mảng mới cùng độ dài.
- `forEach` → chỉ chạy side-effect, trả `undefined`.
- `filter` → giữ phần tử thỏa điều kiện, trả mảng mới có thể rỗng.
- `reduce` → gộp cả mảng thành 1 giá trị.

---

## 7. Functions & Arrow functions

```javascript
// Function declaration — hoisted
function add(a, b) { return a + b; }

// Function expression — không hoisted
const add = function (a, b) { return a + b; };

// Arrow function — không có `this` riêng, không có `arguments`
const add = (a, b) => a + b;
const noop = () => {};
```

### `this` trong arrow function

Arrow function **không có binding `this`** — nó kế thừa `this` từ scope cha. Điều này rất quan trọng trong React class component và callback.

```javascript
class Button {
  constructor() {
    this.handle = () => console.log(this);  // arrow → bind this
  }
  handleRegular() { console.log(this); }
}

const b = new Button();
const h = b.handle;
h();        // this = b ✅ (arrow)
const h2 = b.handleRegular;
h2();       // this = undefined ❌ (function thường)
```

### Áp dụng cho Agrimarket

```javascript
// src/components/CartProducts/CartProduct.tsx
const buttonAdd = async (product_id: string) => {
  const target = product.find((item) => item._id === product_id);
  const attributeId = target?.productAttributes?.[0]?._id;
  // ...
};

// Dùng arrow trong JSX map để giữ this (không cần trong function component)
{filterProduct.map((product) => (
  <ButtonClick onClick={() => buttonAdd(product._id)} />
))}
```

### Câu hỏi phỏng vấn

**Q: Arrow function khác function declaration như thế nào?**
A: (1) Arrow không có `this` riêng (lexical `this`) — quan trọng cho callback/class. (2) Arrow không có `arguments`. (3) Arrow không hoisted (nếu là `const`). (4) Arrow không dùng được làm constructor (`new`). (5) Cú pháp ngắn gọn, tự return giá trị biểu thức 1 dòng.

---

## 8. Scope & Hoisting

```javascript
var a = 1;
let b = 2;
const c = 3;

console.log(a); // 1
console.log(b); // ❌ ReferenceError (TDZ)
console.log(c); // ❌ ReferenceError (TDZ)
```

**Scope chain:** `global → function → block → lexical (closure)`.

**Hoisting:**
- `var` → biến được tạo ở đầu scope với giá trị `undefined`.
- `function` declaration → được hoisted **cùng implementation** → có thể gọi trước khi khai báo.
- `let`/`const`/`class` → hoisted nhưng TDZ.

### Áp dụng

```javascript
// src/utils/interceptors.tsx
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://...";

// Dùng trong function khai báo sau → OK vì function declaration hoisted
export const refreshAccessToken = async () => { /* dùng API_BASE_URL */ };
```

> Nếu `API_BASE_URL` là `const` và `refreshAccessToken` được gọi ở module top-level **trước** dòng khai báo → TDZ error. Thực tế hàm chỉ chạy khi được gọi → an toàn.

---

## 9. Closures

### Định nghĩa

Closure là khả năng một hàm nhớ biến từ scope cha **ngay cả khi scope cha đã kết thúc**.

```javascript
function createCounter() {
  let count = 0;              // biến trong closure
  return {
    increment: () => ++count,
    get: () => count,
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.get()); // 2
```

### Ví dụ kinh điển

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));  // 3 3 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));  // 0 1 2
}
```

Vì `let` tạo binding mới cho mỗi iteration của vòng lặp.

### Áp dụng cho Agrimarket

```javascript
// src/components/Categories/Categories.tsx — tạo handler riêng cho từng item
const handleSeachChange = async (event) => {
  const keywords = event.target.value;
  setSearchTerm(keywords);
  setSearchParams((param) => { param.set("keyword", keywords); return param; });
  const respone = await searchProducts(keywords);
  dispatch(setProduct(respone.data));
};
```

Ở đây `keywords` được "đóng" lại trong closure của mỗi lần gọi.

### Câu hỏi phỏng vấn

**Q: Closure dùng để làm gì trong thực tế?**
A: (1) **Encapsulation** — giữ private state không ai sửa trực tiếp (mẫu counter/module pattern). (2) **Tạo hàm độc lập** với tham số ẩn (currying). (3) **Callback & event handler** giữ được context. (4) **Memoization** — cache kết quả tính toán.

---

## 10. `this` keyword

### Quy tắc xác định `this` (theo thứ tự ưu tiên)

1. `new` → `this` = object vừa tạo
2. `call` / `apply` / `bind` → `this` = object được chỉ định
3. Method của object → `this` = object đó
4. Arrow function → **không có** `this` riêng (kế thừa scope cha)
5. Strict mode → `this` = `undefined`; non-strict → `this` = global object

```javascript
const obj = {
  name: "Agrimarket",
  getName() { return this.name; },
};
const fn = obj.getName;
fn();                    // undefined (strict) — mất context!
obj.getName.call(obj);   // "Agrimarket"
const bound = obj.getName.bind(obj);
bound();                 // "Agrimarket"
```

### Áp dụng cho Agrimarket

```javascript
// src/redux/userReducer/userReducer.tsx — arrow function trong createSlice
setProduct: (state: userState, action: PayloadAction<productTypes[]>) => {
  state.product = action.payload;   // Immer đóng băng state, mutation an toàn
},
```

Redux Toolkit dùng **Immer** — bạn viết như mutate, Immer tạo bản copy mới. Nhờ đó không cần spread thủ công.

### Câu hỏi phỏng vấn

**Q: `call`, `apply`, `bind` khác nhau thế nào?**
A: Cả 3 đều ép `this` cho một hàm.
- `fn.call(thisArg, a, b)` — truyền tham số lẻ.
- `fn.apply(thisArg, [a, b])` — truyền mảng tham số.
- `fn.bind(thisArg, a, b)` — trả về **hàm mới** đã bind (dùng cho callback).

---

## 11. Destructuring

```javascript
// Object destructuring
const { email, password } = values;
const { data: { access_token, refresh_token } } = response;

// Rename
const { _id: id } = product;

// Default value
const { message = "Payment success" } = response;

// Array destructuring
const [first, second] = products;
const [, second] = products;   // bỏ phần tử đầu

// Destructuring trong tham số — cực kỳ phổ biến trong React
const CartProduct = ({ product, onAdd }) => { ... };
```

### Nested + rest

```javascript
const { user: { name, email }, ...rest } = response.data;
// rest chứa mọi key còn lại
```

### Áp dụng cho Agrimarket

```javascript
// src/container/Auth/pages/Login/Login.tsx
const { access_token, refresh_token, role } = response.data;

// src/container/Payment/Payment.tsx
const { address } = value;
```

### Lỗi thường gặp

| Lỗi | Fix |
|-----|-----|
| `const { a } = undefined` → TypeError | Dùng `const { a } = obj ?? {}` |
| Gán lại biến đã const từ destructuring | `let { a } = obj` |
| Nhầm `=` với `:` | `const { a: b } = obj` nghĩa là lấy `obj.a` gán vào `b` |

### Câu hỏi phỏng vấn

**Q: Destructuring param vs destructuring trong body?**
A:
```javascript
function f({ a, b }) { }        // param destructuring
function f(obj) { const { a, b } = obj; }   // body destructuring
```
Param destructuring cho phép **default value** (`{ a = 1 }`) — không làm được trong body. React thường dùng param destructuring.

---

## 12. Spread & Rest

### Spread `...` (truyền)

```javascript
const arr2 = [...arr1];
const obj2 = { ...obj1, extra: 1 };   // ghi đè key trùng
```

### Rest `...` (nhận)

```javascript
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
const [first, ...others] = arr;
const { id, ...rest } = obj;
```

### Áp dụng cho Agrimarket

```javascript
// src/utils/api.adapter.ts
return {
  ...product,                    // spread: copy tất cả field gốc
  category,                      // thêm/ghi đè
  productAttributes: attributes,
  price,
};

// src/components/CartProducts/CartProduct.tsx
setQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
// ↑ spread để không mất các giá trị khác
```

### Lỗi thường gặp

| Lỗi | Giải thích |
|------|------------|
| Spread shallow copy | `{...obj}` chỉ copy 1 cấp; object lồng vẫn shared reference |
| `const arr = [...arr]` | `ReferenceError` — khai báo lại trong scope |

### Câu hỏi phỏng vấn

**Q: Spread object so với `Object.assign`?**
A: Gần như tương đương cho object. `Object.assign` **mutate** target, spread **tạo mới**. Spread chỉ copy **own enumerable** properties (giống assign) nhưng không copy symbol từ prototype.

---

## 13. Template literals

```javascript
const name = "Rodriguez";
const greeting = `Xin chào ${name}, bạn có ${products.length} sản phẩm`;
```

**Tính năng nâng cao:**

```javascript
// Multi-line
const html = `
  <div>
    Hello
  </div>
`;

// Tagged template — custom xử lý
function highlight(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] ? `<b>${values[i]}</b>` : ""), "");
}
```

### Áp dụng

```javascript
// src/container/Detail/page/ProductDetail/ProductDetail.tsx
{product.category?.name}   // JSX tương đương template literal

// src/components/HeaderItem/HeaderItem.tsx
`/editadmin/${productTypes._id}`
```

### Lỗi thường gặp

Dùng nhầm `${}` với string thường:
```javascript
const s = "Total: ${total}";  // ❌ literal, không interpolate
const s = `Total: ${total}`;  // ✅
```

---

## 14. Optional chaining `?.`

```javascript
user?.profile?.avatarUrl
items?.[0]?.product_id?.thumbnail_url
fn?.(arg)              // optional call
```

### Áp dụng cho Agrimarket

```javascript
// src/components/CartProducts/CartProduct.tsx
const attributeId = target?.productAttributes?.[0]?._id;

// src/utils/api.adapter.ts
const first = attributes[0] ?? {};
```

**Tại sao quan trọng:** API có thể trả thiếu field (product không có attribute, category không có tên). `?.` tránh crash toàn app chỉ vì 1 field thiếu.

### Lỗi thường gặp

| Lỗi | Giải thích |
|------|------------|
| `a?.b.c` | Chỉ guard `a`, nếu `a` tồn tại nhưng `b` undefined → vẫn crash. Phải `a?.b?.c` |
| `a?.()` với `a` không phải function | `TypeError` — `?.` chỉ guard null/undefined |

### Câu hỏi phỏng vấn

**Q: `?.` và `??` khác nhau thế nào?**
A: `?.` — short-circuit **property access** khi giá trị `null`/`undefined` (trả `undefined` thay vì throw). `??` — toán tử **logical OR** trả về toán hạng phải nếu `null`/`undefined` (khác `||` ở chỗ `0`, `""`, `false` không bị coi là falsy).

---

## 15. Nullish Coalescing `??`

```javascript
const a = null ?? "default";    // "default"
const b = 0 ?? "default";       // 0      ← giữ nguyên!
const c = 0 || "default";       // "default" ← sai logic
const d = "" ?? "default";      // ""
```

**Không được mix với `||` / `&&` mà không ngoặc:**

```javascript
const x = a ?? b || c;   // ❌ SyntaxError
const y = (a ?? b) || c; // ✅
```

### Áp dụng cho Agrimarket

```javascript
// src/utils/api.adapter.ts — derive giá
const price =
  (first.discount_price as number | undefined) ??
  (first.total_price as number | undefined) ??
  (first.original_price as number | undefined) ??
  product.sold;
```

Dùng `??` để giữ `0` (giá 0 hợp lệ) thay vì nhảy sang giá khác.

### Câu hỏi phỏng vấn

**Q: `??` khác `||` ở đâu?**
A: `||` coi mọi falsy (`0`, `""`, `false`, `NaN`, `null`, `undefined`) là "cần fallback". `??` chỉ fallback khi `null` hoặc `undefined`. Dùng `??` khi `0`/`""` là giá trị hợp lệ (giá 0, chuỗi rỗng có chủ ý).

---

# 9.2 JavaScript Intermediate

## 1. Array methods

| Method | Trả về | Dùng khi |
|--------|---------|----------|
| `map` | mảng mới, cùng độ dài | biến đổi từng phần tử |
| `filter` | mảng mới, có thể rỗng | lọc |
| `find` | phần tử đầu khớp \| `undefined` | tìm 1 phần tử |
| `findIndex` | index \| `-1` | tìm vị trí |
| `some` | boolean | có ít nhất 1 khớp? |
| `every` | boolean | tất cả khớp? |
| `reduce` | 1 giá trị | gộp |
| `includes` | boolean | có chứa? |
| `sort` | mảng mới (nếu copy) | sắp xếp |
| `flat` | mảng phẳng 1 cấp | làm phẳng |

### Bẫy: `sort` mutate

```javascript
const arr = [3, 1, 2];
arr.sort();                 // ❌ mutate arr
const sorted = [...arr].sort();  // ✅ copy trước
```

### Bẫy: `filter` trả về `undefined` khi không tìm thấy

```javascript
const product = products.find((p) => p._id === id);   // undefined nếu không có
product.name;   // ❌ TypeError
product?.name;  // ✅
```

### Áp dụng

```javascript
// src/components/CartProducts/CartProduct.tsx
const filterProduct = lengthProduct > 5 ? product.slice(0, 8) : product;

// src/container/Payment/Payment.tsx
const initialQuantities = renderlist.reduce((acc, item) => {
  acc[item.product_id._id] = item.quantity;
  return acc;
}, {} as { [key: string]: number });
```

### Câu hỏi phỏng vấn

**Q: `find` vs `filter`?**
A: `find` trả **phần tử đầu tiên** khớp (hoặc `undefined`) → O(n) nhưng dừng sớm. `filter` trả **mảng** tất cả phần tử khớp. Dùng `find` khi chỉ cần 1 kết quả.

---

## 2. Object manipulation

```javascript
Object.keys(obj);          // ["a", "b"]
Object.values(obj);        // [1, 2]
Object.entries(obj);       // [["a",1],["b",2]]
Object.fromEntries(arr);   // ngược lại
Object.assign(target, src);
Object.freeze(obj);        // immutable (shallow)
```

**Xoá key:** `delete obj.key` hoặc `const { key, ...rest } = obj`.

**Merge sâu (không có sẵn):**

```javascript
const deepMerge = (target, source) => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) {
      target[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};
```

### Áp dụng

```javascript
// src/components/Categories/Categories.tsx
Object.entries(category)?.map(([slug, product]) => (
  <li key={slug}>...</li>
));
```

---

## 3. Shallow copy vs Deep copy

| Cách | Shallow | Deep |
|------|---------|------|
| `{...obj}` / `[...arr]` | ✅ | ❌ |
| `Object.assign({}, obj)` | ✅ | ❌ |
| `structuredClone(obj)` | ❌ | ✅ (native, modern browsers) |
| `JSON.parse(JSON.stringify(obj))` | ❌ | ✅ (mất Date, undefined, function) |
| `lodash.cloneDeep` | ❌ | ✅ |

```javascript
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 3;
console.log(original.nested.b);  // 3 ← vẫn bị ảnh hưởng!
```

### Áp dụng cho Agrimarket

```javascript
// src/utils/api.adapter.ts — spread là shallow, nhưng ta KHÔNG mutate
// nested productAttributes nên an toàn vì chỉ tham chiếu, không sửa
return { ...product, productAttributes: attributes };
```

> ⚠️ Redux Toolkit dùng Immer nên mutation trong reducer **được chấp nhận** và Immer tự deep-copy. Đó là lý do `state.product = action.payload` an toàn trong `createSlice`.

---

## 4. Higher-order functions & callbacks

```javascript
// HOF: function nhận function làm argument hoặc trả về function
const withLogging = (fn) => (...args) => {
  console.log("call:", args);
  const result = fn(...args);
  console.log("result:", result);
  return result;
};

const fetchWithLog = withLogging(fetchProducts);
```

### Áp dụng

```javascript
// src/utils/api.adapter.ts
export const getApiErrorMessage = (error, fallback) => { ... }
// Hàm này nhận một hàm khác làm tham số mặc định — pattern "function as default"

export const normalizeProducts = (products) =>
  Array.isArray(products) ? products.map(normalizeProduct) : [];
// ↑ normalizeProduct được truyền trực tiếp làm callback cho map
```

---

## 5. Promises

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});
```

**States:** `pending` → `fulfilled` | `rejected`.

**API:**

```javascript
promise.then((v) => {}).catch((e) => {}).finally(() => {});
Promise.all([p1, p2]);       // Chờ tất cả, reject nếu 1 reject
Promise.allSettled([p1, p2]); // Chờ tất cả, không reject
Promise.race([p1, p2]);     // Lấy cái nào xong trước
Promise.any([p1, p2]);      // Lấy cái đầu tiên fulfill
```

### Promise chaining vs callback hell

```javascript
// Callback hell
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getItems(orders, (items) => { /* ... */ });
  });
});

// Promise chaining
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => getItems(orders))
  .catch((err) => console.error(err));
```

---

## 6. `async` / `await`

```javascript
const getProducts = async () => {
  try {
    const response = await requestApi("products", "GET", {});
    return response.data;
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**Quy tắc quan trọng:**
- `await` chỉ dùng trong `async function`.
- `async` function luôn trả về Promise.
- `await` trên non-Promise → vẫn hoạt động (được wrap thành resolved promise).
- `try/catch` **bắt** được lỗi của `await` (khác với `.then().catch()` khi throw trong callback không bắt được).

### Áp dụng cho Agrimarket

```javascript
// src/container/Payment/Payment.tsx
const order = async (value: any) => {
  if (!listcard || !renderlist || renderlist.length === 0) {
    toast.error("Giỏ hàng đang trống");
    return;
  }
  try {
    const response = await createOrder({ ... });
    setOpen(false);
    toast.success(response.message || "Payment success");
    await fetchCart();       // await tuần tự — phụ thuộc kết quả trước
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Lỗi thanh toán"));
  }
};
```

---

## 7. `try / catch / finally`

```javascript
try {
  const data = JSON.parse(text);
} catch (error) {
  if (error instanceof SyntaxError) {
    // lỗi parse
  } else {
    // lỗi khác
  }
} finally {
  // luôn chạy
}
```

**Optional catch binding (ES2019):** `catch { }` — bỏ qua biến error.

### Áp dụng

```javascript
// src/utils/api.adapter.ts — an toàn khi body không phải JSON
try { json = JSON.parse(text); } catch { /* non-json */ }
```

---

## 8. Event Loop

### Mô hình

```
Call Stack  →  Web APIs (setTimeout, fetch, DOM events)  →  Callback Queue  →  Microtask Queue  →  Call Stack
```

### Thứ tự thực thi

1. **Synchronous code** (call stack) — chạy trước.
2. **Microtasks** — `Promise.then`, `queueMicrotask`, `MutationObserver`.
3. **Macrotasks** — `setTimeout`, `setInterval`, I/O, event handler.

**Luôn:** sync → microtask hết → macrotask.

### Ví dụ

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

### Áp dụng cho Agrimarket

```javascript
// src/components/CartProducts/CartProduct.tsx
const buttonAdd = async (product_id: string) => {
  await addToCart({ ... });      // microtask (Promise)
  const respones = await getCart();
  dispatch(setcartnumber(respones.data.items.length));
  toast.success("add product successfully");
};
```

Hai lệnh `await` tuần tự → 2 request nối tiếp, không song song. Nếu không cần kết quả `addToCart` thì có thể chạy song song, nhưng ở đây cần `getCart` sau khi thêm nên tuần tự là đúng.

### Câu hỏi phỏng vấn

**Q: Microtask vs Macrotask?**
A: Microtask (Promise callbacks, `queueMicrotask`) chạy **ngay sau** call stack rỗng, **trước** mọi macrotask và được xử lý hết trước khi render. Macrotask (`setTimeout`, I/O, event) chạy ở các vòng sau của event loop.

---

## 9. `setTimeout` vs `setInterval`

```javascript
const id = setTimeout(fn, 1000);
clearTimeout(id);

const id2 = setInterval(fn, 1000);
clearInterval(id2);
```

**Vấn đề:** `setInterval` không chờ fn hoàn thành → các lần gọi có thể chồng lấn.

**Cách an toàn (self-scheduling timeout):**

```javascript
function poll(fn, interval) {
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    await fn();
    setTimeout(tick, interval);
  };
  tick();
  return () => { stopped = true; };
}
```

### Áp dụng

```javascript
// src/container/Auth/pages/Verification/Verification.tsx
const [deadline, setDeadline] = useState<number>(Date.now() + 1000 * 60 * 5);
const onChange: CountdownProps["onChange"] = (val) => {
  if (typeof val === "number") setStore("remainingTime", val);
};
// Dùng component <Countdown> của antd thay vì setInterval thủ công
```

---

## 10. ES Modules

```javascript
// Export
export const getProducts = async () => { ... };
export default CartProduct;
export { publicRoute } from "./routes";
export * from "./api.adapter";

// Import
import CartProduct from "./CartProduct";
import { getProducts, searchProducts } from "../../apis";
import type { productTypes } from "../../@type/global.type";
```

**Đặc điểm:**
- `import`/`export` là **static** — engine phân tích trước khi chạy → **hoisting** (dùng trước khi khai báo vẫn OK).
- Live binding: `export let count` → giá trị update được nhìn thấy từ module khác.
- `import` bất biến — không gán lại được.

### Áp dụng cho Agrimarket

```typescript
// src/apis/index.ts
import requestApi from "../utils/interceptors";
import { normalizeCart, normalizeProducts, normalizeProduct, normalizeProfile } from "../utils/api.adapter";
```

---

## 11. Error handling

```javascript
// Custom error
class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// try/catch
try { await api(); } catch (e) {
  if (e instanceof ApiError && e.status === 401) { /* handle */ }
}
```

**`instanceof` vs `error.name`:**

| | `instanceof` | `error.name` |
|---|---|---|
| Custom error | ✅ | ✅ (nếu set `this.name`) |
| Qua network / bundle | ❌ (khác realm) | ✅ |
| Built-in (`TypeError`) | ✅ | ✅ |

### Áp dụng

```typescript
// src/utils/api.adapter.ts — duck typing thay vì instanceof
const axiosError = error as { message?: string; response?: { data?: LooseRecord } };
const data = axiosError?.response?.data;
```

Dùng **duck typing** vì lỗi có thể đến từ nhiều nguồn (axios, fetch, throw thủ công).

### Câu hỏi phỏng vấn

**Q: `try/catch` bắt được lỗi async không?**
A: `try/catch` thuần **không** bắt được lỗi của Promise rejection. Cần `await` bên trong `try`, hoặc `.catch()`.

```javascript
// ❌ không bắt được
try { fetchData(); } catch (e) {}

// ✅
try { await fetchData(); } catch (e) {}

// ✅
fetchData().catch(handleError);
```

---

# 9.3 JavaScript Advanced

## 1. Prototype & Prototype chain

```javascript
const animal = {
  isAlive: true,
  speak() { return `${this.name} makes a sound.`; },
};

const dog = Object.create(animal);
dog.name = "Rex";

dog.speak();  // "Rex makes a sound."
dog.hasOwnProperty("speak");  // false → thuộc prototype
```

**Chuỗi:** `dog` → `animal` → `Object.prototype` → `null`.

Mọi object trong JS đều có `[[Prototype]]` trỏ đến object khác (trừ `Object.create(null)`).

### Áp dụng cho Agrimarket

```javascript
// Ant Design Table cần `key` cho mỗi row — đây là yêu cầu của thư viện
const extendedList = list.map((obj, index) => ({ ...obj, key: `key-${index}` }));
```

---

## 2. Classes & Inheritance

```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound.`; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);              // bắt buộc gọi trước khi dùng `this`
    this.breed = breed;
  }
  speak() { return `${super.speak()} Woof!`; }
}
```

### Class fields & private fields

```javascript
class ApiClient {
  #token = null;             // private — truy cập ngoài class → SyntaxError
  static baseUrl = "...";    // static — thuộc về class, không phải instance

  setToken(t) { this.#token = t; }
  getToken() { return this.#token; }
}
```

### Áp dụng — không có class trong project

Dự án dùng **function component** + **Redux Toolkit** (thay cho class & reducer thuần). Nhưng hiểu class là nền để hiểu:
- React component cũ (class component) — `this.setState`, `componentDidMount` (tương đương `useEffect`).
- `ErrorBoundary` (bắt buộc là class component vì React bắt buộc class cho error boundary).

---

## 3. Encapsulation

```javascript
// Convention: dùng closure
const createApiClient = (baseUrl) => {
  let token = null;                       // private
  return {
    setToken: (t) => { token = t; },
    getToken: () => token,
  };
};
```

### Áp dụng

```javascript
// src/utils/setting.ts — export từng hàm, giữ state ẩn
export const { getStore, setStore, setCookie, getCookie, clearStore } = config;
```

---

## 4. Execution context

Mỗi lần gọi hàm tạo 1 **execution context** gồm 3 phần:

1. **Variable Environment** — biến, tham số.
2. **Lexical Environment** — scope cha (chain).
3. **This binding**.

```javascript
var x = 1;

function outer() {
  var x = 2;
  function inner() {
    console.log(x);  // 2 — tìm trong lexical chain
  }
  inner();
}
outer();
```

**Hoisting order trong một scope:**
1. Tạo global object.
2. Tạo execution context.
3. Hoisting: `function` declarations → khởi tạo hoàn chỉnh; `var` → `undefined`; `let`/`const` → TDZ.
4. Thực thi code từng dòng.

---

## 5. Call stack

```javascript
function a() { b(); }
function b() { c(); }
function c() { console.log("deep"); }
a();
// Stack: a → b → c
```

**Stack overflow:** đệ quy không có base case → `RangeError: Maximum call stack size exceeded`.

---

## 6. Memory management & Garbage collection

**Bộ nhớ JS:**
- **Primitive** → trong call stack.
- **Object** → heap.
- **WeakMap / WeakSet** → GC có thể thu hồi khi key bị thu hồi.

```javascript
const cache = new WeakMap();  // key phải là object
```

### Áp dụng — memory leak trong React

```javascript
// ❌ Leak: không cleanup
useEffect(() => {
  const timer = setInterval(fetchCart, 5000);
}, []);

// ✅ Đúng
useEffect(() => {
  const timer = setInterval(fetchCart, 5000);
  return () => clearInterval(timer);
}, []);
```

### Áp dụng trong dự án

```javascript
// src/container/Detail/page/ProductDetail/ProductDetail.tsx
useEffect(() => {
  const fetchProduct = async () => {
    const response = await getProductById(productId ?? "");
    dispatch(setProduct([response.data]));
  };
  fetchProduct();
}, [productId]);
// ⚠️ Nên có cleanup: nếu component unmount trước khi fetch xong → setState sau unmount
```

**Fix chuẩn:** dùng `AbortController` hoặc cờ `let cancelled = false`.

---

## 7. Debouncing

```javascript
function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

**Áp dụng trực tiếp:** `Categories.tsx` hiện gọi API mỗi lần gõ → nên debounce 300ms.

```typescript
// src/components/Categories/Categories.tsx — cải tiến đề xuất
const searchDebounced = useMemo(
  () => debounce((kw: string) => { searchProducts(kw).then(r => dispatch(setProduct(r.data))); }, 300),
  [dispatch]
);

const handleSeachChange = (event: any) => {
  const keywords = event.target.value;
  setSearchTerm(keywords);
  setSearchParams((p) => { p.set("keyword", keywords); return p; });
  searchDebounced(keywords);
};
```

### Debounce vs Throttle

| | Debounce | Throttle |
|---|---|---|
| Khi nào gọi | Sau khi **ngừng** gọi trong `delay` | Tối đa 1 lần mỗi `delay` |
| Phù hợp | search, autocomplete, resize | scroll, mousemove, drag |

### Câu hỏi phỏng vấn

**Q: Search box nên debounce bao nhiêu ms?**
A: 300–500ms là phổ biến. Quá ngắn → vẫn nhiều request; quá dài → cảm giác chậm. Ngoài ra nên thêm `AbortController` để huỷ request cũ khi có request mới.

---

## 8. Event delegation

```javascript
// Delegation: gắn 1 listener lên parent
list.addEventListener("click", (e) => {
  const item = e.target.closest("[data-id]");
  if (item) handleClick(item.dataset.id);
});

// React tự làm việc này
<div onClick={(e) => {
  const target = (e.target as HTMLElement).closest("[data-id]");
}}>
```

**Lợi ích:** 1 listener thay vì N listener → giảm memory, đơn giản khi list dynamic.

### Áp dụng

```javascript
// src/components/CartProducts/CartProduct.tsx — dùng <Link> thay vì <a href>
<Link to={`product/${product._id}`}>
  <img src={product.thumbnail_url} alt="" />
</Link>
```

`Link` dùng `history.push` (SPA navigation) thay vì reload trang.

---

## 9. Immutability

```javascript
// ❌ Mutate
const state = { items: [] };
state.items.push(newItem);        // mutate

// ✅ Immutable
const newState = { ...state, items: [...state.items, newItem] };
```

**Nguồn động của bug trong React:** mutate state → React so sánh tham chiếu (`Object.is`) → thấy cùng object → không re-render.

### Áp dụng cho Agrimarket

```javascript
// src/redux/userReducer/userReducer.tsx — Immer cho phép "mutation" an toàn
setProduct: (state, action) => {
  state.product = action.payload;   // Immer tạo copy mới ở background
}
```

**Ngoài Redux** phải giữ immutability thật:

```javascript
// src/components/CartProducts/CartProduct.tsx
setQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
// ↑ tạo object mới — đúng
```

### Câu hỏi phỏng vấn

**Q: React so sánh state bằng cách nào?**
A: `Object.is()` (reference equality) trên từng field của state hook. Nếu cùng tham chiếu → coi như không đổi → bỏ qua re-render. Vì vậy mutate object sẽ không trigger render.

---

## 10. Functional programming

**Nguyên tắc:**
- **Pure function** — cùng input → cùng output, không side-effect.
- **Immutability** — không mutate.
- **Higher-order function**.
- **Function composition**.

```javascript
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

const withCurrency = (n) => `$${n}`;
const withTax = (n) => n * 1.1;
const formatPrice = compose(withCurrency, withTax);
```

### Áp dụng

```javascript
// src/utils/api.adapter.ts — hàm thuần, dễ test
export const normalizeProduct = (product) => {
  if (!product) return product;
  const rawAttributes = product.attributes ?? product.attribute;
  const attributes = Array.isArray(rawAttributes)
    ? rawAttributes
    : rawAttributes ? [rawAttributes] : [];
  return { ...product, category: ..., productAttributes: attributes, price: ... };
};
```

Hàm này: cùng input → cùng output, không mutate input, không side-effect → **dễ unit test, dễ reuse**.

---

## 11. Performance optimization

### 11.1 Tránh re-render không cần thiết

```javascript
// ❌ Tạo object/array mới mỗi render → props đổi tham chiếu → con re-render
<Child data={{ a: 1 }} />
<Child items={items.filter(Boolean)} />

// ✅ useMemo hoặc tính trước, chuyển vào component con
```

### 11.2 `React.memo`

```javascript
const ProductCard = React.memo(({ product }) => { ... });
```

Chỉ re-render khi props đổi tham chiếu. **Chỉ dùng khi component nặng** — thêm memo hoá mọi thứ lại tốn hơn.

### 11.3 Code splitting

```javascript
// src/routes/routes.ts — đã áp dụng
const MainHome = React.lazy(() => import("../container/Home/page/MainHome"));
```

### 11.4 Tối ưu list rendering

```javascript
// ✅ key ổn định
{items.map((item) => <Row key={item._id} />)}

// ❌ key theo index → khi sort/reorder, React reuse sai component
{items.map((item, i) => <Row key={i} />)}
```

### 11.5 Ảnh

```javascript
<img loading="lazy" decoding="async" src={product.thumbnail_url} alt={product.name} />
```

### Áp dụng cho Agrimarket

| Kỹ thuật | Trạng thái |
|-----------|-----------|
| Code splitting theo route | ✅ `React.lazy` + `Suspense` trong `App.tsx` |
| `key` ổn định | 🟡 `ProductDetail.tsx` & `Payment.tsx` còn dùng `key={index}` |
| `loading="lazy"` cho ảnh | ❌ Chưa áp dụng |
| `React.memo` cho card | ❌ Chưa áp dụng (danh sách ≤ 8 item → chưa cần) |
| Debounce search | ❌ Chưa áp dụng |

> Xem chi tiết: [`05-optimization.md`](05-optimization.md)

---

## 12. Memory leaks

### Dạng phổ biến trong React

| Dạng | Ví dụ | Fix |
|------|-------|-----|
| Event listener không remove | `window.addEventListener` trong `useEffect` | `return () => window.removeEventListener(...)` |
| Timer không clear | `setInterval` | `return () => clearInterval(...)` |
| Subscription không unsubscribe | WebSocket, observable | `return () => sub.unsubscribe()` |
| SetState sau unmount | fetch resolve sau khi unmount | `AbortController` hoặc cờ `cancelled` |
| Closure giữ reference lớn | closure giữ object toàn bộ | Tránh capture thừa, dùng ref khi cần |

### Ví dụ fix

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetchProducts({ signal: controller.signal })
    .then((data) => dispatch(setProduct(data)))
    .catch((err) => {
      if (err.name === "AbortError") return;   // bị huỷ → bỏ qua
      console.error(err);
    });

  return () => controller.abort();
}, [dispatch]);
```

### Câu hỏi phỏng vấn

**Q: React 18 StrictMode mount 2 lần có phải leak không?**
A: Không. React 18 StrictMode cố tình mount → unmount → mount lại để phát hiện effect không cleanup. Nếu effect cleanup đúng, lần mount thứ 2 hoàn hành. Đây là hành vi **đúng**, không phải bug.

---

## 13. Tổng kết — bảng tra nhanh

| Tôi muốn... | Dùng |
|--------------|------|
| Lấy 1 phần tử từ mảng | `find` |
| Lọc mảng | `filter` |
| Tạo mảng mới từ mảng | `map` |
| Gộp mảng thành 1 giá trị | `reduce` |
| Copy object (1 cấp) | `{ ...obj }` |
| Copy object (sâu) | `structuredClone(obj)` |
| Lấy key của object | `Object.keys(obj)` |
| Gộp 2 object | `{ ...a, ...b }` |
| Kiểm tra có tồn tại | `?.` + `??` |
| Chờ nhiều request | `Promise.all` |
| Chờ nhiều request, không fail nếu 1 lỗi | `Promise.allSettled` |
| Huỷ request | `AbortController` |
| Debounce search | `setTimeout` wrapper |
| Tránh gọi API lặp | `useEffect` + `[]` deps |
| Xử lý lỗi API | `try/catch` + `getApiErrorMessage` |
| Refresh token khi 401 | Axios response interceptor |
