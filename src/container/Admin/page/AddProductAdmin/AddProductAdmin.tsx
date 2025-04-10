import { Button, Card, Col, Divider, Form, Input, Layout, Row, Select } from "antd";
import requestApi from "../../../../utils/interceptors";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import { CategoryType, SupplierType } from "../../../../@type/global.type";

const AddProductAdmin = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const access_token = localStorage.getItem("access_token");

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);

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

    const fetchData = async () => {
        try {
            const [categoryRes, supplierRes] = await Promise.all([
                requestApi("categories", "GET", {}, { Authorization: `Bearer ${access_token}` }),
                requestApi("supplier", "GET", {}, { Authorization: `Bearer ${access_token}` }),
            ]);
            setCategories(categoryRes.data.data);
            setSuppliers(supplierRes.data.data);
        } catch (error) {
            console.error("Lỗi fetch category/supplier:", error);
        }
    };

    const addProduct = async (values: any) => {
        const loadingToast = toast.loading("Đang thêm sản phẩm...");
        try {
            await requestApi("products/add", "POST", values, {
                Authorization: `Bearer ${access_token}`,
            });

            toast.update(loadingToast, {
                render: "✅ Thêm sản phẩm thành công!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            navigate("/productadmin");
        } catch (error: any) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "❌ Thêm thất bại!",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            console.error("❌ Lỗi khi thêm product:", error);
        }
    };

    useEffect(() => {
        profile();
        fetchData();
    }, []);

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
                        <Card title="Add Product" variant="outlined" className="shadow-xl rounded-xl">
                            <Form layout="vertical" form={form} onFinish={addProduct}>
                                <Divider orientation="left">Product Information</Divider>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="description" label="Description">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="origin" label="Origin">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="sold" label="Sold">
                                            <Input type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="thumbnail_url" label="Thumbnail URL">
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="images" label="Images">
                                            <Input placeholder={`url image`} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                                            <Select placeholder="Select category">
                                                {categories.map((cat) => (
                                                    <Select.Option key={cat._id} value={cat.name}>
                                                        {cat.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="supplier" label="Supplier" rules={[{ required: true }]}>
                                            <Select placeholder="Select supplier">
                                                {suppliers.map((sup) => (
                                                    <Select.Option key={sup._id} value={sup.company_name}>
                                                        {sup.company_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider />
                                <Row justify="end" gutter={16}>
                                    <Col>
                                        <Button onClick={() => navigate("/productadmin")}>Back</Button>
                                    </Col>
                                    <Col>
                                        <Button type="primary" htmlType="submit">
                                            Add Product
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

export default AddProductAdmin;
