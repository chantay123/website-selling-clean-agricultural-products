/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space, Table, TableProps, Button, Card, Image, Modal, message } from "antd";
import requestApi from "../../../../utils/interceptors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminStatus,
  setProduct,
  setsupplier,
} from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import {
  ProductAttribute,
  extendedProductType,
  productTypes,
} from "../../../../@type/global.type";

import { Link, useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
const ProductAdmin = () => {
  const { confirm } = Modal;
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
  const deleteProduct = async (product_id: string) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await requestApi(`products/${product_id}`, "DELETE", {}, {
            Authorization: `Bearer ${access_token}`,
          });
          fetchPRODUCT();
          message.success(res.data.message || "Product deleted successfully!");
        } catch (error: any) {
          console.log(error);
          message.error(error.response?.data?.message || "Delete failed");
        }
      },
    });
  };
  const dispatch = useDispatch();
  const fetchPRODUCT = async () => {
    try {
      const response = await requestApi("products", "GET", {},
        {
          Authorization: `Bearer ${access_token}`,
        }
      );
      const a = response.data.data;
      dispatch(setProduct(a));
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPRODUCT();
  }, []);
  const list = useSelector((state: RootState) => state.user.product);
  const extendedList: extendedProductType[] = list.map((obj, index) => ({
    ...obj,
    key: `key-${index}`,
  }));
  const columns: TableProps<productTypes>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      className: "text-base text-gray-700 font-medium",
      width: 150,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      className: "text-base text-gray-600",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      className: "text-base text-gray-600",
      width: 200,
    },
    {
      title: "Origin",
      dataIndex: "origin",
      className: "text-base text-gray-600",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "thumbnail_url",
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="thumbnail"
          width={70}
          height={70}
          style={{ objectFit: "cover", borderRadius: 8 }}
          placeholder
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 160,
      render: (_: any, record: productTypes) => (
        <Space size="middle">
          <Button
            danger
            onClick={() => deleteProduct(record._id)}
            className="flex items-center gap-1"
          >
            🗑 Delete
          </Button>
          <Link
            to={`/editadmin/${record._id}`}
            className="rounded-md px-3 py-1 text-white bg-yellow-400 hover:bg-yellow-500 transition"
          >
            ✏️ Edit
          </Link>
        </Space>
      ),
    },
  ];

  const data: extendedProductType[] = extendedList;

  const supplier = async () => {
    try {
      const respone = await requestApi("supplier", "GET", {},
        {
          Authorization: `Bearer ${access_token}`,
        }
      );
      const a = respone.data.data;
      console.log(a);
      dispatch(setsupplier(a));
      console.log(respone);
    } catch (error) {
      console.log(error);
    }
  };
  supplier();

  const navigate = useNavigate();
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
            title="Product Management"
            extra={
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate("/addproductadmin")}
              >
                ➕ Add Product
              </Button>
            }
            className="shadow-lg rounded-xl"
          >
            <Table
              pagination={{ pageSize: 6 }}
              className="rounded-lg overflow-hidden"
              columns={columns}
              dataSource={data}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductAdmin;
