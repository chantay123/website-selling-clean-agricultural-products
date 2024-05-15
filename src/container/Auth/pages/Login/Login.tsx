import "./style.scss";
import { Button, Checkbox, Form, Input } from "antd";
import { BG } from "../../../../constants/images";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import requestApi from "../../../../utils/interceptors";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  setCookie,
  setStore,
} from "../../../../utils/setting";
import { toast } from "react-toastify";

import { setAuthenticationStatus } from "../../../../redux/userReducer/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
``;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //call api login
  const loginSubmit = async (values: any) => {
    const { username, password } = values;
    try {
      const response = await requestApi("users/login", "POST", {
        email: username,
        password: password,
      });

      const { access_token, refresh_token } = response.data.data;
      setStore(ACCESS_TOKEN, access_token);
      setCookie(REFRESH_TOKEN, refresh_token, 7);

      const { message } = response.data;
      toast.success(message);
      dispatch(setAuthenticationStatus(true));
      navigate("/");
    } catch (error: any) {
      const { message } = error.response.data;
      let receivedmessage = message;
      const { status } = error.response;
      if (status == 422) {
        const { msg } = error.response.data.errors.password;
        receivedmessage = msg;
      }
      toast.error(receivedmessage);
    }
  };
  return (
    <div className=" login w-screen h-screen relative ">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        onFinish={loginSubmit}
        name="normal_login"
        className=" login-form  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl  bg-white  xs:px-3  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-2/3 sm:w-[43%]  md:w-[50%]  md:px-8 lg:w-[40%]  lg:p-12 xl:w-[25%] "
      >
        <h2 className="text-center text-4xl xs:mb-6 font-bold xs:text-3xl xs:mt-5 lg:mt-3 text-black  text-8xl  ">
          Login
        </h2>
        <Form.Item
          className="text-xs "
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon w-full " />}
            placeholder="Username"
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
          />
        </Form.Item>
        <Form.Item
          className="text-xs  bg-transparent "
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            type="password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-[12px]  3xl:text-[15px] sm:text-[12px] ">
              Remember me
            </Checkbox>
          </Form.Item>
          <a
            className="login-form-forgot underline font-bold  sm:text-[12px] sm:ml-30 ss:ml-6  text-[15px] xs:text-[12px] xs:ml-16 xss:ml-12  3xl:text-[15px] 3xl:ml-24  lg:ml-12 smm:ml-32 sm:ml-14 md:ml-20"
            href=""
          >
            Forgot password?
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold text-white bg-green-400 "
          >
            Log in
          </Button>
          <div className="flex justify-center text-center mt-3  xs:flex xs:justify-between xs:px-3  3xl:text-[15px] sm:text-[12px]">
            <p> Don't have an account?</p>
            <a
              onClick={() => {
                navigate("/register");
              }}
              className="register text-[13px] font-bold text-green-400 text-center 3xl:text-[15px] sm:text-[12px]"
              href=""
            >
              Register now
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
