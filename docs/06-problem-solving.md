# 06. Giải quyết vấn đề thực tế (Part 13)

> Framework 7 bước, áp dụng cho **các bug thật đã gặp trong Agrimarket**.

---

## Framework 7 bước

```
Step 1. Hiểu vấn đề
Step 2. Tìm ra nguồn
Step 3. Debug
Step 4. Xác định root cause
Step 5. Implement giải pháp
Step 6. Verify
Step 7. Document
```

---

## Step 1 — Hiểu vấn đề

**4 câu hỏi bắt buộc trả lời trước khi sửa code:**

1. **Expected behavior** là gì?
2. **Actual behavior** là gì?
3. **Feature nào bị ảnh hưởng?**
4. **Reproduce steps** là gì?

### Ví dụ thật: "Thêm vào giỏ hàng báo lỗi 400"

| Câu hỏi | Trả lời |
|----------|---------|
| Expected | Sản phẩm được thêm vào giỏ, badge tăng |
| Actual | Toast lỗi, HTTP 400 Bad Request |
| Feature bị ảnh hưởng | Add to cart ở Home, Shop, Product Detail |
| Reproduce | Đăng nhập → bấm "Add to cart" ở bất kỳ đâu → Network tab thấy 400 |

> 💡 **Mẹo:** Viết lại bug report này thành 1 ticket. Nếu không mô tả được expected vs actual → chưa đủ hiểu để sửa.

---

## Step 2 — Tìm ra nguồn

**Chuỗi truy vết trong dự án:**

```
UI element
  → event handler (trong .tsx)
  → hook / useEffect
  → API helper (src/apis/index.ts)
  → requestApi (src/utils/interceptors.tsx)
  → axios
  → Backend endpoint
  → Response
  → Adapter (src/utils/api.adapter.ts)
  → Redux dispatch
  → useSelector
  → render
```

### Công cụ tìm nhanh

```bash
# Tìm nơi gọi 1 endpoint
rg "users/login" src/

# Tìm nơi dùng 1 action
rg "setcartnumber" src/

# Tìm field trong type
rg "productAttributes" src/
```

### Ví dụ thật: "400 khi add to cart"

```
1. UI: <ButtonClick onClick={() => buttonAdd(product._id)} />     → src/components/CartProducts/CartProduct.tsx
2. Handler: const buttonAdd = async (product_id) => { ... }        → cùng file
3. API: await addToCart({ items: [...] })                          → src/apis/index.ts
4. Transport: requestApi("carts/items", "POST", payload)           → src/utils/interceptors.tsx
5. Response: 400 { message: "Validation error.", errors: { ... } }
```

→ Vấn đề nằm ở **bước 3**: payload thiếu field.

---

## Step 3 — Debug

### Công cụ theo thứ tự ưu tiên

| Công cụ | Dùng để xem | Khi nào dùng đầu tiên |
|---------|--------------|------------------------|
| **Network tab** (DevTools) | Request URL, method, headers, payload, status, response | ✅ Luôn bắt đầu ở đây |
| **Console** | Error, warning, log | Khi có exception |
| **React DevTools** | Component tree, props, state | Khi UI không render đúng |
| **Redux DevTools** | Action, state trước/sau | Khi state không đúng |
| **Sources → Pause on exceptions** | Stack trace chính xác | Khi không hiểu lỗi |
| `console.log` / `debugger` | Giá trị tại 1 dòng | Khi cần xem giá trị giữa chừng |

### 5 bước trong Network tab

```
1. Filter theo Fetch/XHR → bỏ qua ảnh, font, CSS
2. Xem Request URL       → đúng endpoint? đúng base URL?
3. Xem Request Headers   → có Authorization? Content-Type đúng?
4. Xem Request Payload  → đúng field? đúng tên? đúng kiểu?
5. Xem Response          → status? body shape?
```

### Ví dụ thật: phân tích 400

