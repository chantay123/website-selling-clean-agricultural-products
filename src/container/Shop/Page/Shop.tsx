import { Col, Layout, Row } from "antd";
import HeaderItem from "../../../components/HeaderItem";
import "./style.scss";
import Categories from "../../../components/Categories";

import Cart from "../../../components/Cart";
import Footer from "../../../components/Footer";

const Shop = () => {
  return (
    <div>
      <Layout>
        <div>
          <HeaderItem />
        </div>
      </Layout>
      <div>
        <h1 className="text text-4xl mb-4 mt-32 ml-20 mr-20 ">
          Fresh fruits shop
        </h1>
        <div className="  ml-16 mr-20">
          <Row>
            <Col span={18} push={6}>
              <Cart />
            </Col>
            <Col span={6} pull={18}>
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
