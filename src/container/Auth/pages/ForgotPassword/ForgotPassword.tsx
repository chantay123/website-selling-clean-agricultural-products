import { Button, Form, Input } from "antd";
import "tailwindcss/tailwind.css";
import { MailOutlined } from "@ant-design/icons";
import "./sytle.scss";
import { forgotPassword as forgotPasswordApi } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsFogotPassword } from "../../../../redux/userReducer/userReducer";
import AuthLayout from "../../components/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ForgotPassword = async (values: any) => {
    const { email } = values;
    try {
      const response = await forgotPasswordApi(email);
      const { message } = response;
      toast.success(message);
      navigate("/verification");
      dispatch(setIsFogotPassword(true));
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Lỗi quên mật khẩu"));
    }
  };

  return (
    <AuthLayout>
      <Form
        onFinish={ForgotPassword}
        name="normal_login"
        className="login-form w-full max-w-[440px] rounded-xl bg-white p-6 sm:p-10 shadow-lg"
      >
        <h2 className="text-black clear-both text-3xl sm:text-4xl font-bold mb-6">
          Forgot Password
        </h2>
        <p className="text-black font-popins text-base font-medium">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <Form.Item
          className="text-xs pt-10 pb-5"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 rounded-full h-12"
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
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;
