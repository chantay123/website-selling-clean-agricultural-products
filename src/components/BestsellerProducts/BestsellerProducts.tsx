import { Col, Flex, Rate, Row } from "antd";
import Button from "../Button";
import { StarFilled } from "@ant-design/icons";
import Fancybox from "../Fancybox";
import "./style.scss";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

/**
 * The products displayed in the section.
 *
 * The data was hardcoded in the markup before; moving it into a list keeps
 * the responsive markup free of repetition and makes the grid uniform.
 */
const bestsellerItems = [
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-4.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-2.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-6.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-1.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-5.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/best-product-3.jpg" },
];

const gridItems = [
  { name: "Organic Tomato", price: "3.12 $", image: "/image/vegetable-item-2.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/vegetable-item-1.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/vegetable-item-4.jpg" },
  { name: "Organic Tomato", price: "3.12 $", image: "/image/vegetable-item-6.jpg" },
];

/** The star rating shared by every teaser of the section. */
const Rating = () => (
  <div className="flex font-black my-3">
    <Flex gap="middle" vertical>
      <Flex gap="middle">
        <Rate
          disabled
          defaultValue={4}
          character={({ index = 0 }) => customIcons[index + 1]}
        />
      </Flex>
    </Flex>
  </div>
);

const BestsellerProducts = () => {
  return (
    <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:mx-20">
      <div className="flex justify-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
          Bestseller Products
        </h2>
      </div>

      <Row gutter={[24, 24]} className="mt-10 lg:mt-20">
        {bestsellerItems.map((item) => (
          <Col
            key={item.image}
            xs={24}
            sm={12}
            lg={8}
            className="gutter-row bg-gray-100 p-4 rounded-md border-4 border-white"
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={10} lg={12}>
                <Fancybox>
                  <a data-fancybox="gallery" href={item.image}>
                    <img
                      className="rounded-full w-full h-auto"
                      src={item.image}
                      alt={item.name}
                    />
                  </a>
                </Fancybox>
              </Col>
              <Col xs={12} sm={14} lg={12}>
                <div className="lg:ml-8 lg:mt-6 leading-6">
                  <a href="#" className="text-xl font-bold text_store">
                    {item.name}
                  </a>
                  <Rating />
                  <h4 className="mb-5 text-2xl font-bold text_store">{item.price}</h4>
                  <Button label="Add to cart" />
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} className="mt-8 lg:mt-10">
        {gridItems.map((item) => (
          <Col key={item.image} xs={12} sm={12} md={6} className="gutter-row">
            <div className="h-full">
              <img
                className="rounded-xl w-full h-[180px] sm:h-[220px] lg:h-[250px] object-cover"
                src={item.image}
                alt={item.name}
              />
              <div className="mt-4">
                <a
                  href="#"
                  className="text-xl font-bold flex justify-center text_store text-center px-2"
                >
                  {item.name}
                </a>
                <div className="flex font-black my-3 justify-center">
                  <Rating />
                </div>
                <h4 className="text-2xl font-bold flex justify-center mb-4 text_store">
                  {item.price}
                </h4>
                <div className="flex justify-center">
                  <Button label="Add to cart" />
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BestsellerProducts;
