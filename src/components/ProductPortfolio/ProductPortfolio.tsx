import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  padding: "14px 14px",
  height: "300px",
};

const ProductPortfolio = () => {
  return (
    <div>
      <div className=" mt-20 ml-20 mr-12 rounded-md">
        <div className="mb-8 ">
          <h2 className="items-center flex justify-center text-4xl font-bold">
            Product Portfolio
          </h2>
        </div>
        <div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
              <div style={style} className="rounded-[10px]">
                <a className="bg-red-700" href="">
                  <div>
                    <img
                      className="rounded mb-10 w-[300px] h-[180px]"
                      src="https://linhchihoanggia.com/data/images/nam-huong-dong-co.jpg"
                      alt=""
                    />
                  </div>

                  <h2 className="flex justify-center text-xl font-bold mt-10 ">
                    Mushrooms of all kinds
                  </h2>
                </a>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div style={style} className="rounded-[10px]">
                <img
                  className="w-[300px] h-[180px] rounded"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQREd4iqd30WNFeRkkIWpwLfbopr7J96VkAiQnuhVBDkw&s "
                  alt=""
                />
                <h2 className="flex justify-center text-xl font-bold mt-10 ">
                  Special Location
                </h2>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div style={style} className="rounded-[10px]">
                <img
                  className="w-[300px] h-[180px] rounded"
                  src="https://atvstp.namdinh.gov.vn/wp-content/uploads/2021/09/Cach-lua-chon-va-bao-quan-rau-cu-qua-ngay-Tet.jpg"
                  alt=""
                />
                <h2 className="flex justify-center text-xl font-bold mt-10 ">
                  Vegetables
                </h2>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div style={style} className="rounded-[10px]">
                <img
                  className="w-[300px] h-[180px] rounded"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6ChPzNZ5MCno36L0eyGl-kx-foUMGXIPKow&s"
                  alt=""
                />
                <h2 className="flex justify-center text-xl font-bold mt-10">
                  Fruits
                </h2>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductPortfolio;
