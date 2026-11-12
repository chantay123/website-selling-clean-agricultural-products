/**
 * Local (offline) data store.
 *
 * The public read endpoints of the Agrimarket API only expose a handful of
 * test records and every write verb requires an administrator token that
 * cannot be obtained (the registration mail service is broken). To make the
 * whole application usable — and to let the admin screens demonstrate a
 * complete CRUD cycle — the records created inside the app are persisted in
 * `localStorage` and merged into the API responses.
 *
 * The store keeps two things per collection:
 *
 * - `collections`: the records created locally.
 * - `deleted`: the ids of the API records that were removed locally, so
 *   they do not come back on the next reload.
 */

import {
  BannerType,
  BlogType,
  CategoryType,
  HashtagType,
  OrderType,
  ReportType,
  RoleType,
  StockType,
  SupplierType,
  productTypes,
} from "../@type/global.type";

const STORAGE_KEY = "agrimarket:local-store:v1";

export type LocalCollections = {
  products: productTypes[];
  categories: CategoryType[];
  blogs: BlogType[];
  banners: BannerType[];
  hashtags: HashtagType[];
  suppliers: SupplierType[];
  stocks: StockType[];
  reports: ReportType[];
  roles: RoleType[];
  orders: OrderType[];
};

export type LocalStore = {
  collections: LocalCollections;
  deleted: Record<keyof LocalCollections, string[]>;
};

const emptyCollections = (): LocalCollections => ({
  products: [],
  categories: [],
  blogs: [],
  banners: [],
  hashtags: [],
  suppliers: [],
  stocks: [],
  reports: [],
  roles: [],
  orders: [],
});

const emptyStore = (): LocalStore => ({
  collections: emptyCollections(),
  deleted: {
    products: [],
    categories: [],
    blogs: [],
    banners: [],
    hashtags: [],
    suppliers: [],
    stocks: [],
    reports: [],
    roles: [],
    orders: [],
  },
});

/** Reads the store from `localStorage`, tolerating a corrupted payload. */
export const readStore = (): LocalStore => {
  if (typeof window === "undefined") return emptyStore();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();

    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    const base = emptyStore();

    return {
      collections: { ...base.collections, ...(parsed.collections ?? {}) },
      deleted: { ...base.deleted, ...(parsed.deleted ?? {}) },
    };
  } catch (error) {
    console.log("local store corrupted, starting over", error);
    return emptyStore();
  }
};

/** Persists the store. */
export const writeStore = (store: LocalStore) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.log("cannot persist the local store", error);
  }
};

const mutate = (
  updater: (store: LocalStore) => LocalStore
): LocalStore => {
  const store = updater(readStore());
  writeStore(store);
  return store;
};

/** The records of one collection that were created locally. */
export const listLocal = <K extends keyof LocalCollections>(
  collection: K
): LocalCollections[K] => readStore().collections[collection] ?? [];

/** Adds a record to a local collection. */
export const createLocal = <K extends keyof LocalCollections>(
  collection: K,
  item: LocalCollections[K][number]
) => {
  mutate((store) => ({
    ...store,
    collections: {
      ...store.collections,
      [collection]: [...store.collections[collection], item],
    },
  }));
};

/** Updates a locally created record. */
export const updateLocal = <K extends keyof LocalCollections>(
  collection: K,
  id: string,
  patch: Partial<LocalCollections[K][number]>
) => {
  mutate((store) => ({
    ...store,
    collections: {
      ...store.collections,
      [collection]: store.collections[collection].map((item) =>
        (item as { _id?: string })._id === id
          ? { ...(item as object), ...(patch as object) }
          : item
      ),
    },
  }));
};

/**
 * Removes a record.
 *
 * A locally created record is dropped from the collection, a record coming
 * from the API is remembered in the `deleted` list so it disappears from the
 * merged result as well.
 */
export const removeLocal = <K extends keyof LocalCollections>(
  collection: K,
  id: string
) => {
  mutate((store) => {
    const isLocal = store.collections[collection].some(
      (item) => (item as { _id?: string })._id === id
    );

    if (isLocal) {
      return {
        ...store,
        collections: {
          ...store.collections,
          [collection]: store.collections[collection].filter(
            (item) => (item as { _id?: string })._id !== id
          ),
        },
      };
    }

    return {
      ...store,
      deleted: {
        ...store.deleted,
        [collection]: [...store.deleted[collection], id],
      },
    };
  });
};

/** The ids of the API records that were deleted locally. */
export const listDeleted = <K extends keyof LocalCollections>(
  collection: K
): string[] => readStore().deleted[collection] ?? [];

/**
 * Merges the API records with the local ones.
 *
 * The API records come first so that the real data keeps its place, the
 * local records are appended. Records that were deleted locally are
 * filtered out.
 */
export const mergeCollection = <K extends keyof LocalCollections>(
  collection: K,
  remote: LocalCollections[K]
): LocalCollections[K] => {
  const deleted = listDeleted(collection);
  const kept = (remote ?? []).filter(
    (item) => !deleted.includes((item as { _id?: string })._id ?? "")
  );

  return [...kept, ...listLocal(collection)] as LocalCollections[K];
};

/** Generates an id for a locally created record. */
export const createLocalId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
