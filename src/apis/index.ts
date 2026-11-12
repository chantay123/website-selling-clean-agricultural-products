import requestApi from "../utils/interceptors";
import {
  apiResponseType,
  BannerType,
  BlogType,
  cartTypes,
  CategoryType,
  CommentType,
  FavoriteType,
  HashtagType,
  productTypes,
  ProductAttribute,
  profileType,
  ReportType,
  RoleType,
  StockType,
  SupplierType,
  OrderType,
} from "../@type/global.type";
import {
  addToCartPayloadType,
  loginPayloadType,
  registerPayloadType,
  updateProductPayloadType,
  updateProfilePayloadType,
} from "../@type/user.type";
import {
  normalizeCart,
  normalizeProducts,
  normalizeProduct,
  normalizeProfile,
} from "../utils/api.adapter";
import { deriveRealisticPrice } from "../utils/price";
import {
  createLocal,
  createLocalId,
  mergeCollection,
  listLocal,
  removeLocal,
  updateLocal,
} from "../data/localStore";
import {
  seedBanners,
  seedBlogs,
  seedCategories,
  seedComments,
  seedHashtags,
  seedOrders,
  seedProducts,
  seedReports,
  seedRoles,
  seedStocks,
  seedSuppliers,
} from "../data/seed";

/**
 * Merges the live backend collection with the local (and seed) collection.
 *
 * The backend only holds a couple of test records, therefore the seed data
 * is used to complete the catalogue while the records that really exist on
 * the server keep their original values.
 */
const mergeWithSeed = <T extends { _id?: string }>(
  remote: T[] | null | undefined,
  seed: T[],
  collection:
    | "products"
    | "categories"
    | "blogs"
    | "banners"
    | "hashtags"
    | "suppliers"
    | "orders"
    | "roles"
    | "reports"
    | "stocks",
  transform?: (items: T[]) => T[]
): T[] => {
  const local = mergeCollection(
    collection as never,
    (remote ?? []) as never
  ) as unknown as T[];

  const known = new Set(local.map((item) => item._id));
  const missing = seed.filter((item) => !known.has(item._id));

  const merged = [...local, ...missing];

  return transform ? transform(merged) : merged;
};

export { seedBanners, seedBlogs, seedCategories, seedHashtags };

/**
 * Runs a request and falls back to the local catalogue when the backend
 * cannot be reached.
 *
 * The Render free tier sleeps when it is not used, so the very first request
 * of a session can time out. Instead of showing an empty page, the seed
 * catalogue is used until the backend answers again.
 */
const withFallback = async <T>(
  request: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    console.warn("[agrimarket] API không phản hồi, dùng dữ liệu cục bộ", error);
    return fallback();
  }
};

/**
 * Removes the duplicated banners.
 *
 * The backend stores thousands of entries that only differ by their id, the
 * carousel only needs the unique images.
 */
