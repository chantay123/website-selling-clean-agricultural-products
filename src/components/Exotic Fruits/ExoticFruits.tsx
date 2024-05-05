import "tailwindcss/tailwind.css";
import "./style.scss";
import { Col, Row } from "antd";

const ExoticFruits = () => {
  return (
    <div className="w-full h-[700px] bg-yellow-300 ">
      <div>
        <Row>
          <Col span={12}>
            <div className="ml-20 mt-[200px]">
              <h2 className="text-6xl text-white font-bold">
                Fresh Exotic Fruits
              </h2>
              <p className="text_store  text-6xl mb-5">in Our Store</p>
              <p className="text_detail text-base mb-10">
                The generated Lorem Ipsum is therefore always free from
                repetition injected humour, or non-characteristic words etc.
              </p>
              <a
                href="#"
                className="btn_buy border-2 rounded-[30px] text-xl px-12 py-3 p-4 "
              >
                Buy
              </a>
            </div>
          </Col>
          <Col span={12}>
            <div className="mr-20 mt-28 ml-20 relative">
              <img
                src="http://127.0.0.1:5500/fruitables-1.0.0/img/baner-1.png"
                alt=""
              />
              <div className="absolute rounded-full bg-gray-50 w-[140px] h-[140px] top-0 left-0">
                <h4 className="text_Kg text-[50px] ml-2 mt-7 font-normal">
                  2$/kg
                </h4>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ExoticFruits;
