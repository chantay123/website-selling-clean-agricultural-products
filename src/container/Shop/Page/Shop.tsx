import { Col, Layout, Row } from "antd";
import HeaderItem from "../../../components/HeaderItem";
import "./style.scss";
import Categories from "../../../components/Categories";

import Cart from "../../../components/Cart";
import Footer from "../../../components/Footer";

/**
 * Shop page.
 *
 * The sidebar holds the filters and moves below the product grid on a narrow
 * screen so the products stay in the first rows.
 */
const Shop = () => {
  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>
      <div>
        <h1 className="text-3xl sm:text-4xl mb-4 mt-24 sm:mt-32 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
          Fresh fruits shop
        </h1>
        <div className="mx-5 sm:mx-10 lg:ml-16 lg:mr-20">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={18} xl={16}>
              <Cart />
            </Col>
            <Col xs={24} lg={6} xl={8}>
              <Categories />
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