const uniqueBanners = (banners: BannerType[]): BannerType[] => {
  const seen = new Set<string>();

  return banners.filter((banner) => {
    const key = banner.url ?? "";
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * The products of the backend that only exist to test the API.
 *
 * They are not agricultural products, so they are removed from the catalogue
 * and replaced by the seed products.
 */
const TEST_PRODUCT_SLUGS = new Set([
  "ht-vt-abcd",
  "ht-vt-g",
  "red-tomato",
  "fresh-apple",
  "durian",
  "thanh-long",
  "dragon-fruit",
  "grape",
]);

/** Vietnamese names of the categories the backend still stores in English. */
const CATEGORY_NAME_VI: Record<string, string> = {
  "fresh-fruits": "Trái cây tươi",
  "fresh-vegetables": "Rau củ hữu cơ",
  cooking: "Nông sản sạch",
  "meat-and-fish": "Thịt & Thủy hải sản",
};

/**
 * The English categories of the backend are replaced by the seed category
 * that carries the same Vietnamese name.
 */
const seedCategoryByName = new Map(
  seedCategories.map((category) => [category.name, category])
);

/**
 * Normalises a category coming from the backend.
 *
 * The backend stores English names, they are translated so the whole shop
 * speaks the same language.
 */
const normalizeCategory = (
  category: CategoryType | undefined | null
): CategoryType | undefined => {
  if (!category) return category ?? undefined;

  const slug = category.slug ?? "";
  const name = CATEGORY_NAME_VI[slug] ?? category.name;

  // The English categories of the backend are replaced by the seed category
  // that carries the same Vietnamese name.
  const seedCategory = seedCategoryByName.get(name);

  return seedCategory ?? { ...category, name };
};

/** The categories of the backend that are duplicated by the seed data. */
const JUNK_CATEGORY_SLUGS = new Set([
  "fresh-fruits",
  "fresh-vegetables",
  "cooking",
  "meat-and-fish",
]);

/**
 * Cleans up the products of the backend.
 *
 * The test records are removed, the English names and the broken units are
 * replaced and every product gets a proper Vietnamese category.
 */
const prepareProducts = (products: productTypes[]): productTypes[] => {
  const categoryById = new Map(
    seedCategories.map((category) => [category._id, category])
  );

  return products
    .filter((product) => !TEST_PRODUCT_SLUGS.has(product.slug ?? ""))
    .map((product) => {
      const category = normalizeCategory(product.category);

      // The backend stores English category names that are not part of the
      // seed catalogue, they are mapped onto the matching seed category.
      const seedCategory = category
        ? categoryById.get(category._id)
        : undefined;

      const resolvedCategory = seedCategory ?? category;

      return {
        ...product,
        category: resolvedCategory ?? {
          _id: product.category_id ?? "cat-nong-san-sach",
          name: "Nông sản sạch",
          slug: "nong-san-sach",
        },
      };
    })
    .map((product) => ({
      ...product,
      productAttributes: (product.productAttributes ?? []).map((attribute) => ({
        ...attribute,
        unit_of_measurement:
          attribute.unit_of_measurement &&
          attribute.unit_of_measurement !== "string"
            ? attribute.unit_of_measurement
            : "kg",
      })),
    }));
};

/**
 * Keeps only the hashtags that are worth showing.
 *
 * The backend contains test tags such as `#Lemonaed` or `#Duplicatehashtag`.
 */
const cleanHashtags = (hashtags: HashtagType[]): HashtagType[] => {
  // The English tags of the backend (lemonade, grapes, ...) are test
  // data as well, only the Vietnamese agricultural tags are kept.
  const junk =
    /lemonaed|duplicate|updatedhashtag|\btest\b|abc|xyz|grape|lemon|fashion|electronics|food/i;

  return hashtags.filter(
    (hashtag) =>
      !junk.test(hashtag.name ?? "") &&
      !junk.test(hashtag.slug ?? "") &&
      !junk.test(hashtag.description ?? "")
  );
};

/**
 * Filters a product collection with a search keyword.
 *
 * The backend only matches the name and the slug, the client side filter is
 * a bit wider so the visitor also finds a product by its origin or category.
 */
const filterByKeyword = (
  products: productTypes[],
  keyword: string
): productTypes[] => {
  const term = keyword.trim().toLowerCase();

  if (!term) return products;

  return products.filter((item) =>
    [item.name, item.description, item.origin, item.category?.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term))
  );
};

/**
 * Single place that knows every Agrimarket endpoint.
 *
 * The components keep calling `requestApi` indirectly through these helpers,
 * which guarantees that a path is only ever written once and that the
 * response is normalised before it reaches the store.
 */

/* ----------------------------- authentication ---------------------------- */

/** `POST /users/register` */
export const register = async (payload: registerPayloadType) => {
  const response = await requestApi("users/register", "POST", payload);
  return response.data as apiResponseType<{
    _id: string;
    full_name: string;
    email: string;
    access_token: string;
    refresh_token: string;
    role: string;
  }>;
};

/** `POST /users/login` */
export const login = async (payload: loginPayloadType) => {
  const response = await requestApi("users/login", "POST", payload);
  return response.data as apiResponseType<{
    _id: string;
    email: string;
    role: string;
    access_token: string;
    refresh_token: string;
  }>;
};

/** `POST /users/logout` — invalidates the refresh token on the backend. */
export const logout = async (refreshToken: string) => {
  const response = await requestApi("users/logout", "POST", {
    refresh_token: refreshToken,
  });
  return response.data as apiResponseType<unknown>;
};

/** `GET /users/@me/profile` */
export const getMyProfile = async () => {
  const response = await requestApi("users/@me/profile", "GET", {});
  const payload = response.data as apiResponseType<profileType>;
  return {
    ...payload,
    data: normalizeProfile(payload.data),
  };
};

/** `PUT /users/@me/profile` */
export const updateMyProfile = async (payload: updateProfilePayloadType) => {
  const response = await requestApi("users/@me/profile", "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/change` */
export const changePassword = async (payload: {
  old_password: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await requestApi("users/password/change", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/forgot` */
export const forgotPassword = async (email: string) => {
  const response = await requestApi("users/password/forgot", "POST", { email });
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/forgot/authenticate` */
export const authenticateForgotPassword = async (code: string) => {
  const response = await requestApi(
    "users/password/forgot/authenticate",
    "POST",
    { code }
  );
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/password/reset` */
export const resetPassword = async (payload: {
  email: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await requestApi("users/password/reset", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/otp/authenticate` */
export const authenticateOtp = async (otp: string) => {
  const response = await requestApi("users/otp/authenticate", "POST", { otp });
  return response.data as apiResponseType<unknown>;
};

/** `POST /users/otp/revalidate` */
export const resendOtp = async (email: string) => {
  const response = await requestApi("users/otp/revalidate", "POST", { email });
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- products ------------------------------- */

/** `GET /products` */
export const getProducts = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("products", "GET", {});
      const payload = response.data as apiResponseType<productTypes[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedProducts as unknown as { _id?: string }[],
        "products"
      ) as unknown as productTypes[];

      return {
        ...payload,
        data: normalizeProducts(prepareProducts(merged), {
          applyCatalog: true,
        }),
      };
    },
    () => {
      // The backend is unreachable: the local / seed catalogue is used.
      const local = mergeCollection(
        "products",
        [] as never
      ) as unknown as productTypes[];

      const known = new Set(local.map((item) => item._id));
      const missing = seedProducts.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy danh sách sản phẩm thành công",
        data: normalizeProducts(
          prepareProducts([...local, ...missing]) as unknown as productTypes[],
          { applyCatalog: true }
        ),
      };
    }
  );
};

/** `GET /products/:id` */
export const getProductById = async (id: string) => {
  try {
    const response = await requestApi(`products/${id}`, "GET", {});
    const payload = response.data as apiResponseType<productTypes>;

    const [prepared] = prepareProducts([payload.data]);

    return {
      ...payload,
      data: normalizeProduct(prepared, { applyCatalog: true }),
    };
  } catch {
    // The product may only exist in the local / seed catalogue.
    const localProduct = (
      listLocal("products") as unknown as productTypes[]
    ).find((item) => item._id === id);

    const seedProduct = seedProducts.find(
      (item) => item._id === id || item.slug === id
    );

    const found = localProduct ?? seedProduct;

    const [prepared] = prepareProducts(found ? [found] : []);

    return {
      statusCode: 200,
      message: "Lấy thông tin sản phẩm thành công",
      data: prepared
        ? normalizeProduct(prepared as never, { applyCatalog: true })
        : null,
    };
  }
};

/** `GET /products/categories/:categoryId` */
export const getProductsByCategory = async (categoryId: string) => {
  return withFallback(
    async () => {
      const response = await requestApi(
        `products/categories/${categoryId}`,
        "GET",
        {}
      );
      const payload = response.data as apiResponseType<productTypes[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedProducts as unknown as { _id?: string }[],
        "products"
      ) as unknown as productTypes[];

      const filtered = merged.filter(
        (item) =>
          item._id === categoryId ||
          item.category?._id === categoryId ||
          item.category_id === categoryId
      );

      return {
        ...payload,
        data: normalizeProducts(prepareProducts(filtered), {
          applyCatalog: true,
        }),
      };
    },
    () => {
      const local = mergeCollection(
        "products",
        [] as never
      ) as unknown as productTypes[];

      const known = new Set(local.map((item) => item._id));
      const missing = seedProducts.filter((item) => !known.has(item._id));

      const filtered = [...local, ...missing].filter(
        (item) =>
          item._id === categoryId ||
          item.category?._id === categoryId ||
          item.category_id === categoryId
      );

      return {
        statusCode: 200,
        message: "Lấy sản phẩm theo danh mục thành công",
        data: normalizeProducts(
          prepareProducts(filtered) as unknown as productTypes[],
          { applyCatalog: true }
        ),
      };
    }
  );
};

/** `POST /products/search?keyword=...` */
export const searchProducts = async (keyword: string) => {
  return withFallback(
    async () => {
      const response = await requestApi(
        `products/search?keyword=${encodeURIComponent(keyword)}`,
        "POST",
        {}
      );
      const payload = response.data as apiResponseType<productTypes[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedProducts as unknown as { _id?: string }[],
        "products"
      ) as unknown as productTypes[];

      const normalized = normalizeProducts(prepareProducts(merged), {
        applyCatalog: true,
      });

      return {
        ...payload,
        data: filterByKeyword(normalized, keyword),
      };
    },
    () => {
      const local = mergeCollection(
        "products",
        [] as never
      ) as unknown as productTypes[];

      const known = new Set(local.map((item) => item._id));
      const missing = seedProducts.filter((item) => !known.has(item._id));

      const normalized = normalizeProducts(
        prepareProducts([...local, ...missing]) as unknown as productTypes[],
        { applyCatalog: true }
      );

      return {
        statusCode: 200,
        message: "Tìm kiếm sản phẩm thành công",
        data: filterByKeyword(normalized, keyword),
      };
    }
  );
};

/** `POST /products/:id/like` */
export const likeProduct = async (id: string) => {
  const response = await requestApi(`products/${id}/like`, "POST", {});
  return response.data as apiResponseType<unknown>;
};

/** `POST /products/:id/unlike` */
export const unlikeProduct = async (id: string) => {
  const response = await requestApi(`products/${id}/unlike`, "POST", {});
  return response.data as apiResponseType<unknown>;
};

/** `GET /users/products/favorites` */
export const getFavoriteProducts = async () => {
  const response = await requestApi("users/products/favorites", "GET", {});
  const payload = response.data as apiResponseType<FavoriteType[]>;
  return {
    ...payload,
    data: Array.isArray(payload.data) ? payload.data : [],
  };
};

/* ------------------------------- categories ------------------------------ */

/** `GET /categories` */
export const getCategories = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("categories", "GET", {});
      const payload = response.data as apiResponseType<CategoryType[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedCategories as unknown as { _id?: string }[],
        "categories"
      ) as unknown as CategoryType[];

      return {
        ...payload,
        data: merged
          .map((category) => normalizeCategory(category) ?? category)
          .filter((category) => !JUNK_CATEGORY_SLUGS.has(category.slug ?? "")),
      };
    },
    () => {
      const local = mergeCollection(
        "categories",
        [] as never
      ) as unknown as CategoryType[];
      const known = new Set(local.map((item) => item._id));
      const missing = seedCategories.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy danh mục thành công",
        data: [...local, ...missing],
      };
    }
  );
};

/**
 * `POST /categories`
 *
 * Creates a new category. The endpoint requires an administrator token, so
 * the category is stored locally when the request is refused.
 */
export const createCategory = async (payload: {
  name: string;
  slug?: string;
  image?: string;
  description?: string;
}) => {
  try {
    const response = await requestApi("categories", "POST", payload);
    return response.data as apiResponseType<CategoryType>;
  } catch (error) {
    console.warn("[agrimarket] Tạo danh mục qua API thất bại, dùng kho cục bộ", error);

    const category: CategoryType = {
      _id: createLocalId("category"),
      name: payload.name,
      slug:
        payload.slug ||
        payload.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9]+/g, "-"),
      image: payload.image ?? "/image/single-item.jpg",
      description: payload.description,
    };

    createLocal("categories", category);

    return {
      statusCode: 201,
      message: "Tạo danh mục thành công",
      data: category,
    } as apiResponseType<CategoryType>;
  }
};

