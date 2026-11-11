import SalesFunnelChart from "../../components/SalesFunnelChart";
import CategoriesChart from "../../components/CategoriesChart";
import { Col, Row } from "antd";
import AdminLayout from "../../components/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout title="Dashboard">
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <SalesFunnelChart />
        </Col>
        <Col xs={24} xl={8}>
          <CategoriesChart />
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default Admin;