```
Request:  POST https://agrimarket-z5f0.onrender.com/api/v1/carts/items
Payload:  { product_id: "65f...", quantity: 1 }
Response: 400 { "message": "Validation error.", "errors": { "items": { "msg": "product_attribute_id should not be empty" } } }
```

→ Thiếu `product_attribute_id`.

### Ví dụ thật: phân tích 404

```
Request:  POST https://agrimarket-z5f0.onrender.com/api/v1/auth/login
Response: 404 { "message": "Cannot POST /api/v1/auth/login" }
```

→ Endpoint sai. Backend dùng prefix `users/`.

### Ví dụ thật: phân tích 401

```
Request:  GET .../api/v1/carts
Response: 401 { "message": "You must be logged in to continue." }
```

→ Thiếu token hoặc token hết hạn. Kiểm tra:
1. `localStorage.getItem("ACCESS_TOKEN")` có giá trị không?
2. Header `Authorization` có được gắn không?
3. Token còn hạn không?

---

## Step 4 — Xác định root cause

**Phân biệt 4 loại lỗi:**

| Loại | Dấu hiệu | Ví dụ trong dự án |
|------|----------|-------------------|
| **Frontend – sai endpoint** | 404 | `auth/login` → phải `users/login` |
| **Frontend – sai payload** | 400 validation error | Thiếu `product_attribute_id` |
| **Frontend – sai mapping** | 200 nhưng UI sai | `attributes` vs `productAttributes` |
| **Backend** | 500 | `Failed to send OTP` — SMTP chưa cấu hình |

### Bảng chẩn đoán nhanh

| Status | Khả năng cao nhất | Cách kiểm tra |
|--------|-------------------|----------------|
| 400 | Payload sai tên field / thiếu field | Xem `errors` trong response |
| 401 | Token thiếu / hết hạn / chưa verify | Kiểm tra token, header |
| 403 | Token hợp lệ nhưng thiếu quyền | Kiểm tra role |
| 404 | Sai path | So sánh với route tree backend |
| 409 | Conflict (trùng email, ...) | Đọc `message` |
| 500 | Lỗi server (DB, mail, logic) | Đọc `message`, báo backend |
| 200 nhưng UI trống | Response rỗng / mapping sai | Log response, kiểm tra adapter |

### Root cause vs symptom

**Ví dụ:**

| | Nội dung |
|---|---------|
| **Symptom** | "Giỏ hàng không hiện sản phẩm" |
| **Triệu chứng sâu hơn** | `state.user.cart.items` = `[]` |
| **Root cause** | API trả `carts[]`, component đọc `items` → thiếu adapter |

Sửa symptom (render `carts` trực tiếp) → sẽ hỏng khi API đổi. Sửa root cause (thêm adapter) → đúng và bền.

---

## Step 5 — Implement giải pháp

**5 nguyên tắc (theo yêu cầu bảo toàn source):**

1. **Thay đổi nhỏ nhất có thể** giải quyết vấn đề.
2. **Giữ nguyên kiến trúc** — không tạo service/hook/component trùng lặp.
3. **Đúng tầng** — lỗi mapping → adapter; lỗi URL → `src/apis`; lỗi UI → component.
4. **Không thay đổi business logic / UI / UX.**
5. **Không thêm dependency.**

### Ví dụ thật: 3 cách sửa "product.attributes"

```typescript
// ❌ Cách 1 — sửa tại chỗ dùng (nhiều file, dễ sót)
const attrs = product.attributes ?? (product.attribute ? [product.attribute] : []);

// ❌ Cách 2 — đổi type + mọi nơi đọc (nhiều thay đổi)
type productTypes = { ...; productAttributes: ... }
const attrs = product.productAttributes;

// ✅ Cách 3 — adapter (1 chỗ, backward-compatible)
export const normalizeProduct = (product) => ({
  ...product,
  productAttributes: Array.isArray(product.attributes)
    ? product.attributes
    : product.attribute ? [product.attribute] : [],
});
```

