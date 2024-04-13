import { CameraOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Layout, Radio, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";

const MainProfile = () => {
  return (
    <Row>
      <Col span={20} push={4}>
        <Layout className="min-h-screen overflow-hidden">
          <Layout>
            <Content className="bg-blue-900">
              <div className="">
                <input style={{ display: "none" }} />
                <Button
                  className="absolute btn-cover right-10 top-5 border-white border-2 bg-gray-opacity font-popins text-white"
                  icon={<CameraOutlined />}
                >
                  Change Cover
                </Button>
              </div>
              <form action="">
                <div className="relative">
                  <span className="absolute xs:-top-[85px] lg:-top-[115px] 3xl:-top-[180px] xl:-top-[110px] xs:left-28 lg:left-64 xl:left-64 3xl:left-72 z-10 text-xl font-popins text-white">
                    TAYLOR
                  </span>
                  <input name="image" style={{ display: "none" }} />
                  <Button
                    className="absolute btn-avatar xs:-top-20 smm:-top-[70px] lg:-top-[100px] xl:-top-[75px] 3xl:-top-[135px] xs:left-16 smm:left-[70px] lg:left-52 xl:left-52 3xl:left-56 z-10 bg-blue-700 text-white rounded-full p-0 m-0 border-4 border-blue-900"
                    icon={<CameraOutlined />}
                  ></Button>

                  <div className="w-full xs:mt-20 lg:mt-24 3xl:mt-44 3xl:px-40 lg:px-40 xs:px-5">
                    <div className="flex flex-col w-full lg:flex-row lg:gap-12 3xl:gap-16">
                      <div className="w-full relative">
                        <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                          Username
                        </h3>
                        <Form.Item
                          name="username"
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
                          <Input className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none" />
                        </Form.Item>
                      </div>
                      <div className="w-full relative">
                        <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                          Full name
                        </h3>
                        <Form.Item
                          name="fullname"
                          className="border-2 rounded-lg border-white w-full mb-8 flex flex-col"
                        >
                          <Input className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none " />
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
                          className="border-2 rounded-lg border-white w-full mb-8 flex flex-col"
                        >
                          <Input className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none " />
                        </Form.Item>
                      </div>
                      <div className="w-full relative">
                        <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                          Date of birth
                        </h3>
                        <Form.Item
                          name="date_of_birth"
                          rules={[
                            {
                              required: true,
                              message: (
                                <Alert
                                  className="bg-transparent xs:text-xs lg:text-base text-red-700"
                                  message="Please input your date of birth"
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
                            placeholder="YYYY-MM-DD"
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
                          <Input className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none" />
                        </Form.Item>
                      </div>
                      <div className="w-full relative flex mt-3">
                        <h3 className="text-white xs:text-sm ss:text-base">
                          Gender
                        </h3>
                        <Form.Item className="xs:ml-8 lg:ml-20">
                          {/* <Radio.Group onChange={onChange} value={gender}> */}
                          <Radio
                            value="Male"
                            className="text-white font-popins"
                          >
                            Male
                          </Radio>
                          <Radio
                            value="Female"
                            className="3xl:ml-20 lg:ml-10 xs:mt-2 ss:mt-0 text-white font-popins"
                            // checked={gender === 'Female'}
                          >
                            Female
                          </Radio>
                          {/* </Radio.Group> */}
                        </Form.Item>
                      </div>
                    </div>

                    <div className="flex flex-col w-full lg:flex-row lg:gap-12 3xl:gap-16">
                      <div className="w-full relative">
                        <h3 className="absolute -top-3 left-3 px-2 mb-0 text-white bg-blue-900 z-10 rounded-md">
                          Bio
                        </h3>
                        <Form.Item
                          name="bio"
                          rules={[
                            {
                              required: true,
                              message: (
                                <Alert
                                  className="bg-transparent xs:text-xs lg:text-base text-red-700"
                                  message="Please input your bio"
                                  banner
                                  type="error"
                                />
                              ),
                            },
                          ]}
                          className="border-2 rounded-lg border-white w-full mb-8 flex flex-col h-24"
                        >
                          <TextArea className="h-12 bg-transparent border-none text-white text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none " />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Form.Item className="mt-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="h-12 w-60 bg-purple-600 border-2 border-white rounded-full font-popins text-base btn-hover"
                        >
                          Update
                        </Button>
                      </Form.Item>
                      <Form.Item className="mt-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="h-12 w-60 bg-purple-600 border-2 border-white rounded-full font-popins text-base btn-hover"
                          onClick={() => {}}
                        >
                          Back Home
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </form>
            </Content>
          </Layout>
        </Layout>
      </Col>
      <Col span={4} pull={20}>
        col-6 col-pull-18
      </Col>
    </Row>
  );
};

export default MainProfile;
