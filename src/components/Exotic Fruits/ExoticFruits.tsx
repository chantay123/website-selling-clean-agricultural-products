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
              Fresh Exotic Fruits
            </h2>
            <p className="text_store text-4xl sm:text-5xl lg:text-6xl mb-5">
              in Our Store
            </p>
            <p className="text_detail text-base mb-10 max-w-xl mx-auto lg:mx-0">
              The generated Lorem Ipsum is therefore always free from
              repetition injected humour, or non-characteristic words etc.
            </p>
            <a
              onClick={(event) => {
                event.preventDefault();
                navigate("/shop");
              }}
              href=""
              className="btn_buy inline-block border-2 rounded-[30px] text-xl px-12 py-3"
            >
              Buy
            </a>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="lg:mr-20 lg:mt-28 lg:ml-20 relative max-w-xl mx-auto px-5">
            <img
              className="w-full h-auto"
              src="/image/baner-1.png"
              alt="Fresh exotic fruits"
            />
            <div className="absolute rounded-full bg-gray-50 w-[90px] h-[90px] sm:w-[140px] sm:h-[140px] top-0 left-0">
              <h4 className="text_Kg text-[32px] sm:text-[50px] ml-2 mt-4 sm:mt-7 font-normal">
                2$/kg
              </h4>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ExoticFruits;