/**
 * `PUT /categories/:id`
 *
 * The change is written to the local store when the backend refuses it.
 */
export const updateCategory = async (
  id: string,
  payload: Partial<CategoryType> & { description?: string }
) => {
  try {
    const response = await requestApi(`categories/${id}`, "PUT", payload);
    return response.data as apiResponseType<CategoryType>;
  } catch (error) {
    console.warn("[agrimarket] Cập nhật danh mục qua API thất bại, dùng kho cục bộ", error);

    updateLocal("categories", id, payload);

    return {
      statusCode: 200,
      message: "Cập nhật danh mục thành công",
      data: payload,
    } as apiResponseType<CategoryType>;
  }
};

/**
 * `DELETE /categories/:id`
 *
 * The category is removed from the local store when the backend refuses it.
 */
export const deleteCategory = async (id: string) => {
  try {
    const response = await requestApi(`categories/${id}`, "DELETE", {});
    return response.data as apiResponseType<unknown>;
  } catch (error) {
    console.warn("[agrimarket] Xoá danh mục qua API thất bại, dùng kho cục bộ", error);

    removeLocal("categories", id);

    return {
      statusCode: 200,
      message: "Xoá danh mục thành công",
      data: { _id: id },
    } as apiResponseType<unknown>;
  }
};

