import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, TableProps } from "antd";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { BannerType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Banner management backed by `GET /banners`.
 *
 * The backend routes `POST /banners`, `PUT /banners/:id` and
 * `DELETE /banners/:id`, so the screen offers those three operations.
 */
const BannerAdmin = () => {
  const isAdmin = useIsAdmin();

  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BannerType | null>(null);
  const [keyword, setKeyword] = useState("");
  const [form] = Form.useForm();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await getBanners();
      setBanners(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách banner"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchBanners();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return banners;
    return banners.filter(
      (banner) =>
        banner.slug?.toLowerCase().includes(term) ||
        banner.description?.toLowerCase().includes(term)
    );
  }, [banners, keyword]);

  /** Opens the modal in "create" mode. */
  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  /** Opens the modal in "edit" mode with the current values. */
  const handleEdit = (record: BannerType) => {
    setEditing(record);
    form.setFieldsValue({
      slug: record.slug,
      url: record.url,
      description: record.description,
      link: record.link,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        await updateBanner(editing._id, values);
        toast.success("Cập nhật banner thành công");
      } else {
        await createBanner(values);
        toast.success("Thêm banner thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchBanners();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu banner"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      toast.success("Xoá banner thành công");
      fetchBanners();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá banner"));
    }
  };

  const columns: TableProps<BannerType>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "url",
      width: 100,
      render: (value?: string) =>
        value ? (
          <img src={value} alt="" className="w-16 h-10 object-cover rounded" />
        ) : (
          <div className="w-16 h-10 rounded bg-gray-200" />
        ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Liên kết",
      dataIndex: "link",
      width: 220,
      render: (value?: string) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer" className="truncate">
            {value}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 160,
      render: (_value, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý banner">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Banner quảng cá</h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {banners.length} banner trong thư viện
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Thêm banner
          </Button>
        </div>

        <Input
          allowClear
          placeholder="Tìm theo slug hoặc mô tả..."
          className="max-w-sm mb-4"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Table<BannerType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật banner" : "Thêm banner"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
          >
            <Input placeholder="banh-truong-sach" />
          </Form.Item>
          <Form.Item
            label="Đường dḩn ảnh (URL)"
            name="url"
            rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input placeholder="Mô tả banner" />
          </Form.Item>
          <Form.Item label="Liên kết" name="link">
            <Input placeholder="/shop" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default BannerAdmin;
