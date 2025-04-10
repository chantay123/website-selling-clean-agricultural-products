/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space, Table, TableProps } from "antd";
import requestApi from "../../../../../utils/interceptors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setAdminStatus,
    setsupplier,
} from "../../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../../redux/config";
import {
    SupplierType
} from "../../../../../@type/global.type";

import { Link, useNavigate } from "react-router-dom";
import HeaderAdmin from "../../../components/HeaderAdmin";
import Sidebar from "../../../components/Sidebar";
const Supplier = () => {
    const access_token = localStorage.getItem("access_token");
    const profile = async () => {
        try {
            const response = await requestApi("auth/me", "GET", {},
                {
                    Authorization: `Bearer ${access_token}`,
                }
            );
            const a = response.data.data;
            dispatch(setAdminStatus(a?.role.name === "admin"));
        } catch (error) {
            dispatch(setAdminStatus(false));
            console.log(error);
        }
    };
    useEffect(() => {
        profile();
    }, []);

    const isadmin = useSelector((state: RootState) => state.user.isAdmin);
    const deleteCategory = async (supplier_id: any) => {
        console.log(supplier_id);
        try {
            await requestApi(`supplier/${supplier_id}`, "DELETE", {},
            );
            fetchSupplier();
        } catch (error) {
            console.log(error);
        }
    };
    const dispatch = useDispatch();
    const fetchSupplier = async () => {
        try {
            const response = await requestApi("supplier", "GET", {},
            );
            const a = response.data.data;
            dispatch(setsupplier(a));
            console.log(a);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSupplier();
    }, []);
    const list = useSelector((state: RootState) => state.user.supplier);
    const extendedList: SupplierType[] = list.map((obj, index) => ({
        ...obj,
        key: `key-${index}`,
    }));
    const columns: TableProps<SupplierType>["columns"] = [
        {
            title: "Company Name",
            dataIndex: "company_name",
            className: " text-base text-gray-600 ",
        },
        {
            title: "Contact Name",
            dataIndex: "contact_name",
            className: " text-base text-gray-600 ",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            className: " text-base text-gray-600 ",
        },
        {
            title: "Email",
            dataIndex: "email",
            className: " text-base text-gray-600 ",
        },
        {
            title: "Action",
            key: "action",
            className: " text-base text-gray-500",
            render: (attributes: SupplierType[], supplier) => (
                <Space size="middle">
                    <button
                        onClick={() => deleteCategory(supplier._id)}
                        className="rounded-md border px-4 py-2 text-white bg-red-600"
                    >
                        <i>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9L14.394 18M9.652 18L9.26 9M19.228 5.79c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </i>
                    </button>
                    <div>
                        <Link
                            to={`/supplier/edit/${supplier._id}`}
                            className="rounded-md border px-2  text-white bg-yellow-300 items-center flex hover:bg-yellow-400 "
                        >
                            <i>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                    />
                                </svg>
                            </i>
                        </Link>
                    </div>
                </Space>
            ),
        },
    ];

    const data: SupplierType[] = extendedList;

    const navigate = useNavigate();
    if (isadmin === false) {
        navigate("*");
        return;
    }
    return (
        <div>
            <HeaderAdmin />
            <div className="flex">
                <Sidebar />

                {/* Nội dung chính */}
                <div className="flex-1 p-6">
                    {/* Nút thêm supplier mới */}
                    <div className="flex justify-end mb-4">
                        <Link
                            to="/supplier/create"
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md transition duration-300 ease-in-out"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Thêm Supplier
                        </Link>
                    </div>

                    {/* Bảng danh sách */}
                    <Table className="w-full" columns={columns} dataSource={data} />
                </div>
            </div>
        </div>
    );
};

export default Supplier;
