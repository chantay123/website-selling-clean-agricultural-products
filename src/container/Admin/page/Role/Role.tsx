import { Table, TableProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getMyProfile, getRoles } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { RoleType } from "../../../../@type/global.type";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";

/**
 * Role catalogue backed by `GET /roles`.
 *
 * The endpoint is only reachable by an administrator, the list shows the
 * roles an account can be assigned to.
 */
const Role = () => {
  const dispatch = useDispatch();
  const isadmin = useSelector((state: RootState) => state.user.isAdmin);

  const [profileChecked, setProfileChecked] = useState(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        if (!cancelled)
          dispatch(setAdminStatus(response.data?.role === "Admin"));
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

  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "L?i t?i danh sách vai trò"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profileChecked && isadmin === true) fetchRoles();
  }, [profileChecked, isadmin, fetchRoles]);

  const columns: TableProps<RoleType>["columns"] = [
    {
      title: "Name",
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
      title: "Description",
      dataIndex: "description",
      className: "text-base text-gray-600",
    },
  ];

  if (profileChecked && isadmin === false) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        B?n không có quy?n truy c?p trang qu?n tr?.
      </div>
    );
  }

  return (
    <AdminLayout title="Vai trò">
      <Table<RoleType>
        loading={loading}
        columns={columns}
        dataSource={roles.map((role) => ({ ...role, key: role._id }))}
        pagination={{ pageSize: 10, responsive: true }}
        scroll={{ x: "max-content" }}
      />
    </AdminLayout>
  );
};

export default Role;
