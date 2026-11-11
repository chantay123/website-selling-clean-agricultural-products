import { Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { changePassword as changePasswordApi } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

const ChangePassword = () => {
  const navigate = useNavigate();
  const changepassWordSubmit = async (value: any) => {
    const { old_password, password, confirm_password } = value;
    try {
      const response = await changePasswordApi({
        old_password,
        password,
        confirm_password,
      });
      const { message } = response;
      toast.success(message);
      navigate("/");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Lỗi đổi mật khẩu"));
    }
  };
  return (
    <AuthLayout>
      <Form
        onFinish={changepassWordSubmit}
        name="normal_login"
        className="login-form w-full max-w-[440px] rounded-xl bg-white p-6 sm:p-10 shadow-lg"
      >
        <h2 className="text-black clear-both text-3xl sm:text-4xl font-bold not-italic mb-3">
          Change password
        </h2>
        <p className="text-black font-popins text-sm mt-2 font-medium">
          Set the news password for your account so you can sign in and access
          all features.
        </p>
        <Form.Item
          className="text-xs"
          name="old_password"
          rules={[
            { required: true, message: "Please input your old_password!" },
          ]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 rounded-full h-12"
            prefix={<LockOutlined className="mr-2" />}
            placeholder="Old Password"
          />
        </Form.Item>
        <Form.Item
          className="text-xs  "
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
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
            className="3xl:text-base bg-gray-300 w-full py-2 px-4 text-base font-normal border-0 h-12 rounded-full"
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
            htmlType="button"
            onClick={() => navigate("/login")}
            className="login-form-button w-full font-bold"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ChangePassword;
