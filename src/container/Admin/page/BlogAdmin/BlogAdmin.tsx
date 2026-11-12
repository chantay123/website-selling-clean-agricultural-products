import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import {
  createBlog,
  getBlogs,

  updateBlog,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { BlogType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/** Statuses a blog post can have. */
const BLOG_STATUSES = ["Published", "Draft", "Chờ xử lý", "Archived"];

/**
 * Blog management backed by `GET /blogs`.
 *
 * The backend routes `POST /blogs` and `PUT /blogs/:id`; there is no
 * `DELETE /blogs/:id`, so the screen offers create and edit only.
 */
const BlogAdmin = () => {
  const isAdmin = useIsAdmin();

  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogType | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getBlogs();
      setBlogs(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi tải danh sách bài viết"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchBlogs();
  }, [isAdmin]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesStatus = status ? blog.status === status : true;
      const matchesTerm = term
        ? blog.title?.toLowerCase().includes(term) ||
          blog.description?.toLowerCase().includes(term) ||
          blog.author_name?.toLowerCase().includes(term)
        : true;
      return matchesStatus && matchesTerm;
    });
  }, [blogs, keyword, status]);

  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: "Draft" });
    setOpen(true);
  };

  const handleEdit = (record: BlogType) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      detail: record.detail,
      thumbnail: record.thumbnail,
      status: record.status,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        await updateBlog(editing._id, values);
        toast.success("Cập nhật bài viết thành công");
      } else {
        await createBlog(values);
        toast.success("Tạo bài viết thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchBlogs();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi lưu bài viết"));
    } finally {
      setSaving(false);
    }
  };

  const columns: TableProps<BlogType>["columns"] = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      width: 90,
      render: (value?: string) =>
        value ? (
          <img src={value} alt="" className="w-12 h-12 object-cover rounded-md" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-gray-200" />
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 240,
      render: (value?: string, record?: BlogType) => (
        <Link to={`/blog/${record?._id}`} className="hover:underline">
          {value}
        </Link>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author_name",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (value?: string) => (
        <Tag color={value === "Published" ? "green" : "default"}>
          {value ?? "-"}
        </Tag>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "views_count",
      width: 110,
      render: (value?: number) => value ?? 0,
    },
    {
      title: "Bình luận",
      dataIndex: "comments_count",
      width: 110,
      render: (value?: number) => value ?? 0,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_value, record) => (
        <Button size="small" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout title="Quản lý bài viết">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Bài viết</h3>
            <p className="text-sm text-gray-500">
              Tổng cộng {blogs.length} bài viết
            </p>
          </div>
          <Button type="primary" onClick={handleCreate}>
            + Tạo bài viết
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            allowClear
            placeholder="Tìm theo tiêu đề hoặc tác giả..."
            className="max-w-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            allowClear
            placeholder="Lọc trạng thái"
            className="w-44"
            value={status}
            onChange={setStatus}
            options={BLOG_STATUSES.map((item) => ({ value: item, label: item }))}
          />
        </div>

        <Table<BlogType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((item) => ({ ...item, key: item._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={editing ? "Cập nhật bài viết" : "Tạo bài viết"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Huỷ"
        destroyOnClose
        width={760}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Tiêu đề bài viết" />
          </Form.Item>
          <Form.Item label="Mô tả ngắn" name="description">
            <Input placeholder="Tóm tắt nội dung" />
          </Form.Item>
          <Form.Item label="Nội dung" name="detail">
            <Input.TextArea rows={6} placeholder="Nội dung bài viết" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item label="Ảnh bìa (URL)" name="thumbnail">
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Trạng thái" name="status">
                <Select options={BLOG_STATUSES.map((item) => ({ value: item, label: item }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default BlogAdmin;
