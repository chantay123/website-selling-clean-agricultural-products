import { useEffect, useMemo, useState } from "react";
import { Input, Select, Table, TableProps, Tag } from "antd";
import { getOrders } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { OrderType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/** Statuses the shop knows about. */
const STATUSES = [
  "Chờ xử lý",
  "Đang xử lý",
  "Đang giao",
  "Đã giao",
  "Đã huủ",
];

/**
 * The backend stores the status of an order in English, the table shows the
 * Vietnamese label instead.
 */
const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huủ",
  completed: "Hoàn tất",
};

const statusLabel = (status?: string) => {
  if (!status) return "";

  return STATUS_LABEL[status.toLowerCase()] ?? status;
};

/** Colour of the status tag. */
const statusColor = (status?: string) => {
  switch (status) {
    case "Đã giao":
      return "green";
    case "Đang giao":
      return "blue";
    case "Đang xử lý":
      return "orange";
    case "Đã huủ":
      return "red";
    default:
      return "default";
  }
};

/**
 * Order management backed by `GET /orders`.
 *
 * The backend has no order write verb, so this screen is read only: it
 * filters and summarises the orders the API returns.
 */
const OrderAdmin = () => {
  const isAdmin = useIsAdmin();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách đơn hàng"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchOrders();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status
        ? statusLabel(order.status) === status
        : true;
      const matchesTerm = term
        ? (order._id ?? "").toLowerCase().includes(term) ||
          (order.user_name ?? "").toLowerCase().includes(term) ||
          (order.address ?? "").toLowerCase().includes(term) ||
          (order.phone ?? "").toLowerCase().includes(term)
        : true;
      return matchesStatus && matchesTerm;
    });
  }, [orders, keyword, status]);

  const revenue = useMemo(
    () => visible.reduce((sum, order) => sum + (order.total_price ?? 0), 0),
    [visible]
  );

  const columns: TableProps<OrderType>["columns"] = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      width: 220,
      render: (value: string) => (
        <span className="text-xs font-mono">{value?.slice(-10)}</span>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "user_name",
      width: 180,
      render: (value?: string, record?: OrderType) =>
        value || record?.user_id || "-",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Thanh toán",
      dataIndex: "payment_method",
      width: 140,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      width: 140,
      render: (value?: number) =>
        value === undefined
          ? "-"
          : `${value.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (value?: string) => (
        <Tag color={statusColor(statusLabel(value))}>
          {statusLabel(value) || "Chưa rõ"}
        </Tag>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      width: 160,
      render: (value?: string) =>
        value ? new Date(value).toLocaleString("vi-VN") : "-",
    },
  ];

  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Tổng đơn</p>
          <p className="text-2xl font-semibold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Đơn đang hiển thị</p>
          <p className="text-2xl font-semibold text-gray-800">{visible.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <p className="text-2xl font-semibold text-green-600">
            {revenue.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            allowClear
            placeholder="Tìm mã đơn, khách hàng, số điện thoại..."
            className="max-w-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            className="w-48"
            value={status}
            onChange={setStatus}
            options={STATUSES.map((item) => ({ value: item, label: item }))}
          />
        </div>

        <Table<OrderType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </AdminLayout>
  );
};

export default OrderAdmin;