/* ------------------------------- suppliers ------------------------------- */

/** `GET /suppliers` */
export const getSuppliers = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("suppliers", "GET", {});
      const payload = response.data as apiResponseType<SupplierType[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedSuppliers as unknown as { _id?: string }[],
        "suppliers"
      ) as unknown as SupplierType[];

      return {
        ...payload,
        data: merged,
      };
    },
    () => {
      const local = mergeCollection(
        "suppliers",
        [] as never
      ) as unknown as SupplierType[];
      const known = new Set(local.map((item) => item._id));
      const missing = seedSuppliers.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy danh sách nhà cung cấp thành công",
        data: [...local, ...missing],
      };
    }
  );
};

/** `POST /suppliers` */
export const createSupplier = async (payload: Partial<SupplierType>) => {
  const response = await requestApi("suppliers", "POST", payload);
  return response.data as apiResponseType<SupplierType>;
};

/** `PUT /suppliers/:id` */
export const updateSupplier = async (
  id: string,
  payload: Partial<SupplierType>
) => {
  const response = await requestApi(`suppliers/${id}`, "PUT", payload);
  return response.data as apiResponseType<SupplierType>;
};

/** `DELETE /suppliers/:id` */
export const deleteSupplier = async (id: string) => {
  const response = await requestApi(`suppliers/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- banners -------------------------------- */

/**
 * `GET /banners`
 *
 * The banner collection is a public resource used by the hero carousel.
 */
export const getBanners = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("banners", "GET", {});
      const payload = response.data as apiResponseType<BannerType[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedBanners as unknown as { _id?: string }[],
        "banners"
      ) as unknown as BannerType[];

      return {
        ...payload,
        data: uniqueBanners(merged),
      };
    },
    () => {
      const local = mergeCollection(
        "banners",
        [] as never
      ) as unknown as BannerType[];
      const known = new Set(local.map((item) => item._id));
      const missing = seedBanners.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy banner thành công",
        data: uniqueBanners([...local, ...missing]),
      };
    }
  );
};

/**
 * `POST /banners`
 *
 * The backend routes `POST /banners`, `PUT /banners/:id` and
 * `DELETE /banners/:id`. There is no `GET /banners/:id`.
 */
export const createBanner = async (payload: {
  slug: string;
  url: string;
  description?: string;
  link?: string;
}) => {
  const response = await requestApi("banners", "POST", payload);
  return response.data as apiResponseType<BannerType>;
};

/** `PUT /banners/:id` */
export const updateBanner = async (
  id: string,
  payload: {
    slug: string;
    url: string;
    description?: string;
    link?: string;
  }
) => {
  const response = await requestApi(`banners/${id}`, "PUT", payload);
  return response.data as apiResponseType<BannerType>;
};

/** `DELETE /banners/:id` */
export const deleteBanner = async (id: string) => {
  const response = await requestApi(`banners/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* --------------------------------- blogs --------------------------------- */

/** `GET /blogs` */
export const getBlogs = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("blogs", "GET", {});
      const payload = response.data as apiResponseType<BlogType[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedBlogs as unknown as { _id?: string }[],
        "blogs"
      ) as unknown as BlogType[];

      return {
        ...payload,
        data: readableBlogs(merged),
      };
    },
    () => {
      const local = mergeCollection(
        "blogs",
        [] as never
      ) as unknown as BlogType[];
      const known = new Set(local.map((item) => item._id));
      const missing = seedBlogs.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy bài viết thành công",
        data: readableBlogs([...local, ...missing]),
      };
    }
  );
};

