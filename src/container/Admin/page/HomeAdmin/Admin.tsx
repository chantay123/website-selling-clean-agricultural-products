import Sidebar from "../../components/Sidebar";
import HeaderAdmin from "../../components/HeaderAdmin";
import SalesFunnelChart from "../../components/SalesFunnelChart";
import CategoriesChart from "../../components/CategoriesChart";
import { Col, Row } from "antd";

const Admin = () => {
  return (
    <div className="bg-[#F2F9F6] w-full h-full ">
      <div className="flex">
        <div className="flex">
          <div className="  w-64  bg-white dark:bg-gray-800 ">
            <div className=" mt-10 text-gray-500 dark:text-gray-400">
              <p className="ml-6 mt-10 text-3xl font-bold text-[#022928] dark:text-gray-200  ">
                Fruitables
              </p>
              <Sidebar />
            </div>
          </div>
        </div>
        <div className=" ml-8">
          <HeaderAdmin />
          <div className="flex"></div>
          <Row>
            <Col span={16}>
              <SalesFunnelChart />
            </Col>
            <Col span={8}>
              <CategoriesChart />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Admin;
