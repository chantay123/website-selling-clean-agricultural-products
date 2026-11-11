import { Space, Table, TableProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { deleteReport, getMyProfile, getReports } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { ReportType } from "../../../../@type/global.type";
import { useDispatch, useSelector } from "react-redux";
import { setAdminStatus } from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import AdminLayout from "../../components/AdminLayout";
import { toast } from "react-toastify";

/**
 * Moderation queue backed by `GET /reports`.
 *
 * A report points at another resource (a product, a blog post, a comment)
 * and explains why it should be reviewed.
 */
const Report = () => {
  const dispatch = useDispatch();
  const isadmin = useSelector((state: RootState) => state.user.isAdmin);

  const [profileChecked, setProfileChecked] = useState(false);
  const [reports, setReports] = useState<ReportType[]>([]);
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

  const fetchReports = useCallback(async () => {
    try {
      const response = await getReports();
      setReports(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "L?i t?i danh sách báo cáo"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profileChecked && isadmin === true) fetchReports();
  }, [profileChecked, isadmin, fetchReports]);

  /** Dismisses a report once it has been handled. */
  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      toast.success("Xoá báo cáo thành công");
      fetchReports();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "L?i xoá báo cáo"));
    }
  };

  const columns: TableProps<ReportType>["columns"] = [
    {
      title: "Target",
      dataIndex: "target_type",
      className: "text-base text-gray-600",
      width: 140,
      render: (value: string | undefined, record: ReportType) =>
        value || record.target_id || "-",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      className: "text-base text-gray-600",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      className: "text-base text-gray-600",
    },
    {
      title: "Status",
      dataIndex: "status",
      className: "text-base text-gray-600",
      width: 140,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      className: "text-base text-gray-600",
      width: 160,
      render: (value?: string) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
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
            Dismiss
          </button>
        </Space>
      ),
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
    <AdminLayout title="Báo cáo">
      <Table<ReportType>
        loading={loading}
        columns={columns}
        dataSource={reports.map((report) => ({ ...report, key: report._id }))}
        pagination={{ pageSize: 10, responsive: true }}
        scroll={{ x: "max-content" }}
      />
    </AdminLayout>
  );
};

export default Report;
