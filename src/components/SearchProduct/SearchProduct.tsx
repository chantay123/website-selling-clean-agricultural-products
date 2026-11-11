import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
import CarouselItem from "../CarouselItem";

/**
 * Hero section of the home page.
 *
 * The layout stacks the carousel and the headline on narrow screens so the
 * hero never overflows on a phone.
 */
const SearchProduct = () => {
  return (
    <div className="header__top">
      <div className="mx-4 sm:mx-6 lg:mx-20 flex">
        <Row gutter={[24, 24]} className="w-full">
          <Col xs={24} md={12}>
            <div className="mt-24 sm:mt-32 lg:mt-44 lg:ml-32">
              <CarouselItem />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-center md:text-left">
              <h4 className="text-secondary mb-3 text-xl sm:text-2xl mt-10 md:mt-40 font-semibold">
                100% Organic Foods
              </h4>
              <h2 className="text-primary mb-10 text-3xl sm:text-4xl lg:text-6xl font-semibold">
                Organic Veggies & Fruits Foods
              </h2>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchProduct;
