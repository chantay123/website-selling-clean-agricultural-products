import "tailwindcss/tailwind.css";
import "./style.scss";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

/**
 * Promotional banner between the product lists.
 *
 * The two columns stack on narrow screens, otherwise the headline would be
 * squeezed into an unreadable width.
 */
const ExoticFruits = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-yellow-300 py-12 lg:py-0 lg:h-[700px]">
      <Row gutter={[24, 24]} className="h-full">
        <Col xs={24} md={12}>
          <div className="lg:ml-20 lg:mt-[200px] px-5 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold">
              Trái cây tươi
            </h2>
            <p className="text_store text-4xl sm:text-5xl lg:text-6xl mb-5">
              Thu hoạch đúng vụ
            </p>
            <p className="text_detail text-base mb-10 max-w-xl mx-auto lg:mx-0">
              Sầu riêng Riêng Vàng, xoài cát Hòa Lộc, bơ sáp 034 và nhiều loại
              trái cây nhiệt đới được thu mua trực tiếp tại vườn, đóng gói
              trong ngày và giao đến tận cửa với giá tại vườn.
            </p>
            <a
              onClick={(event) => {
                event.preventDefault();
                navigate("/shop");
              }}
              href=""
              className="btn_buy inline-block border-2 rounded-[30px] text-xl px-12 py-3"
            >
              Mua ngay
            </a>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="lg:mr-20 lg:mt-28 lg:ml-20 relative max-w-xl mx-auto px-5">
            <img
              className="w-full h-auto"
              src="/image/baner-1.png"
              alt="Trái cây tươi tại Agrimarket"
            />
            <div className="absolute rounded-full bg-gray-50 w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] top-0 left-0 flex flex-col items-center justify-center">
              <h4 className="text_Kg text-[24px] sm:text-[34px] font-bold leading-tight">
                165.000 đ
              </h4>
              <p className="text-sm text-gray-500 mt-1">/kg sầu riêng</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ExoticFruits;