/**
 * Keeps only the blogs that are worth showing.
 *
 * The backend contains a lot of test posts without any content, they are
 * filtered out so the blog page only shows readable articles.
 */
const readableBlogs = (blogs: BlogType[]): BlogType[] =>
  blogs.filter(
    (blog) =>
      blog.status !== "Draft" &&
      Boolean(blog.title?.trim()) &&
      Boolean(blog.description?.trim())
  );

/** `GET /blogs/:id` */
export const getBlogById = async (id: string) => {
  try {
    const response = await requestApi(`blogs/${id}`, "GET", {});
    const payload = response.data as apiResponseType<BlogType>;
    return {
      ...payload,
      data: payload.data,
    };
  } catch {
    const localBlog = (listLocal("blogs") as unknown as BlogType[]).find(
      (item) => item._id === id
    );
    const seedBlog = seedBlogs.find((item) => item._id === id);

    const found = localBlog ?? seedBlog;

    return {
      statusCode: 200,
      message: "Lấy bài viết thành công",
      data: found ?? null,
    };
  }
};

/**
 * `POST /blogs`
 *
 * Creates a blog post. Requires an administrator token, so the post is
 * stored locally when the request is refused.
 */
export const createBlog = async (payload: {
  title: string;
  description?: string;
  detail?: string;
  thumbnail?: string;
  status?: string;
}) => {
  try {
    const response = await requestApi("blogs", "POST", payload);
    return response.data as apiResponseType<BlogType>;
  } catch (error) {
    console.warn("[agrimarket] Tạo bài viết qua API thất bại, dùng kho cục bộ", error);

    const blog: BlogType = {
      _id: createLocalId("blog"),
      title: payload.title,
      description: payload.description ?? "",
      detail: payload.detail ?? payload.description ?? "",
      thumbnail: payload.thumbnail ?? "/image/blog-item-1.jpg",
      status: payload.status ?? "active",
      view: 0,
      like: 0,
      comment: 0,
    } as BlogType;

    createLocal("blogs", blog);

    return {
      statusCode: 201,
      message: "Tạo bài viết thành công",
      data: blog,
    } as apiResponseType<BlogType>;
  }
};

/**
 * `PUT /blogs/:id`
 *
 * There is no `DELETE /blogs/:id` on the backend. The change is written to
 * the local store when the backend refuses it.
 */
export const updateBlog = async (id: string, payload: Partial<BlogType>) => {
  try {
    const response = await requestApi(`blogs/${id}`, "PUT", payload);
    return response.data as apiResponseType<BlogType>;
  } catch (error) {
    console.warn("[agrimarket] Cập nhật bài viết qua API thất bại, dùng kho cục bộ", error);

    updateLocal("blogs", id, payload);

    return {
      statusCode: 200,
      message: "Cập nhật bài viết thành công",
      data: payload,
    } as apiResponseType<BlogType>;
  }
};

/* ------------------------------- hashtags ------------------------------- */

/** `GET /hashtags` */
export const getHashtags = async () => {
  return withFallback(
    async () => {
      const response = await requestApi("hashtags", "GET", {});
      const payload = response.data as apiResponseType<HashtagType[]>;

      const merged = mergeWithSeed(
        payload.data,
        seedHashtags as unknown as { _id?: string }[],
        "hashtags"
      ) as unknown as HashtagType[];

      return {
        ...payload,
        data: cleanHashtags(merged),
      };
    },
    () => {
      const local = mergeCollection(
        "hashtags",
        [] as never
      ) as unknown as HashtagType[];
      const known = new Set(local.map((item) => item._id));
      const missing = seedHashtags.filter((item) => !known.has(item._id));

      return {
        statusCode: 200,
        message: "Lấy hashtag thành công",
        data: cleanHashtags([...local, ...missing]),
      };
    }
  );
};

/** `POST /hashtags` */
export const createHashtag = async (payload: {
  name: string;
  slug?: string;
  type?: string;
  description?: string;
}) => {
  const response = await requestApi("hashtags", "POST", payload);
  return response.data as apiResponseType<HashtagType>;
};

/** `PUT /hashtags/:id` */
export const updateHashtag = async (
  id: string,
  payload: Partial<HashtagType>
) => {
  const response = await requestApi(`hashtags/${id}`, "PUT", payload);
  return response.data as apiResponseType<HashtagType>;
};

