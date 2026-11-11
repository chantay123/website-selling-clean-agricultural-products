import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";
const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  padding: "14px 14px",
  height: "300px",
};

/**
 * The images live in `public/image`, which Vite copies to the root of the
 * build output. They must therefore be referenced with an absolute path
 * (`/image/...`); a relative path such as `../../../public/image/...` only
 * resolves in the dev server and results in a broken image in production.
 */
const portfolioItems = [
  {
    title: "Mushrooms of all kinds",
    image: "/image/fruite-item-3.jpg",
  },
  {
    title: "Special Location",
    image: "/image/featur-1.jpg",
  },
  {
    title: "Vegetables",
    image: "/image/vegetable-item-1.jpg",
  },
  {
    title: "Fruits",
    image: "/image/fruite-item-1.jpg",
  },
];

const ProductPortfolio = () => {
  const navigate = useNavigate();
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
            {portfolioItems.map((item) => (
              <Col className="gutter-row" span={6} key={item.title}>
                <div style={style} className="rounded-[10px]">
                  <a className="bg-red-700" href="">
                    <div>
                      <img
                        onClick={() => navigate("/shop")}
                        className="rounded mb-10 w-[300px] h-[180px] object-cover"
                        src={item.image}
                        alt={item.title}
                      />
                    </div>

                    <h2 className="flex justify-center text-xl font-bold mt-10 ">
                      {item.title}
                    </h2>
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductPortfolio;
