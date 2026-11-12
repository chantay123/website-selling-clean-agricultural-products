import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, TableProps } from "antd";
import { deleteRole, getRoles, updateRole } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { RoleType } from "../../../../@type/global.type";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * Role catalogue backed by `GET /roles`.
 *
 * The endpoint is only reachable by an authenticated administrator. There is
 * no `POST /roles`, so a role is edited with `PUT /roles/:id` and removed
 * with `DELETE /roles/:id`.
 */
const Role = () => {
  const isAdmin = useIsAdmin();

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoleType | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Lỗi tải danh sách vai trò")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin === true) fetchRoles();
  }, [isAdmin, fetchRoles]);

  const handleEdit = (record: RoleType) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      slug: record.slug,
      description: record.description,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!editing) return;
    try {
      const values = await form.validateFields();
      setSaving(true);
      await updateRole(editing._id, values);
      toast.success("Cập nhật vai trò thành công");
      setOpen(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) return;
      toast.error(getApiErrorMessage(error, "Lỗi cập nhật vai trò"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      toast.success("Xoá vai trò thành công");
      fetchRoles();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá vai trò"));
    }
  };

  const columns: TableProps<RoleType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      className: "text-base text-gray-600",
      width: 220,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      className: "text-base text-gray-600",
      width: 220,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
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

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Bạn không có quyền truy cập trang quản trị.
      </div>
    );
  }

  return (
    <AdminLayout title="Vai trò">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Danh sách vai trò
          </h3>
          <p className="text-sm text-gray-500">
            Vai trò có thể gắn cho tài khoản người dùng
          </p>
        </div>

        <Table<RoleType>
          loading={loading}
          columns={columns}
          dataSource={roles.map((role) => ({ ...role, key: role._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title="Cập nhật vai trò"
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
            label="Tên vai trò"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên vai trò" },
            ]}
          >
            <Input placeholder="Admin" />
          </Form.Item>
          <Form.Item label="Slug" name="slug">
            <Input placeholder="admin" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả quyền hƠn" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default Role;
