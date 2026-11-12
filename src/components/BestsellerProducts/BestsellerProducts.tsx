import { Col, Flex, Rate, Row } from "antd";
import Button from "../Button";
import { StarFilled } from "@ant-design/icons";
import Fancybox from "../Fancybox";
import "./style.scss";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../../apis";
import { setProduct } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";
import { formatVND } from "../../utils/price";
import { productTypes } from "../../@type/global.type";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

/** The star rating of a product teaser. */
const Rating = ({ value = 4 }: { value?: number }) => (
  <div className="flex font-black my-3">
    <Flex gap="middle" vertical>
      <Flex gap="middle">
        <Rate
          disabled
          value={value}
          character={({ index = 0 }) => customIcons[index + 1]}
        />
      </Flex>
    </Flex>
  </div>
);

/** Reads the price and the unit of one packaging of a product. */
const readPrice = (product: productTypes) => {
  const attribute = product.productAttributes?.[0];
  return {
    price: attribute?.discount_price ?? product.price ?? 0,
    originalPrice: attribute?.original_price ?? 0,
    unit: attribute?.unit_of_measurement ?? "kg",
    discountPercent: attribute?.discounted_percent ?? 0,
  };
};

const BestsellerProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.user.product);

  /**
   * The section is rendered from the real catalogue, therefore the products
   * are fetched once when the section mounts.
   */
  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (!cancelled) dispatch(setProduct(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const { bestsellers, gridItems } = useMemo(() => {
    const withPrice = products.filter((item) => readPrice(item).price > 0);

    const hot = withPrice
      .filter((item) => item.hot)
      .sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));

    const bestsellers = (hot.length >= 6 ? hot : withPrice).slice(0, 6);
    const gridItems = withPrice
      .filter((item) => !bestsellers.some((best) => best._id === item._id))
      .slice(0, 4);

    return { bestsellers, gridItems };
  }, [products]);

  return (
    <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:mx-20">
      <div className="flex justify-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center px-4">
          Sản phẩm bán chạy
        </h2>
      </div>

      <Row gutter={[24, 24]} className="mt-10 lg:mt-20">
        {bestsellers.map((item) => {
          const { price, originalPrice, unit, discountPercent } =
            readPrice(item);

          return (
            <Col
              key={item._id}
              xs={24}
              sm={12}
              lg={8}
              className="gutter-row bg-gray-100 p-4 rounded-md border-4 border-white"
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={10} lg={12}>
                  <Fancybox>
                    <a data-fancybox="gallery" href={item.thumbnail_url}>
                      <img
                        className="rounded-full w-full h-auto"
                        src={item.thumbnail_url}
                        alt={item.name}
                      />
                    </a>
                  </Fancybox>
                </Col>
                <Col xs={12} sm={14} lg={12}>
                  <div className="lg:ml-8 lg:mt-6 leading-6">
                    <Link
                      to={`product/${item._id}`}
                      className="text-xl font-bold text_store"
                    >
                      {item.name}
                    </Link>
                    <Rating value={item.rating ?? 4} />
                    <div className="mb-5">
                      <h4 className="text-2xl font-bold text_store">
                        {formatVND(price)}/{unit}
                      </h4>
                      {discountPercent > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatVND(originalPrice)}/{unit}
                        </p>
                      )}
                    </div>
                    <Button label="Thêm vào giỏ" />
                  </div>
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>

      <Row gutter={[24, 24]} className="mt-8 lg:mt-10">
        {gridItems.map((item) => {
          const { price, unit, discountPercent } = readPrice(item);

          return (
            <Col key={item._id} xs={12} sm={12} md={6} className="gutter-row">
              <div className="h-full">
                <Link to={`product/${item._id}`}>
                  <img
                    className="rounded-xl w-full h-[180px] sm:h-[220px] lg:h-[250px] object-cover"
                    src={item.thumbnail_url}
                    alt={item.name}
                  />
                </Link>
                <div className="mt-4">
                  <Link
                    to={`product/${item._id}`}
                    className="text-xl font-bold flex justify-center text_store text-center px-2"
                  >
                    {item.name}
                  </Link>
                  <div className="flex font-black my-3 justify-center">
                    <Rating value={item.rating ?? 4} />
                  </div>
                  <h4 className="text-2xl font-bold flex justify-center mb-4 text_store">
                    {formatVND(price)}/{unit}
                  </h4>
                  {discountPercent > 0 && (
                    <p className="text-center text-sm text-red-500 -mt-2 mb-3">
                      Giảm {discountPercent}%
                    </p>
                  )}
                  <div className="flex justify-center">
                    <Button label="Thêm vào giỏ" />
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default BestsellerProducts;
