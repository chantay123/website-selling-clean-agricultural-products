import { Button, Form, Input } from "antd";
import { BG } from "../../../../constants/images";
import "tailwindcss/tailwind.css";
import { MailOutlined } from "@ant-design/icons";
import "./sytle.scss";

const ForgotPassword = () => {
  return (
    <div className=" login w-screen h-screen relative">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-16  xs:px-5  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-1/2 sm:w-[43%] sm:mt-20 md:w-[50%] md:mt-1 md:px-8 lg:w-[40%] xl:w-[23%] "
      >
        <h1 className="text-4xl mb-3 font-bold ss:text-[30px] ss:mt-12 xs:text-[34px] md:text-4xl ">
          Forgot Password
        </h1>
        <p className="xs:text-[10px] md:text-[12px] ">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <Form.Item
          className="text-xs pt-10 pb-5 xs:pt-5"
          name="username"
          rules={[{ required: true, message: "Wrong email!" }]}
        >
          <Input
            prefix={<MailOutlined className="mr-2" />}
            placeholder="johnpham@gmail.com"
          />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold text-white bg-green-400 "
          >
            Continue
          </Button>
          <p className="text-center p-2 font-bold xs:text-[8px]">Or</p>
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

export default ForgotPassword;