Cách 3 tốt nhất: giữ nguyên mọi component, chỉ thêm 1 file.

### Ví dụ thật: sửa "gọi API trong render body"

```typescript
// ❌ Trước
const supplier = async () => {
  const respone = await getSuppliers();
  dispatch(setsupplier(respone.data));
};
supplier();   // ← gọi trong render → dispatch → re-render → gọi lại → loop vô hạn

// ✅ Sau
useEffect(() => {
  const supplier = async () => {
    try {
      const respone = await getSuppliers();
      dispatch(setsupplier(respone.data));
    } catch (error) {
      console.log(error);
    }
  };
  supplier();
}, []);
```

### Ví dụ thật: sửa "deep-link 404"

```typescript
// ❌ Trước: chỉ đọc từ Redux (rỗng khi mở trực tiếp)
const product = useSelector((state: RootState) => state.user.product);
const detail = product.find((p) => p._id === productId);
if (detail === undefined) { navigate("*"); return; }

// ✅ Sau: fetch nếu chưa có
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await getProductById(productId ?? "");
      dispatch(setProduct([response.data]));
    } catch (error) { console.log(error); }
  };
  fetchProduct();
}, [productId]);
```

---

## Step 6 — Verify

### Checklist verify

| # | Kiểm tra | Cách |
|---|----------|------|
| 1 | Vấn đề gốc đã hết | Reproduce lại bước 1 |
| 2 | Edge case | Dữ liệu rỗng, 1 phần tử, rất nhiều phần tử |
| 3 | Empty state | API trả `[]` → UI không crash |
| 4 | Error state | API trả 500 → có thông báo cho user |
| 5 | Unauthorized | Không token → xử lý đúng |
| 6 | Regression | Các feature khác còn chạy? |
| 7 | Type check | `npx tsc --noEmit` → 0 error |
| 8 | Lint | `npx eslint . --ext ts,tsx` không tăng lỗi mới |
| 9 | Build | `npm run build` thành công |

### Regression testing trong dự án

| Feature | Kiểm tra |
|---------|----------|
| Auth | Login / Register / Verify / Forgot / Reset / Change / Logout |
| Home | Load sản phẩm, filter category, add to cart |
| Shop | Lọc category, search keyword |
| Detail | Mở từ list, mở deep-link, add to cart |
| Payment | Xem giỏ, +/-, Save, Xoá, Checkout |
| Profile | Load, sửa, lưu |
| Favorite | Load danh sách |
| Admin | Vào bằng Admin, xem bảng, xoá, sửa |

### Script kiểm thử tự động

```bash
node scripts/verify-integration.mjs
```

---

## Step 7 — Document

**Mỗi bug fix nên để lại:**

1. **Root cause** — tại sao lỗi xảy ra.
2. **Giải pháp** — đã làm gì.
3. **File đã sửa** — để người sau hiểu phạm vi ảnh hưởng.
4. **Kết quả test** — pass/fail.

Trong dự án này, các thông tin này nằm ở:
- `docs/04-api-integration.md` § 6 — bảng 17 lỗi đã phát hiện & cách sửa.
- `docs/10-features.md` — mỗi feature có mục "Common bugs".
- `WORK.md` § 13 — known issues còn lại.

---

## Case study đầy đủ

### Bug: Deep-link `/product/:id` luôn ra trang 404

**Step 1 — Hiểu vấn đề**
- Expected: mở URL trực tiếp → hiện chi tiết sản phẩm.
- Actual: màn hình trắng rồi nhảy sang trang 404.
- Feature: Product Detail.
- Reproduce: copy URL `/product/<id>` từ Home → dán vào tab mới → F5.

**Step 2 — Tìm nguồn**

```
src/container/Detail/page/ProductDetail/ProductDetail.tsx
  const product = useSelector((state) => state.user.product);   // ← rỗng khi F5
  const detail = product.find((p) => p._id === productId);
  if (detail === undefined) { navigate("*"); return; }
```