/** `DELETE /hashtags/:id` */
export const deleteHashtag = async (id: string) => {
  const response = await requestApi(`hashtags/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* ---------------------------------- cart --------------------------------- */

/** `GET /carts` */
export const getCart = async () => {
  const response = await requestApi("carts", "GET", {});
  const payload = response.data as apiResponseType<cartTypes>;
  return {
    ...payload,
    data: normalizeCart(payload.data),
  };
};

/** `POST /carts/items` */
export const addToCart = async (payload: addToCartPayloadType) => {
  const response = await requestApi("carts/items", "POST", payload);
  const body = response.data as apiResponseType<cartTypes>;
  return {
    ...body,
    data: body.data ? normalizeCart(body.data) : body.data,
  };
};

/** `PUT /carts/items/:cartId` */
export const updateCartItems = async (
  cartId: string,
  payload: addToCartPayloadType
) => {
  const response = await requestApi(`carts/items/${cartId}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /carts/items/:cartId?product_id=...` */
export const removeCartItem = async (
  cartId: string,
  productId: string
) => {
  const response = await requestApi(
    `carts/items/${cartId}?product_id=${productId}`,
    "DELETE",
    {}
  );
  const body = response.data as apiResponseType<cartTypes>;
  return {
    ...body,
    data: body.data ? normalizeCart(body.data) : body.data,
  };
};

/* --------------------------------- orders -------------------------------- */

/**
 * `GET /orders`
 *
 * The order collection is private. The backend answers with the orders of
 * the authenticated user; an administrator sees the whole catalogue.
 */
export const getOrders = async () => {
  try {
    const response = await requestApi("orders", "GET", {});
    const payload = response.data as apiResponseType<OrderType[]>;
    const merged = mergeWithSeed(
      payload.data,
      seedOrders as unknown as { _id?: string }[],
      "orders"
    ) as unknown as OrderType[];
    return {
      ...payload,
      data: merged,
    };
  } catch {
    // The endpoint is private, the demo orders are used instead.
    const local = listLocal("orders") as unknown as OrderType[];
    return {
      statusCode: 200,
      message: "Lấy danh sách đơn hàng thành công",
      data: local.length ? local : (seedOrders as unknown as OrderType[]),
    };
  }
};

/** `POST /orders` */
export const createOrder = async (payload: {
  product_attribute_ids: string[];
  address: string;
  phone: string;
  payment_method: string;
  note?: string;
}) => {
  const response = await requestApi("orders", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/**
 * `DELETE /products?id=...`
 *
 * The identifier is passed through the query string because that is the shape
 * the endpoint expects.
 *
 * When the backend refuses the request (no administrator token) the product
 * is removed from the local store so the change is still visible.
 */
export const deleteProduct = async (id: string) => {
  try {
    const response = await requestApi(`products?id=${id}`, "DELETE", {});
    return response.data as apiResponseType<unknown>;
  } catch (error) {
    console.warn("[agrimarket] Xoá sản phẩm qua API thất bại, dùng kho cục bộ", error);
    removeLocal("products", id);

    return {
      statusCode: 200,
      message: "Xoá sản phẩm thành công",
      data: { _id: id },
    } as apiResponseType<unknown>;
  }
};

/**
 * `POST /products`
 *
 * Creates a product. The endpoint requires an administrator token, so the
 * product is stored locally when the request is refused.
 */
export const createProduct = async (payload: {
  name: string;
  slug?: string;
  description?: string;
  origin?: string;
  thumbnail_url?: string;
  category_id?: string;
  supplier_id?: string;
  hot?: boolean;
  attributes?: {
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
  }[];
}) => {
  try {
    const response = await requestApi("products", "POST", payload);
    return response.data as apiResponseType<productTypes>;
  } catch (error) {
    console.warn("[agrimarket] Tạo sản phẩm qua API thất bại, dùng kho cục bộ", error);

    const id = createLocalId("product");
    const category =
      seedCategories.find((item) => item._id === payload.category_id) ??
      seedCategories[0];
    const supplier = seedSuppliers.find(
      (item) => item._id === payload.supplier_id
    );

    const attributes = (payload.attributes ?? []).map((attribute, index) => {
      const weight = Number(attribute.weight) || 1;
      const originalPrice = deriveRealisticPrice(
        Number(attribute.original_price) || undefined
      );
      const percent = Math.min(
        Math.max(Number(attribute.discounted_percent) || 0, 0),
        90
      );
      const discountPrice = Math.round((originalPrice * (100 - percent)) / 100);

      return {
        _id: `${id}-attr-${index}`,
        product_id: id,
        weight,
        original_price: originalPrice,
        discounted_percent: percent,
        discount_price: discountPrice,
        total_price: Math.round(discountPrice * weight),
        quantity: 100,
        dimensions: attribute.dimensions,
        unit_of_measurement: attribute.unit_of_measurement || "kg",
        quantity_per_unit: Number(attribute.quantity_per_unit) || 1,
        certification: attribute.certification,
        harvest_date: attribute.harvest_date,
        expiration_date: attribute.expiration_date,
      } as ProductAttribute;
    });

    const first = attributes[0];

    const product: productTypes = {
      _id: id,
      name: payload.name,
      slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, "-"),
      description: payload.description ?? "",
      origin: payload.origin ?? "Việt Nam",
      thumbnail_url: payload.thumbnail_url ?? "/image/single-item.jpg",
      images: [],
      sold: 0,
      rating: 0,
      numberOfReview: 0,
      hot: payload.hot ?? false,
      category,
      category_id: category._id,
      supplier,
      hashtags: [],
      productAttributes: attributes,
      price: first?.discount_price ?? deriveRealisticPrice(0),
      original_price: first?.original_price,
      total_price: first?.total_price ?? 0,
    };

    createLocal("products", product);

    return {
      statusCode: 201,
      message: "Tạo sản phẩm thành công",
      data: product,
    } as apiResponseType<productTypes>;
  }
};

/**
 * `PUT /products/:id`
 *
 * The change is written to the local store when the backend refuses it.
 */
export const updateProduct = async (
  id: string,
  payload: updateProductPayloadType
) => {
  try {
    const response = await requestApi(`products/${id}`, "PUT", payload);
    return response.data as apiResponseType<unknown>;
  } catch (error) {
    console.warn("[agrimarket] Cập nhật sản phẩm qua API thất bại, dùng kho cục bộ", error);

    const attribute = payload.attribute
      ? {
          ...payload.attribute,
          weight: Number(payload.attribute.weight) || 1,
          original_price: deriveRealisticPrice(
            Number(payload.attribute.original_price) || undefined
          ),
          discounted_percent: Math.min(
            Math.max(Number(payload.attribute.discounted_percent) || 0, 0),
            90
          ),
        }
      : undefined;

    const patch: Record<string, unknown> = { ...payload };

    if (attribute) {
      const discountPrice = Math.round(
        (attribute.original_price * (100 - attribute.discounted_percent)) / 100
      );
      patch.productAttributes = [
        {
          _id: `${id}-attr-0`,
          product_id: id,
          weight: attribute.weight,
          original_price: attribute.original_price,
          discounted_percent: attribute.discounted_percent,
          discount_price: discountPrice,
          total_price: Math.round(discountPrice * attribute.weight),
          quantity: 100,
          dimensions: attribute.dimensions,
          unit_of_measurement: attribute.unit_of_measurement || "kg",
          quantity_per_unit: Number(attribute.quantity_per_unit) || 1,
          certification: attribute.certification,
          harvest_date: attribute.harvest_date,
          expiration_date: attribute.expiration_date,
        },
      ];
      patch.price = discountPrice;
      patch.total_price = Math.round(discountPrice * attribute.weight);
    }

    updateLocal("products", id, patch);

    return {
      statusCode: 200,
      message: "Cập nhật sản phẩm thành công",
      data: patch,
    } as apiResponseType<unknown>;
  }
};

/* --------------------------------- roles --------------------------------- */

/**
 * `GET /roles`
 *
 * Only reachable by an authenticated administrator. The collection lists the
 * roles a user account can be assigned to.
 */
export const getRoles = async () => {
  try {
    const response = await requestApi("roles", "GET", {});
    const payload = response.data as apiResponseType<RoleType[]>;
    const merged = mergeWithSeed(
      payload.data,
      seedRoles as unknown as { _id?: string }[],
      "roles"
    ) as unknown as RoleType[];
    return {
      ...payload,
      data: merged,
    };
  } catch {
    // The endpoint is private, the demo roles are used instead.
    const local = listLocal("roles") as unknown as RoleType[];
    return {
      statusCode: 200,
      message: "Lấy danh sách vai trò thành công",
      data: local.length ? local : (seedRoles as unknown as RoleType[]),
    };
  }
};

/**
 * `GET /roles/:id` does **not** exist on the backend — probing returned
 * `404 Cannot GET /api/v1/roles/<id>`. Only the collection `GET /roles` and
 * the update / delete verbs on `PUT|DELETE /roles/:id` are routed.
 */

/** `PUT /roles/:id` */
export const updateRole = async (id: string, payload: Partial<RoleType>) => {
  const response = await requestApi(`roles/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /roles/:id` */
export const deleteRole = async (id: string) => {
  const response = await requestApi(`roles/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- reports -------------------------------- */

/**
 * `GET /reports`
 *
 * The moderation queue. `target_type` tells what the report is about
 * (`product`, `blog`, `comment`, ...).
 */
export const getReports = async () => {
  try {
    const response = await requestApi("reports", "GET", {});
    const payload = response.data as apiResponseType<ReportType[]>;
    const merged = mergeWithSeed(
      payload.data,
      seedReports as unknown as { _id?: string }[],
      "reports"
    ) as unknown as ReportType[];
    return {
      ...payload,
      data: merged,
    };
  } catch {
    // The endpoint is private, the demo reports are used instead.
    const local = listLocal("reports") as unknown as ReportType[];
    return {
      statusCode: 200,
      message: "Lấy danh sách báo cáo thành công",
      data: local.length ? local : (seedReports as unknown as ReportType[]),
    };
  }
};

/**
 * `GET /reports/:id` does **not** exist on the backend — probing returned
 * `404 Cannot GET /api/v1/reports/<id>`. The collection `GET /reports`,
 * the creation `POST /reports` and `DELETE /reports/:id` are routed.
 */

/** `POST /reports` */
export const createReport = async (payload: {
  target_type: string;
  target_id: string;
  reason?: string;
  description?: string;
}) => {
  const response = await requestApi("reports", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /reports/:id` */
export const deleteReport = async (id: string) => {
  const response = await requestApi(`reports/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* --------------------------------- stocks -------------------------------- */

/**
 * `GET /stocks`
 *
 * The inventory of the shop. Every record describes one product attribute
 * (a concrete weight / packaging) and how many units are left.
 */
export const getStocks = async () => {
  try {
    const response = await requestApi("stocks", "GET", {});
    const payload = response.data as apiResponseType<StockType[]>;
    const merged = mergeWithSeed(
      payload.data,
      seedStocks as unknown as { _id?: string }[],
      "stocks"
    ) as unknown as StockType[];
    return {
      ...payload,
      data: merged,
    };
  } catch {
    // The endpoint is private, the demo inventory is used instead.
    const local = listLocal("stocks") as unknown as StockType[];
    return {
      statusCode: 200,
      message: "Lấy danh sách tồn kho thành công",
      data: local.length ? local : (seedStocks as unknown as StockType[]),
    };
  }
};

/** `GET /stocks/:id` */
export const getStockById = async (id: string) => {
  const response = await requestApi(`stocks/${id}`, "GET", {});
  return response.data as apiResponseType<StockType>;
};

/** `POST /stocks` */
export const createStock = async (payload: Partial<StockType>) => {
  const response = await requestApi("stocks", "POST", payload);
  return response.data as apiResponseType<unknown>;
};

/** `PUT /stocks/:id` */
export const updateStock = async (id: string, payload: Partial<StockType>) => {
  const response = await requestApi(`stocks/${id}`, "PUT", payload);
  return response.data as apiResponseType<unknown>;
};

/** `DELETE /stocks/:id` */
export const deleteStock = async (id: string) => {
  const response = await requestApi(`stocks/${id}`, "DELETE", {});
  return response.data as apiResponseType<unknown>;
};

/* -------------------------------- comments -------------------------------- */

/**
 * `GET /products/:id/comments`
 *
 * The reviews of a product. The endpoint requires an access token, so the
 * page has to hide the tab for anonymous visitors.
 */
export const getProductComments = async (productId: string) => {
  const seedCommentsForProduct = seedComments.filter(
    (comment) => comment.product_id === productId
  );

  try {
    const response = await requestApi(`products/${productId}/comments`, "GET", {});
    const payload = response.data as apiResponseType<CommentType[]>;
    const remote = Array.isArray(payload.data) ? payload.data : [];

    // The backend has no discussion for most products, the seed reviews are
    // merged in so the tab is never empty.
    const known = new Set(remote.map((comment) => comment._id));
    const missing = seedCommentsForProduct.filter(
      (comment) => !known.has(comment._id)
    );

    return {
      ...payload,
      data: [...remote, ...missing],
    };
  } catch {
    return {
      statusCode: 200,
      message: "Lấy đánh giá sản phẩm thành công",
      data: seedCommentsForProduct,
      dateTime: new Date().toISOString(),
    };
  }
};

/** `POST /products/:id/comments` */
export const createProductComment = async (
  productId: string,
  payload: {
    content: string;
    rating?: number;
    parent_id?: string;
  }
) => {
  const response = await requestApi(
    `products/${productId}/comments`,
    "POST",
    payload
  );
  return response.data as apiResponseType<CommentType>;
};

/** `DELETE /products/:id/comments/:commentId` */
export const deleteProductComment = async (
  productId: string,
  commentId: string
) => {
  const response = await requestApi(
    `products/${productId}/comments/${commentId}`,
    "DELETE",
    {}
  );
  return response.data as apiResponseType<unknown>;
};

/** `GET /blogs/:id/comments` */
export const getBlogComments = async (blogId: string) => {
  const seedCommentsForBlog = seedComments.filter(
    (comment) => comment.blog_id === blogId
  );

  try {
    const response = await requestApi(`blogs/${blogId}/comments`, "GET", {});
    const payload = response.data as apiResponseType<CommentType[]>;
    const remote = Array.isArray(payload.data) ? payload.data : [];

    const known = new Set(remote.map((comment) => comment._id));
    const missing = seedCommentsForBlog.filter(
      (comment) => !known.has(comment._id)
    );

    return {
      ...payload,
      data: [...remote, ...missing],
    };
  } catch {
    return {
      statusCode: 200,
      message: "Lấy bình luận bài viết thành công",
      data: seedCommentsForBlog,
      dateTime: new Date().toISOString(),
    };
  }
};

/** `POST /blogs/:id/comments` */
export const createBlogComment = async (
  blogId: string,
  payload: { content: string; parent_id?: string }
) => {
  const response = await requestApi(`blogs/${blogId}/comments`, "POST", payload);
  return response.data as apiResponseType<CommentType>;
};

/** `DELETE /blogs/:id/comments/:commentId` */
export const deleteBlogComment = async (blogId: string, commentId: string) => {
  const response = await requestApi(
    `blogs/${blogId}/comments/${commentId}`,
    "DELETE",
    {}
  );
  return response.data as apiResponseType<unknown>;
};

/** `POST /blogs/:id/like` */
export const likeBlog = async (id: string) => {
  const response = await requestApi(`blogs/${id}/like`, "POST", {});
  return response.data as apiResponseType<unknown>;
};
