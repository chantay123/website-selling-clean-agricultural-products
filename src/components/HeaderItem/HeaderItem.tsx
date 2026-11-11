import Layout from "antd/es/layout/layout";
import "tailwindcss/tailwind.css";
import "./style.scss";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Badge, Dropdown, MenuProps } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { getMyProfile, logout as logoutApi } from "../../apis";
import { REFRESH_TOKEN, getCookie } from "../../utils/setting";
import { clearTokens } from "../../utils/interceptors";
import {
  setAuthenticationStatus,
  setprofile,
} from "../../redux/userReducer/userReducer";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const HearderItem = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          className="text-base"
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          className="text-base"
          onClick={() => {
            navigate("/changepassword");
          }}
        >
          Change Password
        </a>
      ),
    },
    // {
    //   key: "3",
    //   label: (
    //     <a
    //       className="text-base"
    //       onClick={() => {
    //         navigate("./myfavorite");
    //       }}
    //     >
    //       My favorite product
    //     </a>
    //   ),
    // },
    {
      key: "4",
      label: (
        <a
          className="text-base"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </a>
      ),
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const refreshToken = getCookie(REFRESH_TOKEN);
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      clearTokens();
      toast.success("Đăng xuất thành công");
      dispatch(setAuthenticationStatus(false));
    } catch (error: any) {
      console.error("Logout failed:", error);
      clearTokens();
      dispatch(setAuthenticationStatus(false));
      toast.error("Lỗi đăng xuất");
    }
  };

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const cartnumber = useSelector((state: RootState) => state.user.cartnumber);
  const fetchAvatar = async () => {
    try {
      const response = await getMyProfile();
      dispatch(setprofile(response.data));
    } catch (error) {
      console.log("Error fetching avatar:", error);
    }
  };

  useEffect(() => {
    // The profile is a private resource. Requesting it for a guest would
    // answer with a 401 and the interceptor would send the visitor to the
    // login page even though there is nothing to log into.
    if (!isAuthenticated) return;

    fetchAvatar();
  }, [isAuthenticated]);

  const isprofile = useSelector((state: RootState) => state.user.profile);

  /** Closes the mobile drawer whenever the route changes. */
  const { pathname } = useLocation();
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/blog", label: "Blog" },
  ];

  return (
    <Layout className="bg-white background p-3 drop-shadow-xl sticky top-0 z-30 w-full">
      <div className="mx-4 sm:mx-6 lg:mx-20 flex items-center justify-between">
        <h1 className="text-2xl sm:text-4xl font-bold shrink-0">Fruitables</h1>

        {/* Desktop navigation */}
        <div className="hidden lg:block">
          <ul className="flex text-base">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="p-4">
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a className="item p-4" href="#">
                Contact
              </a>
            </li>
            <li>
              <a className="item p-4" href="#">
                Knowledge
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center">
          {isAuthenticated === true ? (
            <div className="flex items-center">
              <a href="#" className="mr-4 sm:mr-10 relative">
                <Badge count={cartnumber}>
                  <i className="w-6 h-24">
                    <ShoppingCartOutlined
                      onClick={() => {
                        navigate("/PayMent");
                      }}
                    />
                  </i>
                </Badge>
              </a>
              <div className="flex items-center">
                <Dropdown menu={{ items }}>
                  <Avatar
                    className="border"
                    src={isprofile?.avatarUrl}
                    size="large"
                    icon={<UserOutlined />}
                  />
                </Dropdown>
                <p className="ml-2 text-base hidden sm:block">
                  {isprofile?.username}{" "}
                </p>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                type="submit"
                className="btn-login border-2 border-secondary py-2 px-6 lg:px-10 rounded-full text-orange-500"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("./register");
                }}
                type="submit"
                className="btn-login border-2 border-secondary py-2 px-5 lg:px-8 rounded-full text-orange-500 ml-2"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden ml-3 p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-gray-100">
          <ul className="flex flex-col text-base">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-3"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a className="block px-2 py-3" href="#">
                Contact
              </a>
            </li>
            <li>
              <a className="block px-2 py-3" href="#">
                Knowledge
              </a>
            </li>
          </ul>

          {!isAuthenticated && (
            <div className="flex gap-3 px-2 pb-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                type="button"
                className="btn-login flex-1 border-2 border-secondary py-2 px-4 rounded-full text-orange-500"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/register");
                }}
                type="button"
                className="btn-login flex-1 border-2 border-secondary py-2 px-4 rounded-full text-orange-500"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default HearderItem;
