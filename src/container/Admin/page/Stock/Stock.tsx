import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import {
  createStock,
  deleteStock,
  getProducts,
  getStocks,
  updateStock,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { productTypes, StockType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Inventory screen backed by `GET /stocks`.
 *
 * The endpoint is private, so the page is only rendered for an
 * administrator. Every stock record describes one product attribute
 * (a concrete weight or packaging) and how many units are left.
 */
const Stock = () => {
  const isAdmin = useIsAdmin();

  // The role is only known once the profile request finished, so the guard
  // has to tell "not an admin" apart from "not loaded yet".
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [products, setProducts] = useState<productTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await getStocks();
      setStocks(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách kho hàng"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchStocks();
  }, [isAdmin]);

  // The product list feeds the "import goods" form.
  useEffect(() => {
    if (isAdmin !== true) return;

    const loadProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return stocks.filter((stock) => {
      const matchesStatus = statusFilter ? stock.status === statusFilter : true;
      const matchesTerm = term
        ? (stock.product_name ?? "").toLowerCase().includes(term) ||
          (stock.product_id ?? "").toLowerCase().includes(term)
        : true;
      return matchesStatus && matchesTerm;
    });
  }, [stocks, keyword, statusFilter]);

  const totalUnits = useMemo(
    () => visible.reduce((sum, stock) => sum + (stock.quantity ?? 0), 0),
    [visible]
  );

  const lowStockCount = useMemo(
    () => visible.filter((stock) => (stock.quantity ?? 0) <= 5).length,
    [visible]
  );

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

  /** Creates a new stock record. */
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await createStock(values);
      toast.success("Thêm bản ghi kho hàng thành công");
      setOpen(false);
      form.resetFields();
      fetchStocks();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi tạo bản ghi kho hàng"));
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<StockType>["columns"] = [
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      width: 220,
      render: (value: string | undefined, record: StockType) =>
        value || record.product_id || "-",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
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
      title: "Đơn vị",
      dataIndex: "unit_of_measurement",
      width: 120,
    },
    {
      title: "Tổng giá",
      dataIndex: "total_price",
      width: 140,
      render: (value?: number) =>
        value === undefined ? "-" : value.toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (value?: string) => (
        <Tag color={value === "In Stock" ? "green" : "orange"}>
          {value ?? "-"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_value, record) => (
        <Space size="small">
          <Button size="small" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Bạn không có quyền truy cập trang quản trị.
      </div>
    );
  }

  return (
    <AdminLayout title="Kho hàng">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Số bản ghi</p>
          <p className="text-2xl font-semibold text-gray-800">{stocks.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Tổng số lượng</p>
          <p className="text-2xl font-semibold text-gray-800">{totalUnits}</p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-500">Sắp hặt (&le; 5)</p>
          <p className="text-2xl font-semibold text-red-600">{lowStockCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tửn kho</h3>
            <p className="text-sm text-gray-500">
              Cập nhật số lượng ngay trên bảng
            </p>
          </div>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setOpen(true);
            }}
          >
            + Nhập hàng
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            allowClear
            placeholder="Tìm theo tên sản phẩm..."
            className="max-w-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            className="w-48"
            value={statusFilter}
            onChange={setStatusFilter}
            options={["In Stock", "Low Stock", "Out of Stock"].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </div>

        <Table<StockType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((stock) => ({ ...stock, key: stock._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title="Thêm bản ghi kho hàng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
        width={720}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Sản phẩm"
                name="product_id"
                rules={[
                  { required: true, message: "Vui lòng chọn sản phẩm" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn sản phẩm"
                  optionFilterProp="label"
                  options={products.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" },
                ]}
              >
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Đơn vị" name="unit_of_measurement">
                <Input placeholder="kg" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Giá gốc" name="original_price">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Giá sau giảm" name="discount_price">
                <InputNumber className="w-full" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Trạng thái" name="status">
                <Input placeholder="Đang có hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ngày thu hoạch" name="harvest_date">
                <Input placeholder="2024-01-01" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Ngày hết hạn" name="expiration_date">
                <Input placeholder="2024-12-31" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default Stock;
