import "./style.scss";
import { Button, Checkbox, Form, Input } from "antd";
import { BG } from "../../../../constants/images";
import "tailwindcss/tailwind.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Login = () => {
  return (
    <div className=" login w-screen h-screen relative">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl  bg-white  xs:px-3  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-1/2 sm:w-[43%] sm:mt-20 md:w-[50%]  md:px-8 lg:w-[40%] xl:w-[23%] "
      >
        <h2 className="text-center text-4xl xs:mb-6 font-bold xs:text-3xl xs:mt-5 lg:mt-3 text-black  text-8xl  ">
          Login
        </h2>
        <Form.Item
          className="text-xs ml-2 "
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon w-full " />}
            placeholder="Username"
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
          />
        </Form.Item>
        <Form.Item
          className="text-xs ml-2 bg-transparent "
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            type="password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="text-[12px]  3xl:text-[15px] sm:text-[12px] ">
              Remember me
            </Checkbox>
          </Form.Item>
          <a
            className="login-form-forgot sm:text-[12px] sm:ml-30 ss:ml-12  text-[12px] xs:text-[12px] xs:ml-20 xss:ml-20  sm:ml-34 3xl:text-[15px] 3xl:ml-28  lg:ml-[135px] smm:ml-12"
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
              className="register text-[13px] font-bold text-green-400 text-center ml-2  3xl:text-[15px] sm:text-[12px]"
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
