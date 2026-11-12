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
                100% nông sản hữu cơ
              </h4>
              <h2 className="text-primary mb-10 text-3xl sm:text-4xl lg:text-6xl font-semibold">
                Rau củ & trái cây sạch, tận nguồn
              </h2>
              <p className="text-color text-base sm:text-lg mb-10 max-w-lg mx-auto md:mx-0">
                Sản phẩm được thu mua trực tiếp từ nông trại đạt chuẩn
                VietGAP, giao hàng trong ngày và đổi trả miễn phí nếu không đúng
                ý.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchProduct;
