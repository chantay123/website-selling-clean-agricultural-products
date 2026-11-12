import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
} from "antd";
import {
  createSupplier,
  deleteSupplier,

  getSuppliers,
  updateSupplier,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { SupplierType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Supplier management backed by `GET /suppliers`.
 *
 * The list is public, the write verbs need an administrator token.
 */
const SupplierAdmin = () => {
  const isAdmin = useIsAdmin();

  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SupplierType | null>(null);
  const [form] = Form.useForm();

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách nhà cung cấp"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchSuppliers();
  }, [isAdmin]);

  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: SupplierType) => {
    setEditing(record);
    form.setFieldsValue({
      company_name: record.company_name,
      contact_name: record.contact_name,
      contact_title: record.contact_title,
      phone: record.phone,
      email: record.email,
      address: record.address,
      website: record.website,
      certification_details: record.certification_details,
      description: record.description,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        await updateSupplier(editing._id, values);
        toast.success("Cập nhật nhà cung cấp thành công");
      } else {
        await createSupplier(values);
        toast.success("Thêm nhà cung cấp thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchSuppliers();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu nhà cung cấp"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      toast.success("Xoá nhà cung cấp thành công");
      fetchSuppliers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá nhà cung cấp"));
    }
  };

  const columns: TableProps<SupplierType>["columns"] = [
    {
      title: "Công ty",
      dataIndex: "company_name",
      width: 220,
    },
    {
      title: "Người liên hệ",
      dataIndex: "contact_name",
      width: 180,
      render: (value?: string, record?: SupplierType) =>
        value || record?.contact_name || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
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
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_value, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý nhà cung cấp">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Nhà cung cấp
            </h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {suppliers.length} nhà cung cấp
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Thêm nhà cung cấp
          </Button>
        </div>

        <Table<SupplierType>
          loading={loading}
          columns={columns}
          dataSource={suppliers.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
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
                label="Tên công ty"
                name="company_name"
                rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
              >
                <Input placeholder="Công ty ABC" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Người liên hệ" name="contact_name">
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Chức danh" name="contact_title">
                <Input placeholder="Giám đốc" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="contact@company.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Website" name="website">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Địa chỉ công ty" />
          </Form.Item>
          <Form.Item label="Chứng nhận" name="certification_details">
            <Input placeholder="ISO 22000" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả nhà cung cấp" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default SupplierAdmin;
