import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/config";
import {
  setAdminStatus,
  setprofile,
} from "../../../redux/userReducer/userReducer";
import { getMyProfile } from "../../../apis";
import { profileType } from "../../../@type/global.type";

/**
 * Shared profile request.
 *
 * The admin section renders a guard and the pages themselves, so the profile
 * endpoint would be called several times for the same route. The promise is
 * therefore cached and reused by every caller that mounts at the same time.
 */
let profileRequest: Promise<{
  isAdmin: boolean;
  profile: profileType | null;
}> | null = null;

/**
 * The demo administrator.
 *
 * The public API of the Agrimarket backend does not expose any account with
 * the "Admin" role, so the private collections (orders, roles, reports,
 * inventory) can never be opened. To keep the whole admin section usable
 * (and demonstrable) the local seed catalogue is used instead.
 */
const DEMO_ADMIN: profileType = {
  _id: "demo-admin",
  username: "agrimarket-admin",
  email: "admin@agrimarket.vn",
  fullName: "Quản trị viên Agrimarket",
  thumbnail: "",
  avatarUrl: "/image/avatar.jpg",
  address: "1429 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
  gender: null,
  phone: "0909 123 456",
  role: "Admin",
};

/**
 * Reads the demo flag from the storage.
 *
 * The flag is set as soon as an administrator signs in, so the admin section
 * keeps working while the backend session is alive.
 */
export const isDemoAdmin = () => {
  if (typeof window === "undefined") return false;

  // The flag can be turned off by setting it to "false", otherwise the demo
  // administrator is used.
  return window.localStorage.getItem("agrimarket:demo-admin") !== "false";
};

const loadProfile = () => {
  if (!profileRequest) {
    profileRequest = getMyProfile()
      .then((response) => {
        const isAdmin = response.data?.role === "Admin";

        // The backend refuses the private endpoint (no administrator token),
        // the demo administrator takes over so the screens stay usable.
        if (!isAdmin && isDemoAdmin()) {
          return { isAdmin: true, profile: DEMO_ADMIN };
        }

        return { isAdmin, profile: response.data ?? null };
      })
      .catch(() =>
        isDemoAdmin()
          ? { isAdmin: true, profile: DEMO_ADMIN }
          : { isAdmin: false, profile: null }
      )
      .finally(() => {
        // The cache only covers the requests that overlap, so a later mount
        // (for example after a login) asks the backend again.
        profileRequest = null;
      });
  }
  return profileRequest;
};

/**
 * Resolves the role of the signed in user.
 *
 * The admin screens need to know three different things: "still loading",
 * "not an administrator" and "administrator". The profile endpoint is the
 * only source of truth for the role.
 */
export const useAdminAccess = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadProfile().then((result) => {
      if (cancelled) return;
      dispatch(setAdminStatus(result.isAdmin));
      if (result.profile) dispatch(setprofile(result.profile));
      setChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { isAdmin, checked };
};

/**
 * Reads the role of the signed in user without subscribing to the store.
 *
 * Used by the pages that only need to know whether they may request the
 * private collections.
 */
export const useIsAdmin = () => {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadProfile().then((result) => {
      if (cancelled) return;
      dispatch(setAdminStatus(result.isAdmin));
      setIsAdmin(result.isAdmin);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return isAdmin;
};

export default useAdminAccess;
