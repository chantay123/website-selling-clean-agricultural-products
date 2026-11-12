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
  createCategory,
  deleteCategory,
  getCategories,

  updateCategory,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { CategoryType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Category management backed by `GET /categories`.
 *
 * The collection endpoint is public, every write verb requires an
 * administrator token.
 */
const CategoryAdmin = () => {
  const isAdmin = useIsAdmin();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryType | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách danh mục"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchCategories();
  }, [isAdmin]);

  /** Opens the modal in "create" mode. */
  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  /** Opens the modal in "edit" mode with the current values. */
  const handleEdit = (record: CategoryType) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      image: record.image,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        await updateCategory(editing._id, values);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategory(values);
        toast.success("Thêm danh mục thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu danh mục"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Xoá danh mục thành công");
      fetchCategories();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá danh mục"));
    }
  };

  const columns: TableProps<CategoryType>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 90,
      render: (value?: string) =>
        value ? (
          <img
            src={value}
            alt=""
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-200" />
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      width: 220,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 200,
    },
    {
      title: "Số sản phẩm",
      dataIndex: "items",
      width: 140,
      render: (items?: CategoryType["items"]) => items?.length ?? 0,
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
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Danh mục</h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {categories.length} danh mục sản phẩm
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Thêm danh mục
          </Button>
        </div>

        <Table<CategoryType>
          loading={loading}
          columns={columns}
          dataSource={categories.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật danh mục" : "Thêm danh mục"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên danh mục"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Ví dụ: Trái cây tươi" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Slug" name="slug">
                <Input placeholder="trai-cay-tuoi" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Ảnh (URL)" name="image">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default CategoryAdmin;
