import { Alert, Button, Form, Input, Layout, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import requestApi from "../../../../utils/interceptors";

const AddCategoryAdmin = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const addCategory = async (values: any) => {
        const loadingToast = toast.loading("Creating...");
        try {
            const res = await requestApi("categories", "POST", values);
            toast.update(loadingToast, {
                render: res.data.message || "Category created successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            navigate("/categoryadmin");
        } catch (error) {
            console.error(error);
            toast.update(loadingToast, {
                render: "Failed to create category",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="flex bg-[#F2F9F6] min-h-screen">
            <Sidebar />
            <Layout className="w-full">
                <Content className="p-8">
                    <Card
                        title="Add New Category"
                        bordered={false}
                        className="max-w-3xl mx-auto shadow-xl rounded-xl"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={addCategory}
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <Alert
                                                message="Please input the category name"
                                                type="error"
                                                banner
                                            />
                                        ),
                                    },
                                ]}
                            >
                                <Input placeholder="Enter category name" size="large" />
                            </Form.Item>

                            <Form.Item label="Description" name="description">
                                <Input placeholder="Enter description" size="large" />
                            </Form.Item>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="default"
                                    size="large"
                                    onClick={() => navigate("/categoryadmin")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Create
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Content>
            </Layout>
        </div>
    );
};

export default AddCategoryAdmin;