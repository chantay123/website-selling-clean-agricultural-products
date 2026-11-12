import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAdminAccess } from "../../hooks/useAdminAccess";
import Loading from "../../../../components/Loading/Loading";

/**
 * Screen shown when the visitor is not allowed to open an admin page.
 *
 * It also covers the loading state so the page never flashes the forbidden
 * message while the profile request is still running.
 */
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, checked } = useAdminAccess();
  const navigate = useNavigate();

  if (!checked) {
    return <Loading />;
  }

  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang quản trị."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Về trang bán hàng
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
