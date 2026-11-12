import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "tailwindcss/tailwind.css";
import "./style.scss";
import { resetPassword as resetPasswordApi } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsFogotPassword } from "../../../../redux/userReducer/userReducer";
import AuthLayout from "../../components/AuthLayout";

const NewPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sumbmitnNewPassword = async (values: any) => {
    const { email, password, confirm_password } = values;
    try {
      const response = await resetPasswordApi({
        email,
        password,
        confirm_password,
      });
      const { message } = response;
      toast.success(message);
      navigate("/");
      dispatch(setIsFogotPassword(false));
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Lỗi đăng nhập"));
    }
  };
  return (
    <AuthLayout>
      <Form
        onFinish={sumbmitnNewPassword}
        name="normal_login"
        className="login-form w-full max-w-[440px] rounded-xl bg-white p-6 sm:p-10 shadow-lg"
      >
        <h2 className="text-black clear-both text-3xl sm:text-4xl font-bold not-italic mb-3">
          Tạo mật khấu mới
        </h2>
        <p className="text-black font-popins text-sm mt-2 font-medium">
          Thiết lập mật khấu mới cho tài khoản của bạn để đăng nhập và sử dụng đầy đủ tính năng.
        </p>
        <Form.Item
          className="text-xs"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 rounded-full h-12"
            prefix={<MailOutlined className="mr-2" />}
            placeholder="email@agrimarket.vn"
          />
        </Form.Item>
        <Form.Item
          className="text-xs  "
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khấu" }]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
            type="password"
            placeholder="Mật khấu"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[{ required: true, message: "Vui lòng xác nhận lại mật khấu" }]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-14"
            type="password"
            placeholder="Xác nhận mật khấu"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full font-bold text-white bg-green-400 "
          >
            Tiếp tục
          </Button>
          <div className="flex justify-center items-center my-6">
            <hr className="w-full border-[1px]" />
            <span className="mx-4 text-base font-bold">Hoặc</span>
            <hr className="w-full border-[1px]" />
          </div>
          <Button
            htmlType="button"
            onClick={() => navigate("/login")}
            className="login-form-button w-full font-bold  "
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default NewPassword;
