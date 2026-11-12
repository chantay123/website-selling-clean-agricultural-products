import "tailwindcss/tailwind.css";
import "./style.scss";
import { Button, Form, Input } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { register as registerApi } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const registerSubmit = async (values: any) => {
    const { email, password, confirm_password, phone, full_name } = values;
    try {
      const response = await registerApi({
        email,
        password,
        confirm_password,
        phone,
        full_name,
      });

      const { message } = response;
      toast.success(message);
      navigate("/login");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Lỗi đăng nhập"));
    }
  };

  return (
    <AuthLayout>
      <Form
        onFinish={registerSubmit}
        name="normal_login"
        className="login-form w-full max-w-[440px] rounded-xl bg-white p-6 sm:p-10 shadow-lg"
      >
        <h1 className="text-center text-3xl sm:text-4xl mb-6 font-bold">
          Đăng ký
        </h1>
        <Form.Item
          className="text-xs "
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên của bạn" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            prefix={
              <UserOutlined className="site-form-item-icon w-full mr-2" />
            }
            placeholder="Họ và tên"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khấu" }]}
        >
          <Input.Password
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="Password"
            placeholder="Mật khấu"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[{ required: true, message: "Vui lòng xác nhận lại mật khấu" }]}
        >
          <Input.Password
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="Password"
            placeholder="Xác nhận mật khấu"
            prefix={<LockOutlined className="site-form-item-icon mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="Email"
            placeholder="Email"
            prefix={<MailOutlined className=" mr-2" />}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input
            className="bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
            type="phone"
            placeholder="Số điện thoại"
            prefix={<PhoneOutlined className="mr-2" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button w-full bg-green-400 text-white font-bold border-white mt-5"
          >
            Đăng ký
          </Button>
          <div className="flex justify-center text-center mt-3 gap-2">
            <p> Bạn chưa có tài khoản?</p>
            <a
              className="register text-[13px] font-bold text-green-400 text-center"
              href=""
              onClick={(event) => {
                event.preventDefault();
                navigate("/login");
              }}
            >
              Đăng nhập
            </a>
          </div>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Register;
