import { CameraOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Form,
  Input,
  Layout,
  Radio,
  RadioChangeEvent,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { BG } from "../../../constants/images";
import "./style.scss";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/config";
import { useEffect, useState } from "react";

import requestApi from "../../../utils/interceptors";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";

const MainProfile = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const [userData, setUserData] = useState({
    email: "",
    full_name: "",
    phone: "",
    address: "",
    avatar: "",
    cover_photo: "",
    gender: "Male",
  });

  const onChange = (e: RadioChangeEvent) => {
    setUserData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };
  const onFinish = async (value: any) => {
    const loadingToast = toast.loading("Updating....");
    const { address } = value;
    const response = await requestApi("users/@me/profile", "PUT", {
      full_name: userData.full_name,
      phone: userData.phone,
      gender: userData.gender,
      avatar: userData.avatar,
      thumbnail: userData.cover_photo,
      address: address,
    });
    const { message } = response.data;
    try {
      toast.update(loadingToast, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      const { message } = error.respone.data;
      let errMessage = message;
      if (error.response.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        const { msg } = error.response.data.errors.address;
        errMessage = msg;
      }
      toast.update(loadingToast, {
        render: errMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const profile = async () => {
    try {
      const response = await requestApi("users/@me/profile", "GET", {});
      const data = response.data.data;
      setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    profile();
  }, []);

  return (
    <Layout className="min-h-screen overflow-hidden">
      <Layout>
        <Content className="bg-blue-900">
          <div className="w-screen ">
            <input style={{ display: "none" }} />
            <img className="w-full h-52 object-cover" src={BG.MAIN_BG} alt="" />
            <Button
              className="absolute btn-cover right-10 top-5 border-white border-2 bg-gray-opacity font-popins text-white"
              icon={<CameraOutlined />}
            >
              Change Cover
            </Button>
          </div>
          <div>
            <Form
              className="mt-6"
              name="basic"
              initialValues={{ ...userData }}
              onFinish={onFinish}
              fields={[
                {
                  name: ["email"],
                  value: userData.email,
                },
                {
                  name: ["full_name"],
                  value: userData.full_name,
                },
                {
                  name: ["phone"],
                  value: userData.phone,
                },
                {
                  name: ["address"],
                  value: userData.address,
                },
              ]}
            >
              <div className="relative ">
                <img
                  className="absolute xs:-top-32 lg:-top-40 xs:left-3 lg:left-32 3xl:-top-[16rem] z-10 rounded-full lg:w-[150px] lg:h-[150px]  xs:w-[80px] xs:h-[80px] "
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
                  alt=""
                />
                <span className="absolute mt-[30px] ml-[30px] xs:-top-[85px] lg:-top-[115px] 3xl:-top-[180px] xl:-top-[110px] xs:left-28 lg:left-64 xl:left-64 3xl:left-72 z-10 text-xl font-popins text-white">
                  Tay Phan
                </span>
                <input name="image" style={{ display: "none" }} />
                <Button
                  className="absolute btn-avatar mt-[30px] ml-[30px] xs:-top-20 smm:-top-[70px] lg:-top-[100px] xl:-top-[75px] 3xl:-top-[135px] xs:left-16 smm:left-[70px] lg:left-52 xl:left-52 3xl:left-56 z-10 bg-blue-700 text-white rounded-full p-0 m-0 border-4 border-blue-900"
                  icon={<CameraOutlined />}
                ></Button>
                <div className="w-full xs:mt-20 lg:mt-24 3xl:mt-44 3xl:px-40 lg:px-40 xs:px-5 mt-3">
                  <div className="flex flex-col w-full lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                        Email
                      </h3>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: (
                              <Alert
                                className="bg-transparent xs:text-xs lg:text-base text-red-700"
                                message="Please input your username"
                                banner
                                type="error"
                              />
                            ),
                          },
                        ]}
                        className="border-2 rounded-lg border-white w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12  border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none "
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                        Full name
                      </h3>
                      <Form.Item
                        name="full_name"
                        className="border-2 rounded-lg border-white w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none "
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col w-full lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                        Phone
                      </h3>
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: (
                              <Alert
                                className="bg-transparent xs:text-xs lg:text-base text-red-700"
                                message="Please input your phone"
                                banner
                                type="error"
                              />
                            ),
                          },
                        ]}
                        className="border-2 rounded-lg border-white mb-8 flex flex-col w-[660px] "
                      >
                        <Input
                          className="  h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none "
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col w-full lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                        Address
                      </h3>
                      <Form.Item
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: (
                              <Alert
                                className="bg-transparent xs:text-xs lg:text-base text-red-700"
                                message="Please input your address"
                                banner
                                type="error"
                              />
                            ),
                          },
                        ]}
                        className="border-2 rounded-lg border-white w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative flex mt-3">
                      <h3 className="text-white xs:text-sm ss:text-base">
                        Gender
                      </h3>
                      <Form.Item className="xs:ml-8 lg:ml-20">
                        <Radio.Group
                          onChange={onChange}
                          value={userData.gender}
                        >
                          <Radio
                            value="Male"
                            className="text-white font-popins"
                            checked={userData.gender === "Male"}
                          >
                            Male
                          </Radio>
                          <Radio
                            value="Female"
                            className="3xl:ml-20 lg:ml-10 xs:mt-2 ss:mt-0 text-white font-popins"
                            checked={userData.gender === "Female"}
                          >
                            Female
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Form.Item className="mt-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="h-12 w-60 border-2 border-white rounded-full font-popins text-base btn-hover"
                      >
                        Update
                      </Button>
                    </Form.Item>
                    <Form.Item className="mt-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="h-12 w-60 border-2 border-white rounded-full font-popins text-base btn-hover"
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Back Home
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainProfile;
