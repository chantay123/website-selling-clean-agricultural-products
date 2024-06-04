import Layout from "antd/es/layout/layout";
import "tailwindcss/tailwind.css";
import "./style.scss";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Badge, Dropdown, MenuProps } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import requestApi from "../../utils/interceptors";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  clearCookie,
  clearStore,
  getCookie,
} from "../../utils/setting";
import {
  setAuthenticationStatus,
  setprofile,
} from "../../redux/userReducer/userReducer";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const HearderItem = () => {
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
          Change Password{" "}
        </a>
      ),
    },
    {
      key: "3",
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
      const refresh_token = getCookie(REFRESH_TOKEN);
      const response = await requestApi("users/logout", "POST", {
        refresh_token,
      });
      const { message } = response.data;
      toast.success(message);
      dispatch(setAuthenticationStatus(false));
      clearStore(ACCESS_TOKEN);
      clearCookie(REFRESH_TOKEN);
    } catch (error) {
      console.log(error);
    }
  };
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const fetchAvatar = async () => {
    try {
      const response = await requestApi("users/@me/profile", "GET", {});
      const avatar = response.data.data;
      dispatch(setprofile(avatar));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAvatar();
  }, []);
  const isprofile = useSelector((state: RootState) => state.user.profile);
  return (
    <Layout className="bg-white background p-3 drop-shadow-xl fixed z-10 w-full">
      <div className="ml-[80px] mr-[80px] flex items-center justify-between ">
        <h1 className=" text-[2.5rem] font-bold ">Fruitables</h1>

        <div>
          <ul className="flex text-base">
            <li>
              <NavLink to="/" className=" p-4 ">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className="p-4">
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/product-detail" className="p-4">
                Shop Detail
              </NavLink>
            </li>
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

        <div>
          {isAuthenticated === true ? (
            <div className=" flex items-center">
              <a href="#" className=" mr-10 relative">
                <Badge count={1}>
                  <i className="w-6 h-24">
                    <ShoppingCartOutlined
                      onClick={() => {
                        navigate("/PayMent");
                      }}
                    />
                  </i>
                </Badge>
              </a>
              <div className=" flex items-center  ">
                <Dropdown menu={{ items }}>
                  <Avatar
                    className="border"
                    src={isprofile?.avatar}
                    size="large"
                    icon={<UserOutlined />}
                  />
                </Dropdown>
                <p className=" ml-2 text-base">{isprofile?.full_name} </p>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                type="submit"
                className=" btn-login border-2 border-secondary py-2 px-10 rounded-full text-orange-500 "
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("./register");
                }}
                type="submit"
                className="btn-login  border-2 border-secondary py-2 px-8 rounded-full text-orange-500 ml-2  "
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HearderItem;
