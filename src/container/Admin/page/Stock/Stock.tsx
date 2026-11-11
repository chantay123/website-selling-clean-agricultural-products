import { Space, Table, TableProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  deleteStock,
  getMyProfile,
  getStocks,
  updateStock,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { StockType } from "../../../../@type/global.type";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";

/**
 * Inventory screen backed by `GET /stocks`.
 *
 * The endpoint is private, so the page is only rendered for an
 * administrator. Every stock record describes one product attribute
 * (a concrete weight or packaging) and how many units are left.
 */
const Stock = () => {
  const dispatch = useDispatch();
  const isadmin = useSelector((state: RootState) => state.user.isAdmin);

  // The role is only known once the profile request finished, so the guard
  // has to tell "not an admin" apart from "not loaded yet".
  const [profileChecked, setProfileChecked] = useState(false);
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        if (!cancelled) dispatch(setAdminStatus(response.data?.role === "Admin"));
      } catch (error) {
        if (!cancelled) dispatch(setAdminStatus(false));
      } finally {
        if (!cancelled) setProfileChecked(true);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const fetchStocks = useCallback(async () => {
    try {
      const response = await getStocks();
      setStocks(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách kho hàng"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profileChecked && isadmin === true) fetchStocks();
  }, [profileChecked, isadmin, fetchStocks]);

  /** Saves the new quantity of a stock record. */
  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      await updateStock(id, { quantity });
      toast.success("Cập nhật số lượng thành công");
      fetchStocks();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi cập nhật kho hàng"));
    }
  };

  /** Removes a stock record entirely. */
  const handleDelete = async (id: string) => {
    try {
      await deleteStock(id);
      toast.success("Xoá bản ghi kho hàng thành công");
      fetchStocks();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá kho hàng"));
    }
  };

  const columns: TableProps<StockType>["columns"] = [
    {
      title: "Product",
      dataIndex: "product_name",
      className: "text-base text-gray-600",
      width: 220,
      render: (value: string | undefined, record: StockType) =>
        value || record.product_id || "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      className: "text-base text-gray-600",
      width: 140,
      render: (value: number | undefined, record: StockType) => (
        <input
          type="number"
          className="w-24 px-2 py-1 border border-gray-300 rounded"
          defaultValue={value ?? 0}
          onBlur={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next) && next !== value) {
              handleQuantityChange(record._id, next);
            }
          }}
        />
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit_of_measurement",
      className: "text-base text-gray-600",
      width: 120,
    },
    {
      title: "Total price",
      dataIndex: "total_price",
      className: "text-base text-gray-600",
      width: 140,
      render: (value?: number) =>
        value === undefined ? "-" : value.toLocaleString("vi-VN"),
    },
    {
      title: "Status",
      dataIndex: "status",
      className: "text-base text-gray-600",
      width: 140,
    },
    {
      title: "Action",
      key: "action",
      className: "text-base text-gray-500",
      render: (_value, record) => (
        <Space size="middle">
          <button
            onClick={() => handleDelete(record._id)}
            className="rounded-md border px-4 py-2 text-white bg-red-600"
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  if (profileChecked && isadmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Bạn không có quyền truy cập trang quản trị.
      </div>
    );
  }

  return (
    <div>
      <HeaderAdmin />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">Kho hàng</h2>
          <Table<StockType>
            loading={loading}
            columns={columns}
            dataSource={stocks.map((stock) => ({ ...stock, key: stock._id }))}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Stock;
