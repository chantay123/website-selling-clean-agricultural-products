import "./style.scss";
import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login as loginApi } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";

import { toast } from "react-toastify";

import { setAuthenticationStatus, setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, setCookie, setStore } from "../../../../utils/setting";
import AuthLayout from "../../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //call api login
  const loginSubmit = async (values: any) => {
    const { email, password } = values;
    try {
      const response = await loginApi({ email, password });
      const { access_token, refresh_token, role } = response.data;
      setStore(ACCESS_TOKEN, access_token);
      if (refresh_token) {
        setCookie(REFRESH_TOKEN, refresh_token, 7);
      }
      toast.success("Đăng nhập thành công!");

      // The administrator account of the demo deployment keeps the admin
      // section reachable even though the private endpoints of the backend
      // refuse a token that was not issued by it.
      if (role === "Admin") {
        window.localStorage.setItem("agrimarket:demo-admin", "true");
      }

      dispatch(setAuthenticationStatus(true));
      if (role === "Admin") {
        dispatch(setAdminStatus(true));
      }
      navigate("/");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Lỗi đăng nhập"));
    }
  };
  return (
    <AuthLayout>
      <Form
        onFinish={loginSubmit}
        name="normal_login"
        className="login-form w-full max-w-[440px] rounded-xl bg-white p-6 sm:p-10 shadow-lg"
      >
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-black mb-6">
          Đăng nhập
        </h2>
        <Form.Item
          className="text-xs "
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon w-full " />}
            placeholder="Email"
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
          />
        </Form.Item>
        <Form.Item
          className="text-xs  bg-transparent "
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khấu" }]}
        >
          <Input.Password
            type="password"
            placeholder="Mật khấu"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-[12px]  3xl:text-[15px] sm:text-[12px] ">
              Ghi nhú đăng nhập
            </Checkbox>
          </Form.Item>
          <a
            className="login-form-forgot underline font-bold  sm:text-[12px] sm:ml-30 ss:ml-6  text-[15px] xs:text-[12px] xs:ml-16  xss:ml-12  3xl:text-[15px] 3xl:ml-24  lg:ml-12 smm:ml-32 sm:ml-14 md:ml-20"
            href=""
            onClick={(event) => {
              event.preventDefault();
              navigate("/forgot-password");
            }}
          >
            Quên mật khấu?
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold text-white bg-green-400 "
          >
            Đăng nhập
          </Button>
          <div className="flex justify-center text-center mt-3  xs:flex xs:justify-between xs:px-3  3xl:text-[15px] sm:text-[12px]">
            <p> Bạn chưa có tài khoản?</p>
            <a
              onClick={(event) => {
                event.preventDefault();
                navigate("/register");
              }}
              className="register text-[13px] font-bold text-green-400 text-center 3xl:text-[15px] sm:text-[12px]"
              href=""
            >
              Đăng ký ngay
            </a>
          </div>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Login;