`state.user.product` chỉ được fill bởi `CartProduct.tsx` (trang Home). F5 trên `/product/:id` → store (redux-persist) có thể còn, nhưng nếu user mở link lần đầu → rỗng.

**Step 3 — Debug**

- Network tab: **không có** request `GET /products/:id` → frontend không hề gọi API.
- Redux DevTools: `state.user.product = []`.
- Console: không có error.

→ Không phải lỗi backend. Frontend đơn giản là không fetch.

**Step 4 — Root cause**

Component phụ thuộc vào **state của trang khác** thay vì tự lấy dữ liệu theo tham số route. Đây là vi phạm nguyên tắc "component nên tự chịu trách nhiệm dữ liệu nó cần".

**Step 5 — Implement**

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;
  const fetchProduct = async () => {
    try {
      const response = await getProductById(productId ?? "");
      if (!cancelled) dispatch(setProduct([response.data]));
    } catch (error) {
      console.log(error);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };
  fetchProduct();
  return () => { cancelled = true; };
}, [productId]);

// Ba trạng thái thay vì một
if (loading) return <Loading />;
if (detail === undefined) return <NotFound />;
```

**Step 6 — Verify**

- Mở deep-link → sản phẩm hiện (hiển thị `<Loading />` trong lúc chờ). ✅
- Điều hướng từ Home → vẫn hoạt động. ✅
- Không còn nháy trang 404. ✅
- `npx tsc --noEmit` → 0 error. ✅
- `npm run build` → OK. ✅

**Step 7 — Document**

- Ghi vào `docs/10-features.md` § 10 "Common bugs" (đã ghi, đánh dấu đã sửa).
- Ghi vào `docs/04-api-integration.md` § 6 dòng #10.

---

## Case study 2: Giỏ hàng không tăng badge

**Step 1 — Hiểu vấn đề**
- Expected: bấm "Add to cart" → badge tăng.
- Actual: badge vẫn 0, có toast lỗi.

**Step 2 — Tìm nguồn**
`src/components/CartProducts/CartProduct.tsx` → `buttonAdd` → `addToCart` → `src/apis/index.ts`.

**Step 3 — Debug**

```
Request:  POST /api/v1/carts/items
Payload:  { product_id: "65f...", quantity: 1 }
Response: 400 { "message": "Validation error.", "errors": { "items": { "msg": "product_attribute_id should not be empty" } } }
```

**Step 4 — Root cause**

Backend model `CartItem` yêu cầu 3 field: `product_id`, `product_attribute_id`, `quantity`. Frontend chỉ gửi 2.

**Step 5 — Implement**

```typescript
const target = product.find((item) => item._id === product_id);
const attributeId = target?.productAttributes?.[0]?._id;

if (!attributeId) {
  toast.error("Sản phẩm không có thuộc tính để thêm vào giỏ hàng");
  return;
}

