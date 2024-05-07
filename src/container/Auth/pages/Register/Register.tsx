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
import requestApi from "../../../../utils/interceptors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const registerSubmit = async (values: any) => {
    const { full_name, email, password, confirm_password, phone } = values;

    try {
      const response = await requestApi("users/register", "POST", {
        full_name,
        email,
        password,
        confirm_password,
        phone,
      });

      const { message } = response.data;
      toast.success(message);
      navigate("/verification");
    } catch (error: any) {
      const { message } = error.response.data;
      let receivedmessage = message;

      const { status } = error.response;
      if (status == 422) {
        const { msg } =
          error.response.data.errors.full_name ||
          error.response.data.errors.email ||
          error.response.data.errors.confirm_password;
        receivedmessage = msg;
      }
      toast.error(receivedmessage);
    }
  };

  return (
    <div className="Main w-screen h-screen">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        onFinish={registerSubmit}
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-16 xs:px-3 xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-2/3 sm:w-[43%] sm:mt-20 md:w-[50%] md:mt-1 md:px-8 lg:w-[40%] xl:w-[25%]"
      >
        <h1 className="text-center text-4xl mb-8 font-bold">Sign up</h1>
        <Form.Item
          className="text-xs "
          name="full_name"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            prefix={
              <UserOutlined className="site-form-item-icon w-full mr-2" />
            }
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="Email"
            placeholder="Email"
            prefix={<MailOutlined className=" mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your  Password!" }]}
        >
          <Input.Password
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="Password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[
            {
              required: true,
              message: "Please input your Confirm Password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="password"
            placeholder="Confirm password"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Please input your Phone!" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="phone"
            placeholder="Phone"
            prefix={<PhoneOutlined className="mr-2" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full bg-green-400 text-white font-bold border-white mt-5"
          >
            Sign up
          </Button>
          <div className="flex justify-center text-center mt-3">
            <p> Don't have an account?</p>
            <a
              className="register text-[13px] font-bold text-green-400 text-center ml-2"
              href="../Login/Login.tsx"
            >
              Login now
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
