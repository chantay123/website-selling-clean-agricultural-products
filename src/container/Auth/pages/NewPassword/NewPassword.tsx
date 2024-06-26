import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "tailwindcss/tailwind.css";
import { BG } from "../../../../constants/images";
import "./style.scss";
import requestApi from "../../../../utils/interceptors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsFogotPassword } from "../../../../redux/userReducer/userReducer";

const NewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sumbmitnNewPassword = async (values: any) => {
    const { email, password, confirm_password } = values;
    try {
      const response = await requestApi("users/password/reset", "POST", {
        email,
        password,
        confirm_password,
      });
      const { message } = response.data;
      toast.success(message);
      navigate("/");
      dispatch(setIsFogotPassword(false));
    } catch (error: any) {
      const { message } = error.response.data;
      let receivedmessage = message;
      console.log(error);
      const { status } = error.response;
      if (status == 422) {
        const { msg } =
          error.response.data.errors.email ||
          error.response.data.errors.password ||
          error.response.data.errors.confirm_password;
        receivedmessage = msg;
      }
      toast.error(receivedmessage);
    }
  };
  return (
    <div className=" login w-screen h-screen relative">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <Form
        onFinish={sumbmitnNewPassword}
        name="normal_login"
        className=" login-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white  xs:px-5  xs:w-full xs:h-full xs:p-20 ss:p-5 ss:w-[80%] ss:h-auto  xss:w-[80%]  smm:w-1/2 sm:w-[43%] sm:mt-20 md:w-[50%] md:mt-1 md:px-8 lg:w-[40%] xl:w-[23%]  "
      >
        <h2 className="text-black clear-both  text-4xl font-bold not-italic mb-3 mt-3 xs:text-[28px] 3xl:text-4xl ">
          Create new password
        </h2>
        <p className="text-black font-popins text-sm mt-2  font-medium xs:text-xs ">
          Set the news password for your account so you can sign in and access
          all features.
        </p>
        <Form.Item
          className="text-xs   xs:pt-5"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 rounded-full h-12 "
            prefix={<MailOutlined className="mr-2" />}
            placeholder="johnpham@gmail.com"
          />
        </Form.Item>
        <Form.Item
          className="text-xs  "
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
            type="password"
            placeholder="Password"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[
            { required: true, message: "Please input your confirm Password!" },
          ]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
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
          <div className="flex justify-center items-center my-6">
            <hr className="w-full border-[1px]" />
            <span className="mx-4 text-base font-bold">Or</span>
            <hr className="w-full border-[1px]" />
          </div>
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
