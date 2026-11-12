import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Space, Table, TableProps, Tag } from "antd";
import { Link } from "react-router-dom";
import { deleteReport, getReports } from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { ReportType } from "../../../../@type/global.type";
import { seedBlogs, seedProducts } from "../../../../data/seed";
import AdminLayout from "../../components/AdminLayout";
import { useIsAdmin } from "../../hooks/useAdminAccess";
import { toast } from "react-toastify";

/**
 * The backend stores the status of a report in English, the table shows the
 * Vietnamese label instead.
 */
const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  approved: "Đã duyệt",
  rejected: "Đã từ chối",
  resolved: "Đã xử lý",
};

const statusLabel = (status?: string) => {
  if (!status) return "";

  return STATUS_LABEL[status.toLowerCase()] ?? status;
};

/** Colours of the status tag. */
const statusColor = (status?: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Chờ xử lý":
      return "orange";
    default:
      return "default";
  }
};

/**
 * Moderation queue backed by `GET /reports`.
 *
 * A report points at another resource (a product, a blog post, a comment)
 * and explains why it should be reviewed. The backend only routes
 * `DELETE /reports/:id`, so a report is dismissed by removing it.
 */
const Report = () => {
  const isAdmin = useIsAdmin();

  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [targetType, setTargetType] = useState<string | undefined>(undefined);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getReports();
      setReports(response.data);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Lỗi tải danh sách báo cáo")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) fetchReports();
  }, [isAdmin]);

  const targetTypes = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((report) => {
      if (report.target_type) set.add(report.target_type);
    });
    return Array.from(set);
  }, [reports]);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesType = targetType ? report.target_type === targetType : true;
      const matchesTerm = term
        ? (report.reason ?? "").toLowerCase().includes(term) ||
          (report.description ?? "").toLowerCase().includes(term) ||
          (report.target_id ?? "").toLowerCase().includes(term)
        : true;
      return matchesType && matchesTerm;
    });
  }, [reports, keyword, targetType]);

  /** Dismisses a report once it has been handled. */
  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      toast.success("Xoá báo cáo thành công");
      fetchReports();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá báo cáo"));
    }
  };

  /** Name of the reported resource, taken from the local catalogue. */
  const targetName = (record?: ReportType) => {
    if (!record?.target_id) return null;

    const product = seedProducts.find(
      (item) => item._id === record.target_id || item.slug === record.target_id
    );
    if (product) return product.name;

    const blog = seedBlogs.find(
      (item) => item._id === record.target_id
    );
    if (blog) return blog.title;

    return null;
  };

  /** Builds the link that opens the reported resource. */
  const targetLink = (record: ReportType) => {
    switch (record.target_type) {
      case "product":
        return `/product/${record.target_id}`;
      case "blog":
        return `/blog/${record.target_id}`;
      default:
        return null;
    }
  };

  const columns: TableProps<ReportType>["columns"] = [
    {
      title: "Loại",
      dataIndex: "target_type",
      width: 140,
      render: (value?: string) => <Tag>{value ?? "-"}</Tag>,
    },
    {
      title: "Đối tượng",
      dataIndex: "target_id",
      width: 220,
      render: (value?: string, record?: ReportType) => {
        if (!value) return "-";
        const link = record ? targetLink(record) : null;
        const label = targetName(record) ?? value;
        return link ? (
          <Link to={link} className="text-xs hover:underline">
            {label}
          </Link>
        ) : (
          <span className="text-xs">{label}</span>
        );
      },
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
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
      title: "Người báo",
      dataIndex: "user_name",
      width: 160,
      render: (value?: string, record?: ReportType) =>
        value || record?.user_id || "-",
    },
    {
      title: "Ngày báo",
      dataIndex: "created_at",
      width: 160,
      render: (value?: string) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      render: (_value, record) => (
        <Space size="small">
          <Button size="small" danger onClick={() => handleDelete(record._id)}>
            Bỏ qua
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
    <AdminLayout title="Báo cáo">
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách chờ kiểm duyệt
            </h3>
            <p className="text-sm text-gray-500">
              {reports.length} báo cáo đang chờ kiểm duyệt
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            allowClear
            placeholder="Tìm theo lý do, mô tả..."
            className="max-w-sm"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Select
            allowClear
            placeholder="Lọc theo loại"
            className="w-48"
            value={targetType}
            onChange={setTargetType}
            options={targetTypes.map((item) => ({ value: item, label: item }))}
          />
        </div>

        <Table<ReportType>
          loading={loading}
          columns={columns}
          dataSource={visible.map((report) => ({ ...report, key: report._id }))}
          pagination={{ pageSize: 10, responsive: true }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </AdminLayout>
  );
};

export default Report;
