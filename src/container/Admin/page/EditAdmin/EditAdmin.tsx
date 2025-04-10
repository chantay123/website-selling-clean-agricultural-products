import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Row,
} from "antd";
import requestApi from "../../../../utils/interceptors";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import {
  productTypes,
  ProductAttribute,
} from "../../../../@type/global.type";

type EditProductFormType = Omit<productTypes, "attributes"> & {
  attribute: Partial<ProductAttribute>;
};

const EditAdmin = () => {
  const { editId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm<EditProductFormType>();
  const access_token = localStorage.getItem("access_token");

  const [userData, setUserData] = useState<EditProductFormType>({
    name: "",
    slug: "",
    description: "",
    origin: "",
    sold: 0,
    thumbnail_url: "",
    hot: false,
    numberOfReview: 0,
    rating: 0,
    category_id: "",
    category: { _id: "", name: "", slug: "" },
    total_price: 0,
    _id: "",
    attribute: {
      weight: 0,
      original_price: 0,
      discounted_percent: 0,
      product_id: "",
      discount_price: 0,
      quantity: 0,
    },
  });

  const isadmin = useSelector((state: RootState) => state.user.isAdmin);

  const profile = async () => {
    try {
      const response = await requestApi("auth/me", "GET", {}, {
        Authorization: `Bearer ${access_token}`,
      });
      dispatch(setAdminStatus(response.data.data?.role.name === "admin"));
    } catch {
      dispatch(setAdminStatus(false));
    }
  };

  const fetchProduct = async () => {
    try {
      const productRes = await requestApi(`products/${editId}`, "GET", {});
      const product = productRes.data.data;

      const defaultAttribute: Partial<ProductAttribute> = {
        weight: 0,
        original_price: 0,
        discounted_percent: 0,
        product_id: "",
        discount_price: 0,
        quantity: 0,
        _id: "",
      };

      const fullProduct: EditProductFormType = {
        ...product,
        attribute: defaultAttribute,
      };

      setUserData(fullProduct);
      form.setFieldsValue(fullProduct);

      try {
        const attrRes = await requestApi(`productAttribute/${editId}`, "GET", {});
        const attr = attrRes.data.data;

        if (attr) {
          const updatedProduct = {
            ...fullProduct,
            attribute: {
              ...defaultAttribute,
              ...attr,
            },
          };
          setUserData(updatedProduct);
          form.setFieldsValue(updatedProduct);
        }
      } catch (attrErr) {
        console.warn("⚠️ Không tìm thấy attribute:", attrErr);
      }
    } catch (error) {
      console.log("❌ Error fetching product:", error);
    }
  };

  const editProduct = async (values: EditProductFormType) => {
    const loadingToast = toast.loading("Updating...");
    try {
      const { attribute, ...productData } = values;

      const attributeData = {
        ...attribute,
      };

      await requestApi(`products/${editId}`, "PUT", productData);
      await requestApi(`productAttribute/${editId}`, "PUT", attributeData);

      toast.update(loadingToast, {
        render: "Product updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: "Update failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    profile();
    fetchProduct();
  }, [editId]);

  if (!isadmin) {
    navigate("*");
    return null;
  }

  return (
    <div className="flex bg-[#F2F9F6]">
      <Sidebar />
      <Layout className="min-h-screen overflow-hidden">
        <Layout>
          <Content className="p-6">
            <Card title="Edit product" variant="outlined" className="shadow-xl rounded-xl">
              <Form layout="vertical" form={form} onFinish={editProduct}>
                <Divider orientation="left">Product</Divider>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="name" label="name" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="slug" label="slug">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="description" label="description">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="origin" label="origin">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="sold" label="sold">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="thumbnail_url" label="thumbnail_url">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation="left">Product Attribute</Divider>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={["attribute", "weight"]} label="Weight">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["attribute", "original_price"]} label="Original Price">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["attribute", "discount_price"]} label="Discount Price">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["attribute", "discount_percent"]} label="Discount Percent">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["attribute", "quantity"]} label="Quantity">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name={["attribute", "color"]} label="Color">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>


                <Divider />
                <Row justify="end" gutter={16}>
                  <Col>
                    <Button onClick={() => navigate("/productadmin")}>Back Home</Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default EditAdmin;