await addToCart({
  items: [{ product_id, product_attribute_id: attributeId, quantity: 1 }],
});
```

**Step 6 — Verify**
- Add to cart thành công, badge tăng. ✅
- Áp dụng cho cả 3 nơi gọi (Cart, CartProduct, ProductDetail). ✅

**Step 7 — Document**
`docs/04-api-integration.md` § 6 dòng #7.

---

## Case study 3: Trang Admin gọi `/suppliers` liên tục

**Step 1 — Hiểu vấn đề**
- Expected: 1 request `/suppliers` khi vào trang.
- Actual: hàng trăm request liên tục, trang giật.

**Step 2 — Tìm nguồn**
`src/container/Admin/page/ProductAdmin/ProductAdmin.tsx`:

```typescript
const supplier = async () => {
  const respone = await getSuppliers();
  dispatch(setsupplier(respone.data));   // ← dispatch trong render
};
supplier();                              // ← gọi trong render body
```

**Step 3 — Debug**
- Network tab: `/suppliers` lặp liên tục.
- Redux DevTools: `SET_SUPPLIER` action lặp.
- React DevTools: component re-render liên tục.

**Step 4 — Root cause**

**Vòng lặp render → dispatch → re-render:**

```
render → gọi supplier() → (async) dispatch(setSupplier) → store đổi → re-render → gọi supplier() → ...
```

Đây là vi phạm nguyên tắc "render phải thuần khiết quả" (side-effect trong render).

**Step 5 — Implement**

```typescript
useEffect(() => {
  const supplier = async () => {
    try {
      const respone = await getSuppliers();
      dispatch(setsupplier(respone.data));
    } catch (error) {
      console.log(error);
    }
  };
  supplier();
}, []);
```

**Step 6 — Verify**
- 1 request `/suppliers`. ✅
- Không còn giật. ✅

**Step 7 — Document**
`docs/04-api-integration.md` § 6 dòng #15.

---

## Case study 4: Tìm kiếm sinh lỗi runtime

**Step 1 — Hiểu vấn đề**
- Expected: gõ keyword → lọc sản phẩm.
- Actual: console lỗi React "Rendered fewer hooks than expected" / app giật.

**Step 2 — Tìm nguồn**
`src/components/Categories/Categories.tsx` → `handleInputChange`:

```typescript
const handleInputChange = async (event: any) => {
  console.log(event.target.value);
  setAmount(event.target.value);
  useEffect(() => {          // ❌ Hook trong event handler
    handleInputChange;
  }, []);
};
```

**Step 3 — Debug**
- Console: React warning về số lượng hook.
- Xem code → `useEffect` lồng trong handler.

**Step 4 — Root cause**

**Rules of Hooks:** Hook chỉ được gọi ở top level của component. Gọi trong event handler → số lượng hook thay đổi giữa các render → React lỗi.

Thêm nữa: `useEffect(() => { handleInputChange; }, [])` về mặt logic là vô nghĩa (chỉ định nghĩa callback, không gọi).

**Step 5 — Implement**

```typescript
const handleInputChange = (event: any) => {
  setAmount(Number(event.target.value));
};
// xoá import useEffect không dùng
```

**Step 6 — Verify**
- Gõ trong slider price → không còn lỗi. ✅
- `npx eslint . --ext ts,tsx` → không còn warning liên quan. ✅

**Step 7 — Document**
`docs/04-api-integration.md` § 6 dòng #16.

---

## Sổ tay debugging

### Khi nào đọc Network tab

| Tình huống |
|-----------|
| UI không cập nhật sau khi bấm nút |
| Toast lỗi xuất hiện không rõ nguyên nhân |
| Dữ liệu hiển thị sai |
| Muốn xem request nào đang được gọi (duplicate?) |

### Khi nào đọc Redux DevTools

| Tình huống |
|-----------|
| Component không re-render dù data đã đổi |
| State có giá trị lạ |
| Muốn xem action nào dispatch sai lúc nào |

### Khi nào dùng `debugger`

Khi cần xem giá trị **giữa chừng** một hàm dài mà không muốn thêm log. Đặt `debugger` trong file, mở DevTools → Sources → reload → dừng ở dòng đó.

### Khi nào đọc source backend

Chỉ khi:
- Response 500 với message không rõ.
- Cần xác nhận validation rule.
- Cần biết endpoint có thật sự tồn tại không.

Nếu không có source → dùng **probe** bằng HTTP thay vì đoán:

```javascript
// scripts/probe.mjs
const BASE = "https://agrimarket-z5f0.onrender.com/api/v1";
const call = async (path, { method = "GET", body, token } = {}) => {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* non-json */ }
  return { status: res.status, json, text };
};
```

> ⚠️ Chỉ probe với **dữ liệu test an toàn**. Không tạo/xoá dữ liệu production hàng loạt. Không ghi log token ra file.
