import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";

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
      <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:ml-20 lg:mr-12 rounded-md">
        <div className="mb-8">
          <h2 className="items-center flex justify-center text-3xl sm:text-4xl font-bold text-center px-4">
            Product Portfolio
          </h2>
        </div>
        <div>
          <Row gutter={[24, 24]}>
            {portfolioItems.map((item) => (
              <Col
                className="gutter-row"
                xs={12}
                sm={12}
                md={6}
                key={item.title}
              >
                <div className="rounded-[10px] bg-[#f4f6f8] p-3 h-full">
                  <a
                    className="block"
                    href=""
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/shop");
                    }}
                  >
                    <div>
                      <img
                        className="rounded w-full h-[130px] sm:h-[160px] lg:h-[180px] object-cover"
                        src={item.image}
                        alt={item.title}
                      />
                    </div>

                    <h2 className="flex justify-center text-base sm:text-xl font-bold mt-4 lg:mt-10 text-center">
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
