import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  Tag,
} from "antd";
import {
  createHashtag,
  deleteHashtag,
  getHashtags,

  updateHashtag,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { HashtagType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Hashtag management backed by `GET /hashtags`.
 *
 * The collection is public, the write verbs require an administrator token.
 */
const HashtagAdmin = () => {
  const isAdmin = useIsAdmin();

  const [hashtags, setHashtags] = useState<HashtagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HashtagType | null>(null);
  const [keyword, setKeyword] = useState("");
  const [form] = Form.useForm();

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const response = await getHashtags();
      setHashtags(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách hashtag"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchHashtags();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return hashtags;
    return hashtags.filter(
      (tag) =>
        tag.name?.toLowerCase().includes(term) ||
        tag.slug?.toLowerCase().includes(term)
    );
  }, [hashtags, keyword]);

  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: HashtagType) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      type: record.type,
      description: record.description,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        await updateHashtag(editing._id, values);
        toast.success("Cập nhật hashtag thành công");
      } else {
        await createHashtag(values);
        toast.success("Thêm hashtag thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchHashtags();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu hashtag"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHashtag(id);
      toast.success("Xoá hashtag thành công");
      fetchHashtags();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá hashtag"));
    }
  };

  const columns: TableProps<HashtagType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 200,
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 140,
      render: (value?: string) => <Tag>{value ?? "-"}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Lượt dùng",
      dataIndex: "usage_count",
      width: 130,
      render: (value?: number) => value ?? 0,
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
    <AdminLayout title="Quản lý hashtag">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hashtag</h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {hashtags.length} hashtag
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Thêm hashtag
          </Button>
        </div>

        <Input
          allowClear
          placeholder="Tìm theo tên hoặc slug..."
          className="max-w-sm mb-4"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Table<HashtagType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật hashtag" : "Thêm hashtag"}
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
                label="Tên hashtag"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="#Organic" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Slug" name="slug">
                <Input placeholder="vietgap" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Loại" name="type">
            <Input placeholder="san-pham / bai-viet" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả hashtag" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default HashtagAdmin;
