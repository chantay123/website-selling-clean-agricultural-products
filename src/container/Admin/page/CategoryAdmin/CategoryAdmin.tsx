/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, message,Space, Table, TableProps, Button, Card } from "antd";
import requestApi from "../../../../utils/interceptors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setAdminStatus,
    setCategory,
} from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import { CategoryType } from "../../../../@type/global.type";

import { Link, useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";

const CategoryAdmin = () => {
    const { confirm } = Modal;
    const access_token = localStorage.getItem("access_token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = async () => {
        try {
            const response = await requestApi("auth/me", "GET", {}, {
                Authorization: `Bearer ${access_token}`,
            });
            const user = response.data.data;
            dispatch(setAdminStatus(user?.role.name === "admin"));
        } catch (error) {
            dispatch(setAdminStatus(false));
            console.error(error);
        }
    };

    useEffect(() => {
        profile();
        fetchCategory();
    }, []);

    const isadmin = useSelector((state: RootState) => state.user.isAdmin);

    const fetchCategory = async () => {
        try {
            const response = await requestApi("categories", "GET", {}, {
                Authorization: `Bearer ${access_token}`,
            });
            dispatch(setCategory(response.data.data));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCategory = async (id: string) => {
        confirm({
            title: "Are you sure you want to delete this category?",
            content: "This action cannot be undone.",
            okText: "Yes, delete it",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const res = await requestApi(`categories/${id}`, "DELETE", {}, {
                        Authorization: `Bearer ${access_token}`,
                    });
                    fetchCategory();
                    message.success(res.data.message || "Category deleted successfully!");
                } catch (error: any) {
                    console.error(error);
                    message.error(error.response?.data?.message || "Failed to delete category.");
                }
            },
        });
    };    

    const list = useSelector((state: RootState) => state.user.category);
    const data: CategoryType[] = list.map((item, index) => ({
        ...item,
        key: `key-${index}`,
    }));

    const columns: TableProps<CategoryType>["columns"] = [
        {
            title: "Name",
            dataIndex: "name",
            className: "text-base text-gray-700",
            width: 200,
        },
        {
            title: "Description",
            dataIndex: "description",
            className: "text-base text-gray-700",
            width: 300,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        danger
                        onClick={() => deleteCategory(record._id)}
                        className="flex items-center gap-1"
                    >
                        🗑 Delete
                    </Button>
                    <Link to={`/editcategoryadmin/${record._id}`}>
                        <Button type="primary" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                            ✏ Edit
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    if (isadmin === false) {
        navigate("*");
        return;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderAdmin />
            <div className="flex">
                <Sidebar />
                <div className="p-6 w-full">
                    <Card
                        title="Category Management"
                        extra={
                            <Button
                                type="primary"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={() => navigate("/addcategoryadmin")}
                            >
                                ➕ Add Category
                            </Button>
                        }
                        className="shadow-lg rounded-xl"
                    >
                        <Table
                            className="rounded-lg overflow-hidden"
                            columns={columns}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CategoryAdmin;