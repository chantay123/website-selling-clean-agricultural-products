import { BG } from "../../../../constants/images";
import "tailwindcss/tailwind.css";
import "./style.scss";
import { Button, Form, Input } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
const Register = () => {
  return (
    <div className="Main w-screen h-screen">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />

      <Form
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-16 xs:px-3  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-1/2 sm:w-[43%] sm:mt-20 md:w-[50%] md:mt-1 md:px-8 lg:w-[40%]   xl:w-[22%]"
      >
        <h1 className="text-center text-4xl mb-8 font-bold">Sign up</h1>
        <Form.Item
          className="text-xs"
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={
              <UserOutlined className="site-form-item-icon w-full mr-2" />
            }
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="Email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            type="Email"
            placeholder="Email"
            prefix={<MailOutlined className=" mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your  Password!" }]}
        >
          <Input
            type=""
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm password"
          rules={[
            {
              required: true,
              message: "Please input your Confirm Password!",
            },
          ]}
        >
          <Input
            type="password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Please input your Phone!" }]}
        >
          <Input
            type="phone"
            placeholder="Phone"
            prefix={<PhoneOutlined className="mr-2" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full bg-green-400 text-white font-bold border-white "
          >
            Sign up
          </Button>
          <div className="flex justify-center text-center mt-3">
            <p> Don't have an account?</p>
            <a
              className="register text-[13px] font-bold text-green-400 text-center ml-2"
              href="../Login/Login.tsx"
            >
              Register now
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
