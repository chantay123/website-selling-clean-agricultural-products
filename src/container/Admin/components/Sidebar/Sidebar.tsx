import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAuthenticationStatus,
} from "../../../../redux/userReducer/userReducer";
import { logout as logoutApi } from "../../../../apis";
import { REFRESH_TOKEN, getCookie } from "../../../../utils/setting";
import { clearTokens } from "../../../../utils/interceptors";
import { toast } from "react-toastify";

/** One entry of the admin navigation. */
type NavItem = {
  label: string;
  path: string;
  icon: JSX.Element;
};

/** Wraps the children of an SVG path so every icon shares the same look. */
const icon = (path: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

/**
 * Navigation of the admin section.
 *
 * The active entry is derived from the current route so the highlight always
 * matches the screen the administrator is looking at.
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const primary: NavItem[] = [
    {
      label: "Tổng quan",
      path: "/admin",
      icon: icon(
        "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
      ),
    },
    {
      label: "Sản phẩm",
      path: "/productadmin",
      icon: icon(
        "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      ),
    },
    {
      label: "Danh mục",
      path: "/categoryadmin",
      icon: icon(
        "M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878M4.5 9v.878m15-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
      ),
    },
    {
      label: "Nhà cung cấp",
      path: "/supplieradmin",
      icon: icon(
        "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      ),
    },
    {
      label: "Tồn kho",
      path: "/stock",
      icon: icon(
        "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
      ),
    },
    {
      label: "Đơn hàng",
      path: "/orderadmin",
      icon: icon(
        "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      ),
    },
    {
      label: "Báo cáo",
      path: "/report",
      icon: icon(
        "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      ),
    },
    {
      label: "Bài viết",
      path: "/blogadmin",
      icon: icon(
        "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      ),
    },
    {
      label: "Banner",
      path: "/banneradmin",
      icon: icon(
        "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5M3.75 6.75v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V6.75"
      ),
    },
    {
      label: "Từ khoá",
      path: "/hashtagadmin",
      icon: icon(
        "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281a1.125 1.125 0 00-.644-.87 6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.723 7.723 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827c-.424-.35-.534-.955-.26-1.43l1.298-2.247a1.125 1.125 0 011.369.491l1.217.456c.356.133.75.072 1.076-.124.072-.044.146-.086.22-.128.331-.183.582-.495.644-.869l.214-1.28z"
      ),
    },
    {
      label: "Vai trò",
      path: "/role",
      icon: icon(
        "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      ),
    },
  ];

  const secondary: NavItem[] = [
    {
      label: "Về trang bán hàng",
      path: "/",
      icon: icon(
        "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      ),
    },
  ];

  /** Highlights the entry matching the current route. */
  const isActive = (item: NavItem) => location.pathname === item.path;

  const handleLogout = async () => {
    try {
      const refreshToken = getCookie(REFRESH_TOKEN);
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      clearTokens();
      dispatch(setAuthenticationStatus(false));
      toast.success("Đăng xuất thành công");
    } catch (error) {
      clearTokens();
      dispatch(setAuthenticationStatus(false));
      toast.error("Lỗi đăng xuất");
    }
    navigate("/login");
  };

  const renderItem = (item: NavItem) => (
    <button
      key={item.label}
      type="button"
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
        isActive(item)
          ? "bg-green-100 text-gray-900"
          : "text-gray-700 hover:bg-green-50"
      }`}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="text-base font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="bg-white w-64 h-full min-h-screen lg:h-screen p-4 lg:p-6 flex flex-col overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Agrimarket</h2>
        <p className="text-sm text-gray-500">Trang quản trị</p>
      </div>

      <div className="space-y-1 flex-1">
        <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">
          Quản lý
        </div>
        {primary.map(renderItem)}
      </div>

      <div className="space-y-1 mt-6">
        <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">
          Khác
        </div>
        {secondary.map(renderItem)}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
