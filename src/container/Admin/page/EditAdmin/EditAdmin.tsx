import { Alert, Button, Form, Input, Layout } from "antd";

import requestApi from "../../../../utils/interceptors";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Content } from "antd/es/layout/layout";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";

const EditAdmin = () => {
  const { editId } = useParams();

  console.log(editId);
  const [userData, setUserData] = useState({
    name: "",
    slug: "",
    description: "",
    origin: "",
    sold: "",
    thumbnail_url: "",
    attribute: {
      weight: "",
      original_price: "",
      discounted_percent: "",
      dimensions: "",
      unit_of_measurement: "",
      quantity_per_unit: "",
      certification: "",
      harvest_date: "",
      link: "",
      expiration_date: "",
    },
    hot: "",
    numberOfReview: "",
    rating: "",
  });
  console.log(userData);

  const product = async () => {
    try {
      const respone = await requestApi(`products/${editId}`, "GET", {});
      const a = respone.data.data;
      console.log(a);
      setUserData(a);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    product();
  }, [editId]);

  const editProduct = async () => {
    const loadingToast = toast.loading("Updating....");
    const response = await requestApi(`products/${editId}`, "PUT", {
      name: userData.name,
      slug: userData.slug,
      description: userData.description,
      origin: userData.origin,
      sold: userData.sold,
      thumbnail_url: userData.thumbnail_url,
      attribute: {
        weight: userData.attribute.weight,
        original_price: userData.attribute.original_price,
        discounted_percent: userData.attribute.discounted_percent,
        dimensions: userData.attribute.dimensions,
        unit_of_measurement: userData.attribute.unit_of_measurement,
        quantity_per_unit: userData.attribute.quantity_per_unit,
        certification: userData.attribute.certification,
        harvest_date: userData.attribute.harvest_date,
        link: userData.attribute.link,
        expiration_date: userData.attribute.expiration_date,
      },
      hot: userData.hot,
      numberOfReview: userData.numberOfReview,
      rating: userData.rating,
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
      console.log(error);
    }
  };
  return (
    <div className="flex bg-[#F2F9F6]">
      <Sidebar />
      <Layout className="min-h-screen overflow-hidden">
        <Layout>
          <Content className="bg-[#F2F9F6]">
            <Form
              className="mt-4 n "
              name="basic"
              initialValues={{ ...userData }}
              onFinish={editProduct}
              fields={[
                {
                  name: ["name"],
                  value: userData.name,
                },
                {
                  name: ["description"],
                  value: userData.description,
                },
                {
                  name: ["hot"],
                  value: userData.hot,
                },
                {
                  name: ["sold"],
                  value: userData.sold,
                },
                {
                  name: ["slug"],
                  value: userData.slug,
                },
                {
                  name: ["sold"],
                  value: userData.sold,
                },
                {
                  name: ["attributes", "weight"],
                  value: userData.attribute?.weight,
                },
                {
                  name: ["attributes", "original_price"],
                  value: userData.attribute?.original_price,
                },
                {
                  name: ["attributes", "discounted_percent"],
                  value: userData.attribute?.discounted_percent,
                },
                {
                  name: ["attributes", "dimensions"],
                  value: userData.attribute?.dimensions,
                },
                {
                  name: ["attributes", "unit_of_measurement"],
                  value: userData.attribute?.unit_of_measurement,
                },
                {
                  name: ["attributes", "quantity_per_unit"],
                  value: userData.attribute?.quantity_per_unit,
                },
                {
                  name: ["attributes", "certification"],
                  value: userData.attribute?.certification,
                },
                {
                  name: ["attributes", "harvest_date"],
                  value: userData.attribute?.harvest_date,
                },
                {
                  name: ["attributes", "link"],
                  value: userData.attribute?.link,
                },
                {
                  name: ["attributes", "expiration_date"],
                  value: userData.attribute?.expiration_date,
                },
              ]}
            >
              <div className="relative ">
                <h2 className="ml-20 text-3xl">Edit product</h2>
                <div className=" w-full xs:mt-20 lg:mt-10 3xl:mt-44 3xl:px-10 lg:px-10 xs:px-5 mt-3 ">
                  <div className="flex flex-col lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Name
                      </h3>
                      <Form.Item
                        name="name"
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
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Description
                      </h3>
                      <Form.Item
                        name="description"
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Slug
                      </h3>
                      <Form.Item
                        name="slug"
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Sold
                      </h3>
                      <Form.Item
                        name="sold"
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        weight
                      </h3>
                      <Form.Item
                        name={["attributes", "weight"]}
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
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Original price
                      </h3>
                      <Form.Item
                        name={["attributes", "original_price"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Discounted percent
                      </h3>
                      <Form.Item
                        name={["attributes", "discounted_percent"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Dimensions
                      </h3>
                      <Form.Item
                        name={["attributes", "dimensions"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Unit of measurement
                      </h3>
                      <Form.Item
                        name={["attributes", "unit_of_measurement"]}
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
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Quantity per unit
                      </h3>
                      <Form.Item
                        name={["attributes", "quantity_per_unit"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Certification
                      </h3>
                      <Form.Item
                        name={["attributes", "certification"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Harvest date
                      </h3>
                      <Form.Item
                        name={["attributes", "harvest_date"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:gap-12 3xl:gap-16">
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Link
                      </h3>
                      <Form.Item
                        name={["attributes", "link"]}
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
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full relative">
                      <h3 className="absolute -top-3 left-3 px-2 mb-0 text-black bg-[#F2F9F6] z-10 rounded-md">
                        Expiration date
                      </h3>
                      <Form.Item
                        name={["attributes", "expiration_date"]}
                        className="border-2 rounded-lg border-baltext-black w-full mb-8 flex flex-col"
                      >
                        <Input
                          className="bg-transparent h-12 border-none text-black text-base focus:shadow-none focus:border-none focus:outline-none focus-visible:shadow-none focus-visible:border-none focus-visible:outline-none"
                          style={{ background: "none" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            <div className=" ml-10 flex gap-4">
              <Form.Item className="mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-60 border-2 border-baltext-black rounded-full font-popins text-base btn-hover"
                >
                  Update
                </Button>
              </Form.Item>
              <Form.Item className="mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-12 w-60 border-2 border-baltext-black rounded-full font-popins text-base btn-hover"
                  // onClick={() => {
                  //   Navigate");
                  // }}
                >
                  Back Home
                </Button>
              </Form.Item>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default EditAdmin;
