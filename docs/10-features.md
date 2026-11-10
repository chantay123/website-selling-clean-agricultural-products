# 10. Tài liệu chức năng chi tiết (Part 8)

> Mỗi feature dưới đây đều tồn tại thật trong source code. Cấu trúc: Mục đích → Luồng thực thi → Tham chiếu source → Input/Output → Giải thích từng bước → Lỗi thường gặp → Câu hỏi phỏng vấn.

---

## Danh mục

1. [Authentication — Login](#1-authentication--login)
2. [Authentication — Register](#2-authentication--register)
3. [Authentication — Verification OTP](#3-authentication--verification-otp)
4. [Authentication — Forgot / Reset Password](#4-authentication--forgot--reset-password)
5. [Authentication — Change Password](#5-authentication--change-password)
6. [Authentication — Logout](#6-authentication--logout)
7. [Header & Avatar (Profile fetch)](#7-header--avatar)
8. [Danh sách sản phẩm (Home)](#8-danh-sách-sản-phẩm-home)
9. [Danh sách sản phẩm (Shop) + Lọc theo category](#9-danh-sách-sản-phẩm-shop--lọc-theo-category)
10. [Chi tiết sản phẩm](#10-chi-tiết-sản-phẩm)
11. [Tìm kiếm sản phẩm](#11-tìm-kiếm-sản-phẩm)
12. [Giỏ hàng](#12-giỏ-hàng)
13. [Thanh toán / Tạo đơn hàng](#13-thanh-toán--tạo-đơn-hàng)
14. [Hồ sơ cá nhân](#14-hồ-sơ-cá-nhân)
15. [Sản phẩm yêu thích](#15-sản-phẩm-yêu-thích)
16. [Quản trị sản phẩm (Admin)](#16-quản-trị-sản-phẩm-admin)
17. [Chỉnh sửa sản phẩm (Admin)](#17-chỉnh-sửa-sản-phẩm-admin)

---

## 1. Authentication — Login

### 1. Purpose

- **Vấn đề giải quyết:** người dùng cần một phiên đăng nhập để thêm hàng vào giỏ, checkout, xem yêu thích và quản lý hồ sơ.
- **Ai dùng:** khách vẫn chưa có tài khoản.
- **Hành vi mong đợi:** nhập email + mật khẩu → lấy token → chuyển về trang chủ → header hiện avatar + badge giỏ hàng.

### 2. Execution flow

```
User nhấn "Log in"
  → <Form onFinish={loginSubmit}> của antd validate client-side
    → loginSubmit(values)          src/container/Auth/pages/Login/Login.tsx
      → loginApi({ email, password })        src/apis/index.ts
        → requestApi("users/login", "POST", payload)   src/utils/interceptors.tsx
          → axios POST {API_BASE_URL}/users/login
            → Backend NestJS → MongoDB (users collection)
              ← { statusCode, message, data: { access_token, refresh_token, role, ... } }
      → setStore(ACCESS_TOKEN, access_token)      // localStorage
      → setCookie(REFRESH_TOKEN, refresh_token, 7)// cookie
      → dispatch(setAuthenticationStatus(true))
      → dispatch(setAdminStatus(role === "Admin"))
      → navigate("/")
```

### 3. Source code references

| Thứ | Đường dẫn |
|-----|-----------|
| Component | `src/container/Auth/pages/Login/Login.tsx` |
| API helper | `src/apis/index.ts` → `login` |
| Token storage | `src/utils/setting.ts` → `setStore`, `setCookie`, `ACCESS_TOKEN`, `REFRESH_TOKEN` |
| Redux actions | `src/redux/userReducer/userReducer.tsx` → `setAuthenticationStatus`, `setAdminStatus` |
| Endpoint | `POST /users/login` |

### 4. Input & Output

**Input:** `{ email: string, password: string }` (từ `Form.Item name="email"` / `name="password"`).

**Output:**
- Success → `toast.success("Đăng nhập thành công!")`, store cập nhật, điều hướng `/`.
- Fail → `toast.error(getApiErrorMessage(error, "Lỗi đăng nhập"))`.
  - Backend trả 400 với `errors.email.msg = "The email does not exist or has been removed."` → hiển thị đúng message đó.
  - Backend trả 400 với `errors.email.msg = "Account is unverified."` → nghĩa là tài khoản chưa verify OTP.

**Missing data:** nếu `access_token` vắng mặt trong response → store `isAuthenticated = true` nhưng mọi request sau sẽ 401. *Đây là hành vi hiện tại, chưa có guard.*

**Error:** `getApiErrorMessage` ưu tiên `data.message`, sau đó `errors[field].msg`, rồi `error.message`, cuối cùng fallback.

### 5. Step-by-step

1. **Ant Design Form** chặn submit nếu field rỗng (rule `required`) → giảm request vô nghĩa.
2. **`loginSubmit`** là `async`, bọc `try/catch` vì mọi API call trả Promise.
3. **`loginApi`** trả `response.data` (đã bóc envelope) → destructure `access_token, refresh_token, role`.
4. **Lưu token**: `access_token` vào `localStorage` (đọc được bằng JS → dễ dùng cho header), `refresh_token` vào cookie (backend cũng set cookie này).
5. **Role**: nếu `role === "Admin"` → `setAdminStatus(true)` để mở khoá các trang admin.
6. **Điều hướng**: `navigate("/")`.

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Cách sửa |
|------|-------------|----------------|----------|
| 404 `Cannot POST /auth/login` | Gọi sai path (tiền tố `auth/` không tồn tại) | Network tab: 404 | Dùng `users/login` |
| 401 vòng lặp | Refresh token cũng hỏng → interceptor retry vô hạn | Console log "You must be logged in" lặp lại | `_retried` flag đã chặn; kiểm tra cookie `REFRESH_TOKEN` |
| `isAuthenticated` true nhưng header vẫn hiện nút Login | Store persist chưa đồng bộ | Redux DevTools | Dispatch sau khi `setStore` |
| Tài khoản mới không đăng nhập được | Backend yêu cầu verify OTP trước | `errors.email.msg = "Account is unverified."` | Gọi `POST /users/otp/authenticate` |

### 7. Interview questions

**Q: Vì sao access token để localStorage mà refresh token để cookie?**
A: `localStorage` truy cập được bằng JS nên tiện gắn header nhưng dễ bị XSS đánh cắp. Cookie `httpOnly` không đọc được bằng JS nên an toàn hơn cho token sống lâu; backend cũng tự set cookie này. (Lưu ý: cookie hiện chưa set `httpOnly`/`SameSite` từ phía frontend.)

**Q: Nếu access token hết hạn giữa chừng thì sao?**
A: Response interceptor bắt 401 → gọi `POST /users/token/refresh` bằng refresh token → lưu token mới → replay request gốc với header mới. Cờ `_retried` đảm bảo chỉ thử 1 lần, tránh loop vô hạn.

---

## 2. Authentication — Register

### 1. Purpose

Tạo tài khoản mới. Backend yêu cầu `full_name`, `email`, `phone`, `password`, `confirm_password`.

### 2. Execution flow

```
User điền form → Submit
  → registerSubmit(values)                  src/container/Auth/pages/Register/Register.tsx
    → registerApi({ email, password, confirm_password, phone, full_name })
      → requestApi("users/register", "POST", payload)
        → POST {API_BASE_URL}/users/register
          → Backend: validate (class-validator) → tạo user → gửi OTP qua email
            ← { statusCode: 201, message, data: { access_token, refresh_token, ... } }
    → toast.success(message)
    → navigate("/login")
```

### 3. Source code references

- `src/container/Auth/pages/Register/Register.tsx`
- `src/apis/index.ts` → `register`
- `src/@type/user.type.ts` → `registerPayloadType`
- Endpoint: `POST /users/register`

### 4. Input & Output

**Input:** `{ email, password, confirm_password, phone, full_name }` — tất cả `required`.

**Output:**
- 201 → toast + về `/login`.
- 400 → `errors.field.msg` hiển thị.
- **500 `"Failed to send OTP"`** → hiện tại backend không gửi được email → user không tạo được tài khoản. *Đây là lỗi backend/hạ tầng SMTP, không phải lỗi frontend.*

### 5. Step-by-step

1. Form field tên `full_name` (snake_case) khớp với payload API — Ant Design dùng `name` làm key.
2. `registerApi` không tự đăng nhập dù response có token → chuyển hướng `/login` cho đúng flow (user cần verify OTP trước).
3. Payload dùng đúng key snake_case mà backend mong đợi — không map camelCase sang snake_case ở đây vì form field đã là snake_case.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| 500 "Failed to send OTP" | Backend chưa cấu hình SMTP | Sửa ở backend |
| "Email already exists" | Đăng ký trùng | Báo lỗi từ `errors.email.msg` |
| Validate client pass nhưng server fail | Backend có rule riêng (độ dài password, định dạng phone) | Luôn hiển thị `getApiErrorMessage` |

### 7. Interview questions

**Q: Vì sao không tự đăng nhập sau khi register thành công?**
A: Vì backend bắt xác thực email qua OTP trước khi tài khoản được kích hoạt (`Account is unverified.` khi login). Đăng nhập ngay sẽ luôn fail. Flow đúng là register → verify OTP → login.

---

## 3. Authentication — Verification OTP

### 1. Purpose

Xác nhận email bằng mã OTP 6 chữ số. Có 2 nhánh: verify tài khoản mới, và verify mã trong luồng quên mật khẩu.

### 2. Execution flow

```
Nhánh đăng ký:
  User nhập 6 số → Submit
    → handleConfirmClick()                Verification.tsx
      → otpString.length === VITE_OTP_LENGTH
        → isForgotPassword === false → authenticateOtp(otpString)
            → POST /users/otp/authenticate { otp }
              → navigate("/")

Nhánh quên mật khẩu:
        → isForgotPassword === true → authenticateForgotPassword(otpString)
            → POST /users/password/forgot/authenticate { code }
              → navigate("/new-password")

Resend:
  → resendOtp(email) → POST /users/otp/revalidate { email }
```

### 3. Source code references

- `src/container/Auth/pages/Verification/Verification.tsx`
- `src/apis/index.ts` → `authenticateOtp`, `authenticateForgotPassword`, `resendOtp`
- Redux: `state.user.email` (email đang chờ verify), `state.user.isForgotPassword` (chọn nhánh)
- Endpoints: `POST /users/otp/authenticate`, `POST /users/password/forgot/authenticate`, `POST /users/otp/revalidate`

### 4. Input & Output

**Input:** `otpString` = 6 ký tự từ 6 `<input>`; `email` từ Redux.

**Output:** thành công → toast + điều hướng. Thất bại → `toast.error(getApiErrorMessage(error, "Mã OTP không đúng"))`.

**Missing data:** nếu `VITE_OTP_LENGTH` không có trong env → `Number(undefined)` = `NaN` → `otpString.length === NaN` luôn `false` → **không bao giờ gửi được**. Đây là điểm cần chú ý khi setup môi trường.

**Error:** `toast.warn("Please enter all characters of otp string")` khi thiếu ký tự.

### 5. Step-by-step

1. `OTP` là `string[]` 6 phần tử rỗng; mỗi `<input>` `maxLength={1}`.
2. `handleTextChange`: chỉ nhận số (`isNaN(parseInt(input, 10))` → clear), set giá trị, focus ô kế tiếp.
3. `handleKeyDown`: `Backspace` → xoá ô hiện tại, focus ô trước nếu cần.
4. `handlePaste`: hỗ trợ dán chuỗi 6 số (`/^\d{6}$/`).
5. `Countdown` (antd `Statistic.Countdown`) đếm ngược 5 phút, lưu `remainingTime` vào localStorage để giữ qua reload.
6. `isForgotPassword` trong Redux quyết định gọi endpoint nào — cùng một UI phục vụ 2 flow.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Submit không phản hồi | `VITE_OTP_LENGTH` thiếu / sai | Set `VITE_OTP_LENGTH=6` |
| `inputRef.current[index + 1]` undefined | `ref` chưa mount xong khi focus ngay | Guard `?.focus()` |
| Gửi lại OTP không hoạt động | `state.user.email` null (đã reload trang, Redux persist có email nhưng nếu flow khác thì null) | Đảm bảo `setEmailResendOTP` được dispatch trước khi navigate |

### 7. Interview questions

**Q: Vì sao dùng `useRef` cho mảng input thay vì `useState`?**
A: `useRef` không gây re-render. Ta cần DOM node để gọi `.focus()`, không cần giá trị trong render. Nếu dùng `useState` chứa DOM node sẽ tốn render vô nghĩa.

**Q: `isNaN(parseInt(input, 10))` — tại sao dùng `parseInt`?**
A: `parseInt("12abc")` = `12` → không phải NaN → vẫn nhận "12abc" vào ô 1 ký tự nhưng `maxLength=1` chặn. `parseInt` cũng xử lý `""` → NaN → clear ô. Kết hợp với `maxLength={1}` và `inputMode="numeric"` là đủ.

---

## 4. Authentication — Forgot / Reset Password

### 1. Purpose

Khôi phục mật khẩu khi user quên.

### 2. Execution flow

```
ForgotPassword:
  User nhập email → Submit
    → forgotPassword(email) → POST /users/password/forgot { email }
      → backend gửi mã qua email → navigate("/verification")

Verification (nhánh forgot):
    → authenticateForgotPassword(code) → POST /users/password/forgot/authenticate { code }
      → navigate("/new-password")

NewPassword:
  User nhập mật khẩu mới → Submit
    → resetPassword({ email, password, confirm_password })
      → POST /users/password/reset
        → navigate("/login")
```

### 3. Source code references

- `src/container/Auth/pages/ForgotPassword/ForgotPassword.tsx`
- `src/container/Auth/pages/NewPassword/NewPassword.tsx`
- `src/container/Auth/pages/Verification/Verification.tsx`
- `src/apis/index.ts` → `forgotPassword`, `resetPassword`, `authenticateForgotPassword`

### 4. Input & Output

**Input:** email (forgot) / `{ email, password, confirm_password }` (reset).

**Output:** toast message từ `response.message`; điều hướng tương ứng.

**Missing data:** `NewPassword` cần `email` — lấy từ `state.user.email` trong Redux. Nếu user mở thẳng `/new-password` mà Redux rỗng → email rỗng → backend trả lỗi validation. *Đây là điểm yếu: nên truyền email qua query string hoặc sessionStorage.*

**Error:** `toast.error(getApiErrorMessage(error, ...))`.

### 5. Step-by-step

1. `ForgotPassword` dispatch `setEmailResendOTP(email)` **trước** khi navigate → `Verification` đọc được email để resend.
2. `setIsFogotPassword(true)` báo cho `Verification` biết dùng endpoint nào.
3. `NewPassword` đọc `state.user.email` để gửi kèm `reset`.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Verify gọi nhầm endpoint | `isForgotPassword` không được set | Dispatch `setIsFogotPassword(true)` ở ForgotPassword |
| Reset báo thiếu email | Mở thẳng `/new-password` | Lưu email vào sessionStorage khi verify |

### 7. Interview questions

**Q: Vì sao tách "forgot authenticate" và "otp authenticate" thành 2 endpoint?**
A: Chúng thuộc 2 domain khác nhau — xác thực tài khoản (đăng ký) và xác thực yêu cầu đặt lại mật khẩu. Backend có thể dùng 2 bảng token khác nhau với TTL và mục đích khác nhau → tách bạch giảm rủi ro bảo mật.

---

## 5. Authentication — Change Password

### 1. Purpose

Đổi mật khẩu khi đã đăng nhập.

### 2. Execution flow

```
User điền 3 field → Submit
  → changepassWordSubmit(value)     ChangePassword.tsx
    → changePasswordApi({ old_password, password, confirm_password })
      → POST /users/password/change
        ← { statusCode, message }
    → toast.success(message)
```

### 3. Source code references

- `src/container/Auth/pages/ChangePassword/ChangePassword.tsx`
- `src/apis/index.ts` → `changePassword`
- Endpoint: `POST /users/password/change` (cần Bearer token)

### 4. Input & Output

**Input:** `{ old_password, password, confirm_password }`.

**Output:** toast message; lỗi → `toast.error(getApiErrorMessage(error, "Lỗi đổi mật khẩu"))`.

**Error thường gặp:** 400 với `errors.old_password.msg = "Incorrect old password."` hoặc `errors.password.msg = "Password and confirm password do not match."`.

### 5. Step-by-step

1. Cần `old_password` để xác minh chủ sở hữu — bảo mật chống đổi mật khẩu khi máy bị chiếm.
2. `confirm_password` chống gõ sai.
3. Không tự xử lý validate trùng khớp — backend đã validate, trả message tiếng Anh.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| 401 | Token hết hạn → interceptor refresh rồi retry | Tự động xử lý |
| Báo "Password and confirm password do not match" | Người dùng nhập lệch | Hiển thị message backend |

### 7. Interview questions

**Q: Vì sao cần `old_password` khi đã có access token?**
A: Access token chứng minh *phiên đang đăng nhập*, `old_password` chứng minh *người đang thao tác là chủ tài khoản*. Nếu token bị lộ (XSS, cài nhầm extension), attacker có thể đổi mật khẩu và chiếm đoạt tài khoản vĩnh viễn. Yêu cầu mật khẩu cũ là lớp phòng thủ thứ hai.

---

## 6. Authentication — Logout

### 1. Purpose

Kết thúc phiên, vô hiệu refresh token trên server.

### 2. Execution flow

```
User click "Logout" trong dropdown avatar
  → logout()                       src/components/HeaderItem/HeaderItem.tsx
    → getCookie(REFRESH_TOKEN)
    → logoutApi(refreshToken) → POST /users/logout { refresh_token }
      → backend xoá/đánh dấu vô hiệu refresh token
    → clearTokens()                 // xoá localStorage ACCESS_TOKEN + cookie REFRESH_TOKEN
    → dispatch(setAuthenticationStatus(false))
    → toast.success("Đăng xuất thành công")
```

### 3. Source code references

- `src/components/HeaderItem/HeaderItem.tsx` → `logout()`
- `src/apis/index.ts` → `logout`
- `src/utils/interceptors.tsx` → `clearTokens`
- Endpoint: `POST /users/logout`

### 4. Input & Output

**Input:** `refresh_token` từ cookie.

**Output:** toast success/error; state `isAuthenticated = false`.

**Error:** nếu API lỗi → `catch` vẫn gọi `clearTokens()` + `setAuthenticationStatus(false)` → user vẫn được đăng xuất cục bộ (đúng UX), đồng thời hiện toast lỗi.

### 5. Step-by-step

1. Gọi API logout **trước** khi xoá token cục bộ — cần refresh token còn hợp lệ.
2. `clearTokens()` xoá cả hai.
3. `try/catch` tách bạch: lỗi server không chặn việc đăng xuất cục bộ.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Token vẫn còn sau logout | Quên `clearTokens()` | Đã có trong code |
| Đăng xuất xong vẫn thấy avatar | `state.user.profile` chưa clear | Nên dispatch `setprofile(null)` |
| Sau reload lại vào trang đăng nhập | `redux-persist` rehydrate `isAuthenticated: true` | Cần `persistor.purge()` khi logout |

### 7. Interview questions

**Q: Vì sao logout cần gọi API thay vì chỉ xoá token cục bộ?**
A: Vì refresh token vẫn còn hiệu lực trên server. Nếu chỉ xoá ở client, attacker có refresh token là dùng lại được. Gọi `POST /users/logout` để backend vô hiệu hoá refresh token trên server — đây là **server-side session invalidation**.

---

## 7. Header & Avatar

### 1. Purpose

Hiển thị navigation, badge giỏ hàng, avatar, menu tài khoản; đồng thời là nơi duy nhất fetch profile để lấy avatar.

### 2. Execution flow

```
HeaderItem mount
  → useEffect(() => fetchAvatar(), [])
    → getMyProfile() → GET /users/@me/profile (Bearer token)
      → normalizeProfile(data)   // full_name→fullName, avatar→avatarUrl, thumbnail→coverPhoto
      → dispatch(setprofile(response.data))
  → render <Avatar src={isprofile?.avatarUrl} />
  → nếu isAuthenticated → <Badge count={cartnumber}> + menu dropdown
```

### 3. Source code references

- `src/components/HeaderItem/HeaderItem.tsx`
- `src/apis/index.ts` → `getMyProfile`
- `src/utils/api.adapter.ts` → `normalizeProfile`
- Endpoint: `GET /users/@me/profile`

### 4. Input & Output

**Input:** access token (tự động gắn qua interceptor).

**Output:** `state.user.profile` — shape đã normalize:
```
{ _id, email, fullName, avatarUrl, coverPhoto, address, gender, phone, role, ... }
```

**Missing data:** nếu chưa đăng nhập → API trả 401 → interceptor refresh fail → `window.location.href = "/login"`. **Đây là hành vi có vấn đề**: user chưa đăng nhập vào trang chủ cũng bị đáy `/login`. *Do API 401 vì header không có token → interceptor coi như token hết hạn.*

**Error:** `console.log("Error fetching avatar:", error)`.

### 5. Step-by-step

1. Header nằm trên mọi page → fetch profile 1 lần khi mount.
2. `normalizeProfile` tạo alias camelCase để JSX không phải đọc `full_name`.
3. `isAuthenticated` quyết định hiện nút Login/Register hay avatar + badge.
4. `cartnumber` từ Redux, được set bởi `CartProduct.tsx` / `Cart.tsx` / `Payment.tsx` sau khi gọi `getCart()`.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Khách chưa đăng nhập bị redirect `/login` | 401 từ `/users/@me/profile` bị interceptor xử lý như token hết hạn | Chỉ gọi `getMyProfile()` khi `isAuthenticated === true` |
| Avatar không hiện | API dùng `avatar`, component đọc `avatarUrl` | Đã sửa qua `normalizeProfile` |
| Tên hiện trống | Component đọc `isprofile?.username` nhưng API trả `full_name` | Đổi sang `isprofile?.fullName` hoặc `email` |
| Badge giỏ luôn 0 | `setcartnumber` chỉ chạy sau `getCart()` | Kiểm tra token hợp lệ |

### 7. Interview questions

**Q: Tại sao dùng `useEffect` với `[]` thay vì gọi trực tiếp trong render?**
A: Fetch trong render sẽ chạy mỗi lần re-render → vòng lặp vô hạn + side-effect trong render (React StrictMode gọi render 2 lần). `useEffect` chạy sau commit, 1 lần khi mount.

---

## 8. Danh sách sản phẩm (Home)

### 1. Purpose

Hiển thị sản phẩm nổi bật + thanh filter category trên trang chủ.

### 2. Execution flow

```
CartProduct mount
  → useEffect([query])       → query = searchParams.get("category")
    → query ? getProductsByCategory(query) : getProducts()
      → GET /products  hoặc  GET /products/categories/:categoryId
        → normalizeProducts(data)   // attributes→productAttributes, price derived
        → dispatch(setProduct(data))
  → useEffect([]) → getCategories() → GET /categories → dispatch(setCategory(...))
  → useEffect([]) → getCart() → dispatch(setcartnumber(items.length))
  → render filterProduct = product.length > 5 ? product.slice(0,8) : product
```

### 3. Source code references

- `src/components/CartProducts/CartProduct.tsx`
- `src/apis/index.ts` → `getProducts`, `getProductsByCategory`, `getCategories`, `getCart`, `addToCart`
- `src/utils/api.adapter.ts` → `normalizeProducts`
- Endpoints: `GET /products`, `GET /products/categories/:categoryId`, `GET /categories`, `GET /carts`, `POST /carts/items`

### 4. Input & Output

**Input:** query param `?category=<id>`; product id khi bấm "Add to card".

**Output:** `state.user.product` (đã normalize), `state.user.category`, `state.user.cartnumber`.

**Missing data:** sản phẩm không có `productAttributes` → `buttonAdd` toast lỗi "Sản phẩm không có thuộc tính để thêm vào giỏ hàng" và **return sớm** (không gọi API).

**Error:** `catch` → `console.log(error)` — hiện tại **không có toast lỗi** cho load danh sách.

### 5. Step-by-step

1. `useSearchParams()` đọc `?category=` — filter nằm trong URL ⇒ có thể share link & F5 vẫn giữ filter.
2. `useEffect(..., [query])` → đổi category sẽ refetch.
3. `getCategories()` gọi 1 lần khi mount (danh mục ít thay đổi).
4. `getCart()` gọi 1 lần để set badge — nhưng lưu ý: **gọi cả khi chưa đăng nhập** → 401 → redirect. *Xem "Common bugs".*
5. `buttonAdd`: tìm product trong list → lấy `productAttributes[0]._id` → `POST /carts/items` với `{ items: [{ product_id, product_attribute_id, quantity: 1 }] }` → refetch cart → set badge → toast success.

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Sửa |
|------|-------------|----------------|-----|
| 400 khi add to cart | Thiếu `product_attribute_id` | Payload trong Network tab | Đã sửa |
| 401 khi load trang chưa đăng nhập | `getCart()` gọi vô điều kiện | Network tab thấy `GET /carts` 401 | Chỉ gọi khi `isAuthenticated` |
| `product.price` undefined | `sold` = 0, attributes rỗng | Console log product | `normalizeProduct` đã fallback |
| Category filter không đổi | Thiếu `query` trong deps | React DevTools → deps | Đã có `[query]` |
| Filter "Price"/"Additional" không hoạt động | Chỉ là UI tĩnh | — | Cần endpoint lọc (backend chưa có) |

### 7. Interview questions

**Q: Vì sao đặt filter category trong query string thay vì state?**
A: URL là nguồn sự thật duy nhất (single source of truth). Share link giữ đúng filter, F5 không mất, hỗ trợ nút Back của browser. Dùng `useSearchParams` của React Router v6 thay vì tự đọc `window.location`.

**Q: `product.length > 5 ? product.slice(0, 8) : product` — tại sao viết vậy?**
A: Hiển thị tối đa 8 sản phẩm, nhưng nếu danh sách ≤ 5 thì hiển thị hết (tránh trang trắng khi backend trả ít dữ liệu). Đây là logic UI tĩnh, không phải phân trang thật.

---

## 9. Danh sách sản phẩm (Shop) + Lọc theo category

### 1. Purpose

Trang shop: lưới sản phẩm + sidebar filter/tìm kiếm.

### 2. Execution flow

```
Shop mount
  → <Cart /> (components/Cart/Cart.tsx) render grid từ state.user.product
  → <Categories /> sidebar
    → input change → handleSeachChange
      → setSearchParams({ keyword })      // đồng bộ URL
      → searchProducts(keywords) → POST /products/search?keyword=...
        → dispatch(setProduct(data))
```

### 3. Source code references

- `src/container/Shop/Page/Shop.tsx`
- `src/components/Cart/Cart.tsx`
- `src/components/Categories/Categories.tsx`
- `src/apis/index.ts` → `searchProducts`
- Endpoints: `POST /products/search?keyword=`, `GET /products`

### 4. Input & Output

**Input:** từ khoá (`event.target.value`).

**Output:** `state.user.product` được thay bằng kết quả search; URL có `?keyword=`.

**Missing data:** search không có kết quả → `setProduct([])` → grid rỗng (không có empty state riêng).

**Error:** `catch` → `console.log(error)`.

### 5. Step-by-step

1. `Shop` chỉ là layout; `Cart` đọc `state.user.product` đã có sẵn từ `CartProduct` ở Home (cùng store).
2. `handleSeachChange` gọi API **mỗi lần gõ** — không debounce. Với keyword ngắn sẽ tạo nhiều request.
3. `setSearchParams` đồng bộ URL để có thể share.
4. `Categories` còn 3 khối UI chưa nối API: Price range, Additional radio, Categories list (list được tính từ `state.user.product` hiện tại nên **thay đổi theo kết quả search** — đây là hành vi hơi lạ).

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Gõ 1 ký tự → 5 request | Không debounce | Thêm debounce 300ms |
| Category list đổi theo search | Tính từ `state.user.product` hiện tại | Nên dùng `state.user.category` |
| Search trả `[]` → trang trắng | Không có empty state | Render message "Không tìm thấy sản phẩm" |
| `useEffect` gọi trong handler | Đã được loại bỏ (bug cũ) | Đã sửa trong commit này |

### 7. Interview questions

**Q: Tại sao cần debounce cho ô tìm kiếm?**
A: Mỗi keystroke gọi API → nhiều request thừa, tốn bandwidth và server, response về không đúng thứ tự (race condition). Debounce 300–500ms gom các keystroke liên tiếp thành 1 request. Xem thêm `docs/05-optimization.md` § Debouncing.

**Q: Race condition khi search ra sao?**
A: Gõ "a" (request 1, chậm) rồi "ab" (request 2, nhanh) → request 2 về trước, hiển thị kết quả "ab", sau đó request 1 về sau và ghi đè → hiển thị sai. Cách xử lý: `AbortController` huỷ request cũ, hoặc so sánh sequence number trước khi set state.

---

## 10. Chi tiết sản phẩm

### 1. Purpose

Hiển thị đầy đủ 1 sản phẩm: ảnh, tên, category, mô tả, bảng thuộc tính, tab mô tả/reviews, nút thêm giỏ.

### 2. Execution flow

```
User mở /product/:productId
  → useParams() → productId
  → useEffect([productId]) → getProductById(productId)
    → GET /products/:id
      → normalizeProduct(data)  // API trả "attribute" (số ít) → productAttributes[]
      → dispatch(setProduct([data]))
  → const detail = product.find(p => p._id === productId)
  → render: thumbnail_url, name, category.name, description, productAttributes.map(...)
  → "Add to cart" → buttonAdd(detail._id)
```

### 3. Source code references

- `src/container/Detail/page/ProductDetail/ProductDetail.tsx`
- `src/apis/index.ts` → `getProductById`, `addToCart`, `getCart`
- `src/utils/api.adapter.ts` → `normalizeProduct`
- Endpoint: `GET /products/:id`

### 4. Input & Output

**Input:** `productId` từ URL param.

**Output:** render chi tiết; `state.user.product` = `[detail]`.

**Missing data:** `detail === undefined` → `navigate("*")` → trang 404. Nhưng điều này xảy ra **trong lúc fetch đang chạy** → màn hình nháy 404 rồi về lại detail. *Nên dùng state `loading`.*

**Error:** fetch lỗi → `console.log(error)` → `detail` undefined → navigate 404.

### 5. Step-by-step

1. **Điểm mấu chốt:** trước đây component chỉ đọc `state.user.product` (do Home fill). Mở deep-link `/product/xxx` → store rỗng → 404. Đã sửa bằng cách gọi API trực tiếp trong `useEffect`.
2. `GET /products/:id` trả `attribute` (object đơn) — khác với list endpoint trả `attributes` (array). `normalizeProduct` xử lý cả hai: `product.attributes ?? product.attribute` rồi bọc thành array.
3. `buttonAdd` lấy `detail.productAttributes[0]._id` → `POST /carts/items`.
4. `detail.productAttributes.map(...)` render **một nút Add to cart cho mỗi attribute** — nhưng `onClick` luôn truyền `detail._id` (không truyền `attr._id`). *Đây là bug logic: nút thứ 2 vẫn thêm attribute đầu tiên.*

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Sửa |
|------|-------------|----------------|-----|
| Deep-link → 404 | Store rỗng, không fetch | Mở F5 trên URL product | Đã sửa: thêm `useEffect` gọi `getProductById` |
| Nháy trang 404 khi load | `navigate("*")` khi `detail` chưa có | Quay video mở trang | Thêm state loading |
| `detail.productAttributes` undefined → crash | API trả product không có attribute | Console error | Guard `detail?.productAttributes?.map` |
| Nút Add to cart thêm nhầm attribute | `onClick={() => buttonAdd(detail._id)}` | Click nút thứ 2 | Truyền `attr._id` |
| `navigate()` trong render | Side-effect trong render | React StrictMode double render | Dùng `<Navigate>` |

### 7. Interview questions

**Q: Vì sao cần adapter khi list trả `attributes` (mảng) mà detail trả `attribute` (object)?**
A: Vì component nên đọc **một** tên field duy nhất (`productAttributes`) để không phải rẽ nhánh ở mọi nơi. Adapter gom việc dịch shape về 1 chỗ → khi backend đổi, chỉ sửa adapter. Đây chính là lý do tồn tại của `api.adapter.ts`.

**Q: `navigate()` trong render có phải anti-pattern không?**
A: Có. Render phải là hàm thuần khiết quả. `navigate` là side-effect. React StrictMode gọi render 2 lần → navigate 2 lần. Cách đúng: render `<Navigate to="*" replace />` (React Router v6.4+) hoặc `useEffect` điều hướng.

---

## 11. Tìm kiếm sản phẩm

Xem [Feature 9](#9-danh-sách-sản-phẩm-shop--lọc-theo-category) — cùng một luồng.

**Bổ sung:**
- `searchProducts(keyword)` dùng `encodeURIComponent(keyword)` → an toàn với ký tự đặc biệt (`&`, `#`, space).
- Method là **POST** chứ không phải GET (đúng theo API).
- Body rỗng `{}`, keyword nằm trong query string.

---

## 12. Giỏ hàng

### 1. Purpose

Quản lý giỏ: thêm, xem, cập nhật số lượng, xoá.

### 2. Execution flow

**Thêm:**
```
User bấm "Add to cart"
  → buttonAdd(product_id)                    Cart.tsx / CartProduct.tsx / ProductDetail.tsx
    → tìm product trong state.user.product
    → attributeId = target?.productAttributes?.[0]?._id
      → không có → toast.error + return
    → addToCart({ items: [{ product_id, product_attribute_id: attributeId, quantity: 1 }] })
      → POST /carts/items
        ← { statusCode, message, data: { _id, total_price, carts: [...] } }
    → getCart() → GET /carts
      → normalizeCart(data)  // carts[] → items[], productDetails → product_id
      → dispatch(setcartnumber(items.length))
    → toast.success("add product successfully")
```

**Xem / cập nhật / xoá (trang Payment):**
```
Payment mount → getCart() → dispatch(setCart(list)) + setcartnumber(items.length)
  quantities state đồng bộ từ renderlist (useEffect [renderlist])
  [+] → handleIncrement(productId) → setQuantities(prev => ({...prev, [id]: prev[id]+1}))
  [-] → handleDecrement → Math.max(prev-1, 1)
  Save → updateCartItems(cart._id, { items: [...] }) → PUT /carts/items/:cartId
  X    → removeCartItem(cartId, product_id) → DELETE /carts/items/:cartId?product_id=...
```

### 3. Source code references

| Thứ | Đường dẫn |
|-----|-----------|
| Thêm | `src/components/Cart/Cart.tsx`, `src/components/CartProducts/CartProduct.tsx`, `src/container/Detail/page/ProductDetail/ProductDetail.tsx` |
| Giỏ & thanh toán | `src/container/Payment/Payment.tsx` |
| API | `src/apis/index.ts` → `getCart`, `addToCart`, `updateCartItems`, `removeCartItem` |
| Adapter | `src/utils/api.adapter.ts` → `normalizeCart` |
| Types | `src/@type/global.type.ts` → `cartTypes`, `cartItemType` |
| Endpoints | `GET /carts`, `POST /carts/items`, `PUT /carts/items/:cartId`, `DELETE /carts/items/:cartId?product_id=` |

### 4. Input & Output

**Input thêm:** `{ items: [{ product_id, product_attribute_id, quantity }] }`.

**Input xoá:** `cartId` + `product_id` (query string).

**Output:**
- `state.user.cart` — shape đã normalize:
```
{ _id, total_price, items: [{ product_id: {...product}, productAttributeId, quantity, price }] }
```
- `state.user.cartnumber` — số item trong giỏ.

**Missing data:** nếu `normalizeCart` không tìm thấy `carts` → `items = []` → `items.length = 0` → badge 0, bảng trống. An toàn (không crash).

**Error:** `toast.error(getApiErrorMessage(error, "Lỗi cập nhật giỏ hàng"))` ở Payment; `console.log` ở các component khác.

### 5. Step-by-step

1. **Contract API bắt buộc `product_attribute_id`.** Backend dùng giá theo attribute, nên `product_id` alone bị 400.
2. `getCart()` sau mỗi mutation để đồng bộ badge — 2 request thay vì 1 nhưng đơn giản & chắc chắn đúng.
3. `normalizeCart` map `productDetails` → `product_id` và `productAttributeId`/`product_attribute_id` → `productAttributeId`.
4. `quantities` là state cục bộ (chỉ là con trỏ UI). Nút Save mới đẩy lên server → tránh ghi đúng mỗi lần bấm `+`.
5. `handleDecrement` dùng `Math.max(x - 1, 1)` → không cho về 0 (0 nghĩa là xoá, phải bấm X).

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Sửa |
|------|-------------|----------------|-----|
| 400 khi thêm | Thiếu `product_attribute_id` | Payload Network tab | Đã sửa |
| Badge = 0 dù giỏ có hàng | `items.length` đọc sai field | Log `state.user.cart` | Adapter map `carts`→`items` |
| Số lượng không đồng bộ | `quantities` khởi tạo từ `renderlist` trong `useEffect` | Đổi tab rồi quay lại | `useEffect([renderlist])` đã có |
| Xoá xong giỏ không đổi | Không refetch | — | `fetchCart()` sau `removeCartItem` |
| `product_id` trong `Payment` là object, dùng như string | — | — | Adapter đã map đúng |

### 7. Interview questions

**Q: Vì sao số lượng không gửi lên server ngay mỗi lần bấm `+`?**
A: Mỗi lần bấm là 1 HTTP request (độ trễ, tốn tài nguyên, nhiều khi bấm liên tục). Giữ state cục bộ rồi gửi 1 lần khi bấm "Save" là pattern **optimistic local state + explicit commit** — UX tốt hơn, giảm tải server.

**Q: `normalizeCart` giải quyết vấn đề gì?**
A: Backend trả `{ total_price, carts: [{ productDetails, productAttributeId, quantity, price }] }`, UI đọc `{ items: [{ product_id, productAttributeId, quantity, price }] }`. Adapter map 1-1 để JSX giữ nguyên.

**Q: `Math.max(qty - 1, 1)` thay vì cho về 0 — lý do?**
A: 0 nghĩa là "xoá khỏi giỏ" trong nhiều API, gây nhầm lẫn cho user. Giữ tối thiểu 1 và dùng nút X riêng cho xoá là UX rõ ràng.

---

## 13. Thanh toán / Tạo đơn hàng

### 1. Purpose

Hoàn tất đơn hàng: nhập địa chỉ, số điện thoại, phương thức thanh toán, ghi chú → tạo order.

### 2. Execution flow

```
User bấm "Proceed Checkout"
  → showModal() → setOpen(true) → <Modal> với <Form onFinish={order}>
  → User submit
    → order(value)
      → kiểm tra listcard && renderlist && renderlist.length > 0  (giỏ rỗng → toast.error)
      → createOrder({
           product_attribute_ids: renderlist.map(i => i.productAttributeId ?? ""),
           payment_method: value.payment,
           address: value.address,
           phone: value.Phone,
           note: value.note
         })
        → POST /orders
          ← { statusCode, message, data }
      → setOpen(false)
      → toast.success(response.message || "Payment success")
      → await fetchCart()   // giờ giỏ đã trống
```

### 3. Source code references

- `src/container/Payment/Payment.tsx` → `order`, `updateCart`, `deletecart`, `fetchCart`
- `src/apis/index.ts` → `createOrder`, `getCart`, `updateCartItems`, `removeCartItem`
- Endpoint: `POST /orders`

### 4. Input & Output

**Input:**
```
{
  product_attribute_ids: string[],   // lấy từ cart items
  address: string,
  phone: string,
  payment_method: string,
  note?: string
}
```

**Output:** toast success + đóng modal + refetch giỏ (trống).

**Missing data:** giỏ rỗng → `toast.error("Giỏ hàng đang trống")` và return. Item thiếu `productAttributeId` → gửi `""` → backend có thể 400 → hiện message lỗi.

**Error:** `toast.error(getApiErrorMessage(error, "Lỗi thanh toán"))`.

### 5. Step-by-step

1. **Backend nhận `product_attribute_ids`, không nhận `product_id`** → phải map đúng. Đây là lý do adapter expose `productAttributeId`.
2. Guard giỏ rỗng trước khi gọi API → tránh tạo order rỗng.
3. `await fetchCart()` sau khi tạo order → backend đã xoá các item đã order khỏi giỏ, cần đồng bộ UI.
4. Form field `payment` và `Phone` dùng `name` khác casing (`payment` vs `phone`) → `value.Phone` khớp với `name="Phone"`.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| 400 khi checkout | Sai tên field (`product_attribute_ids` / `product_id`) | Đã sửa theo API |
| Giỏ không trống sau order | Không refetch | `await fetchCart()` |
| Đơn tạo với `product_attribute_ids: [""]` | `productAttributeId` undefined | Guard filter(Boolean) |
| Modal không đóng khi lỗi | `setOpen(false)` chỉ trong try | Hiện tại giữ modal mở để user sửa — hợp lý |

### 7. Interview questions

**Q: Tại sao `POST /orders` dùng `product_attribute_ids` thay vì `product_ids`?**
A: Vì giá và tồn kho của sản phẩm được định nghĩa ở cấp **attribute** (biến thể: 1kg, 2kg, thùng…). Giá trong giỏ được chốt theo attribute. Đặt hàng theo attribute đảm bảo tính đúng giá đã chốt.

**Q: Nếu request order bị timeout nhưng server đã tạo đơn?**
A: Đây là bài toán idempotency. Cách xử lý chuẩn: gửi `Idempotency-Key` header (UUID) để server nhận diện request trùng và trả lại kết quả cũ thay vì tạo mới. Ngoài ra nên có màn hình "Đơn hàng gần đây" để user tự kiểm tra.

---

## 14. Hồ sơ cá nhân

### 1. Purpose

Xem và cập nhật thông tin cá nhân.

### 2. Execution flow

```
MainProfile mount
  → useEffect: nếu !isAuthenticated → navigate("/login")
  → useEffect([]) → getMyProfile() → GET /users/@me/profile
    → normalizeProfile → setUserData({ email, fullName, phone, address, avatar, cover_photo, gender })
  → <Form fields={[...]} value={userData.xxx}>
  → User submit
    → onFinish(value)
      → updateMyProfile({
           full_name: value.full_name || userData.fullName,
           phone: value.phone || userData.phone,
           gender: userData.gender || "Male",
           avatar: userData.avatar,
           thumbnail: userData.cover_photo,
           address: value.address
         })
        → PUT /users/@me/profile
      → toast.update(loadingToast, { render: response.message, type: "success" })
```

### 3. Source code references

- `src/container/Profile/Page/MainProfile.tsx`
- `src/apis/index.ts` → `getMyProfile`, `updateMyProfile`
- `src/utils/api.adapter.ts` → `normalizeProfile`
- `src/@type/user.type.ts` → `updateProfilePayloadType`
- Endpoint: `GET` / `PUT /users/@me/profile`

### 4. Input & Output

**Input (PUT):** `{ full_name, phone, gender, avatar, thumbnail, address }` — **snake_case** vì API dùng snake_case.

**Output:** toast loading → update thành success/error.

**Missing data:** `value.full_name || userData.fullName` → fallback về giá trị đã load, tránh ghi đè bằng `undefined`.

**Error:** `toast.update(loadingToast, { render: getApiErrorMessage(error, "Lỗi cập nhật hồ sơ"), type: "error" })`.

### 5. Step-by-step

1. `useState` `userData` giữ bản sao cục bộ để Ant Design `fields` (controlled fields) hiển thị đúng.
2. `getMyProfile` trả `full_name` → adapter tạo `fullName` → map sang state `fullName` → form field `full_name` nhận giá trị này.
3. Khi PUT, `full_name` gửi lại dạng snake_case → khớp API.
4. `toast.loading` + `toast.update` cho UX tốt (giữ 1 toast id).

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Sửa |
|------|-------------|----------------|-----|
| Form trống | `getMyProfile` 401 → catch chỉ `console.log` | Network tab | Check token |
| Gửi `fullName` thay vì `full_name` | Dùng nhầm tên | Payload Network tab | Đã sửa theo API |
| Avatar/cover không đổi | `avatar`/`thumbnail` không upload được (input type=file bị ẩn, không có handler upload) | — | Cần endpoint upload — **backend chưa có** |
| `initialValues` không cập nhật | Ant Design chỉ đọc `initialValues` lần đầu | — | Dùng `fields` (đã dùng) |

### 7. Interview questions

**Q: Vì sao form field tên `full_name` (snake_case) mà React nên dùng camelCase?**
A: Ở đây form được bind trực tiếp với payload API (backend dùng snake_case), nên giữ nguyên giúp map đơn giản và tránh lỗi. Nếu form phức tạp hơn, nên dùng state camelCase và map sang snake_case khi gọi API (như `onFinish` đang làm fallback).

**Q: `toast.loading` + `toast.update` có khác gì `toast.success`?**
A: `toast.loading` tạo 1 toast với id; `toast.update(id, {...})` cập nhật chính toast đó thay vì tạo toast mới. Giữ đúng 1 notification, trải nghiệm mượt hơn.

---

## 15. Sản phẩm yêu thích

### 1. Purpose

Hiển thị danh sách sản phẩm user đã like.

### 2. Execution flow

```
Myfavorite mount
  → useEffect([]) → getFavoriteProducts() → GET /users/products/favorites
    → dispatch(setfavorite(response.data))
  → render table: thumbnail_url, name, origin
```

### 3. Source code references

- `src/components/Myfavorite/Myfavorite.tsx`
- `src/apis/index.ts` → `getFavoriteProducts`, `likeProduct`, `unlikeProduct`
- Endpoint: `GET /users/products/favorites`, `POST /products/:id/like`, `POST /products/:id/unlike`

### 4. Input & Output

**Input:** Bearer token.

**Output:** `state.user.favorite` — mảng `FavoriteType[]`.

**Missing data:** `getFavoriteProducts` đã guard `Array.isArray(payload.data) ? payload.data : []` → không bao giờ `undefined`.

**Error:** `console.log(error)` → bảng trống.

### 5. Step-by-step

1. `likeProduct`/`unlikeProduct` đã có helper nhưng **chưa được gọi từ UI nào** — `ButtonLike` component tồn tại (`src/components/ButtonLike/ButtonLike.tsx`) nhưng không được gắn vào sản phẩm. *Đây là khoảng trống chức năng đáng lưu ý.*
2. Menu item "My favorite product" trong `HeaderItem.tsx` đang bị **comment out** → route `/myfavorite` không reachable từ UI.

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Trang không mở được | Menu header bị comment | Bỏ comment menu item |
| Like không cập nhật UI | Chưa gọi API | Gọi `likeProduct` trong `ButtonLike` onClick |
| Bảng trống khi 401 | catch chỉ log | Thêm toast |

### 7. Interview questions

**Q: Like/unlike nên là optimistic update hay pessimistic?**
A: Optimistic (cập nhật UI ngay, rollback nếu API lỗi) cho trải nghiệm tốt vì thao tác đơn giản, độ trễ thấp. Pessimistic (chờ API) cho thao tác phức tạp, cần chờ server xác nhận (thanh toán).

---

## 16. Quản trị sản phẩm (Admin)

### 1. Purpose

Admin xem danh sách sản phẩm và xoá.

### 2. Execution flow

```
Admin mount
  → useEffect([]) → getMyProfile() → GET /users/@me/profile
    → dispatch(setAdminStatus(response.data?.role === "Admin"))
  → useEffect([]) → getProducts() → GET /products → dispatch(setProduct(...))
  → if (isadmin === false) → navigate("*")
  → render <Table columns dataSource={extendedList} />
  → click "Delete" → deleteProductById(product._id)
    → deleteProduct(id) → DELETE /products?id=<id>
    → fetchPRODUCT()   // refetch danh sách
```

### 3. Source code references

- `src/container/Admin/page/Admin.tsx`
- `src/container/Admin/page/ProductAdmin/ProductAdmin.tsx` (bảng tương tự + cột ảnh + link edit)
- `src/apis/index.ts` → `getMyProfile`, `getProducts`, `deleteProduct`, `getSuppliers`
- Endpoints: `GET /users/@me/profile`, `GET /products`, `DELETE /products?id=`, `GET /suppliers`

### 4. Input & Output

**Input:** product `_id`.

**Output:** `state.user.product` + `state.user.isAdmin`.

**Missing data:** `deleteProduct` không có → `fetchPRODUCT()` refetch vẫn chạy (không crash).

**Error:** `catch` → `console.log(error)` — **không có toast cho người dùng**.

### 5. Step-by-step

1. `profile()` gọi API thật để xác định role (không hardcode).
2. `extendedList` = `list.map((obj, index) => ({ ...obj, key: \`key-${index}\` }))` — Ant Design Table cần `key` cho mỗi row.
3. `DELETE /products?id=` dùng **query string** chứ không phải path param — đúng theo API.
4. `ProductAdmin.tsx` gọi `getSuppliers()` trong `useEffect` (trước đây gọi trong render body → **vòng lặp request vô hạn**, đã sửa).

### 6. Common bugs

| Lỗi | Nguyên nhân | Cách phát hiện | Sửa |
|------|-------------|----------------|-----|
| `getSuppliers()` gọi liên tục | Gọi trong render body → dispatch → re-render → gọi lại | Network tab thấy hàng loạt request | Đã sửa: bọc `useEffect` |
| Admin thấy trang 404 khi chưa load xong | `isadmin` mặc định `false` → `navigate("*")` ngay | Mở `/admin` | Render loading cho tới khi profile về |
| Xoá không có phản hồi | chỉ `console.log` | — | Thêm toast |
| `key={index}` trong Table | Không ổn định khi sort | — | Dùng `product._id` |

### 7. Interview questions

**Q: Vì sao check role bằng API thay vì so sánh email?**
A: Role là thuộc tính do backend quản lý — nguồn sự thật duy nhất và an toàn. So sánh email ở client là hardcode, dễ vỡ khi đổi tài khoản admin, và vẫn bypass được.

**Q: Client-side authorization có an toàn không?**
A: **Không.** Check role ở frontend chỉ là UX (ẩn/hiện UI), không phải bảo mật. Backend **phải** kiểm tra role trên mọi endpoint admin — nếu không, bất kỳ ai gửi request trực tiếp cũng xoá được sản phẩm.

---

## 17. Chỉnh sửa sản phẩm (Admin)

### 1. Purpose

Admin sửa thông tin sản phẩm + thuộc tính.

### 2. Execution flow

```
User mở /editadmin/:editId
  → useParams() → editId
  → useEffect([editId]) → getProductById(editId)
    → data.productAttributes[0] → setUserData({ ..., attribute: { weight, original_price, ... } })
  → <Form fields={[ { name: ["name"], value: ... }, { name: ["attributes","weight"], value: ... } ] }>
  → Submit → editProduct()
    → updateProduct(editId, {
         name, slug, description, origin, sold, thumbnail_url,
         attribute: { weight, original_price, discounted_percent, dimensions,
                      unit_of_measurement, quantity_per_unit, certification,
                      harvest_date, link, expiration_date },
         hot, numberOfReview, rating
       })
      → PUT /products/:id
    → toast.update(loadingToast, {...})
```

### 3. Source code references

- `src/container/Admin/page/EditAdmin/EditAdmin.tsx`
- `src/apis/index.ts` → `getProductById`, `updateProduct`
- Endpoint: `GET /products/:id`, `PUT /products/:id`

### 4. Input & Output

**Input:** `Record<string, any>` — payload gồm thuộc tính sản phẩm + object `attribute`.

**Output:** toast success/error.

**Missing data:** `data.productAttributes?.[0] ?? {}` → không có attribute thì form trống nhưng không crash.

**Error:** `toast.update(loadingToast, { render: getApiErrorMessage(error, "Lỗi cập nhật sản phẩm"), type: "error" })`.

### 5. Step-by-step

1. `editId` từ URL → fetch chi tiết → fill form.
2. Tất cả giá trị form được convert sang `String` (vì `Input` cần string) — `data.sold !== undefined ? String(data.sold) : ""`.
3. `attribute` là nested → Ant Design dùng `name={["attributes", "weight"]}`.
4. **Bất nhất:** form field tên `attributes` (số nhiều) nhưng payload gửi `attribute` (số ít). Cần xác nhận lại contract của `PUT /products/:id` — hiện tại frontend gửi `attribute` cho khớp với **response** của `GET /products/:id` (`attribute` số ít).

### 6. Common bugs

| Lỗi | Nguyên nhân | Sửa |
|------|-------------|-----|
| Form không đổi khi đổi `editId` | `useEffect([editId])` đã có → OK | — |
| Số gửi lên là string | `String(...)` | Backend có thể cần number — cần cast khi gửi |
| `sold` gửi dạng string | Như trên | `Number(userData.sold)` |
| Key `attributes` vs `attribute` | Không nhất | Xác nhận contract backend |
| `console.log(userData)` còn sót | Debug leftovers | Đã có trong code — nên xoá |

### 7. Interview questions

**Q: `fields` vs `initialValues` vs `Form.Item name — khi nào dùng gì?**
A:
- `initialValues`: giá trị khởi tạo, chỉ đọc lần đầu (không cập nhật khi state đổi).
- `fields`: controlled fields — giá trị lấy từ props, cập nhật được → dùng khi load data bất đồng bộ (như case này).
- `Form.Item name`: uncontrolled, component tự quản lý state qua `onChange` → đơn giản nhất.

**Q: Form load data bất đồng bộ thì dùng `initialValues` có được không?**
A: Không ổn — `initialValues` chỉ áp dụng lần mount đầu. Dữ liệu về sau sẽ không hiện. Giải pháp: `fields` (đang dùng) hoặc `form.setFieldsValue()` trong `useEffect`.

---
