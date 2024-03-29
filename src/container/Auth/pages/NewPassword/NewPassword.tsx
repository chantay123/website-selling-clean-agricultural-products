import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "tailwindcss/tailwind.css";
import { BG } from "../../../../constants/images";
import "./style.scss";

const NewPassword = () => {
  return (
    <div className=" login w-screen h-screen relative">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white  xs:px-5  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-1/2 sm:w-[43%] sm:mt-20 md:w-[50%] md:mt-1 md:px-8 lg:w-[40%] xl:w-[23%]  "
      >
        <h1 className=" text-3xl mb-3 font-bold xs:text-2xl">
          Create new password
        </h1>
        <p className="xs:text-[12px] md:text-[12px]">
          Set the news password for your account so you can sign in and access
          all features.
        </p>

        <Form.Item
          className="text-xs pt-8 "
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            type="password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm password"
          rules={[
            { required: true, message: "Please input your confirm Password!" },
          ]}
        >
          <Input
            type="password"
            placeholder="confirm Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold text-white bg-green-400 "
          >
            Continue
          </Button>
          <p className="text-center p-2 text-gray-400 font-bold xs:text-[10px]">
            Or
          </p>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold  "
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewPassword;
