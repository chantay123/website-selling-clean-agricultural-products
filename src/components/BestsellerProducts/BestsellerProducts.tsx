import { Col, Flex, Rate, Row } from "antd";
import Button from "../Button";
import { StarFilled } from "@ant-design/icons";
import Fancybox from "../Fancybox";
const style: React.CSSProperties = { background: "", padding: "" };
const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

const BestsellerProducts = () => {
  return (
    <div className="mt-20 mr-20 ml-20 ">
      <div className="flex justify-center">
        <h2 className="text-5xl font-bold">Bestseller Products</h2>
      </div>
      <div className=" " style={{ margin: "0 auto" }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="mt-20 ">
          <Col
            span={8}
            className="gutter-row bg-gray-100 p-4 rounded-md border-4 border-white "
          >
            <Row>
              <Col span={12}>
                <Fancybox>
                  <a
                    data-fancybox="gallery"
                    href="../../../public/image/best-product-4.jpg"
                  >
                    <img
                      className="rounded-full  "
                      src="../../../public/image/best-product-4.jpg"
                      alt=""
                    />
                  </a>
                </Fancybox>
              </Col>
              <Col span={12}>
                <div className="ml-8 mt-6 ">
                  <a href="#" className="text-xl font-bold text_store ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            span={8}
            className="gutter-row bg-gray-100 p-4 rounded-md border-4 border-white   "
          >
            <Row>
              <Col span={12}>
                <img
                  className="rounded-full"
                  src="../../../public/image/best-product-2.jpg"
                  alt=""
                />
              </Col>
              <Col span={12} className="">
                <div className="ml-8 mt-6 leading-6">
                  <a href="#" className="text-xl font-bold text_store ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            span={8}
            className="gutter-row  bg-gray-100 p-4 rounded-md border-4 border-white   "
          >
            <Row>
              <Col span={12}>
                <img
                  className="rounded-full"
                  src="../../../public/image/best-product-6.jpg"
                  alt=""
                />
              </Col>
              <Col span={12} className="">
                <div className="ml-8 mt-6 leading-6">
                  <a href="#" className="text-xl font-bold text_store ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col
            span={8}
            className="bg-gray-100 p-4 rounded-md border-4 border-white   "
          >
            <Row>
              <Col span={12}>
                <img
                  className="rounded-full  "
                  src="../../../public/image/best-product-1.jpg"
                  alt=""
                />
              </Col>
              <Col span={12} className="">
                <div className="ml-8 mt-6 ">
                  <a href="#" className="text-xl font-bold text_store ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store  ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            span={8}
            className="bg-gray-100 p-4 rounded-md border-4 border-white  "
          >
            <Row>
              <Col span={12}>
                <img
                  className="rounded-full"
                  src="../../../public/image/best-product-5.jpg"
                  alt=""
                />
              </Col>
              <Col span={12} className="">
                <div className="ml-8 mt-6 leading-6">
                  <a href="#" className="text-xl font-bold text_store ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store  ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            span={8}
            className="bg-gray-100 p-4 rounded-md border-4 border-white   "
          >
            <Row>
              <Col span={12}>
                <img
                  className="rounded-full"
                  src="../../../public/image/best-product-3.jpg"
                  alt=""
                />
              </Col>
              <Col span={12} className="">
                <div className="ml-8 mt-6 leading-6">
                  <a href="#" className="text-xl font-bold text_store  ">
                    Organic Tomato
                  </a>
                  <div className="flex font-black my-3 justify-center ">
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
                  <h4 className=" mb-5 text-2xl font-bold text_store  ">
                    3.12 $
                  </h4>
                  <Button />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className=" mt-10">
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <img
              className="rounded-xl w-[400px] h-[250px]"
              src="../../../public/image/vegetable-item-2.jpg"
              alt=""
            />
            <div className=" mt-4 ">
              <a
                href="#"
                className="text-xl font-bold flex justify-center text_store  "
              >
                Organic Tomato
              </a>
              <div className="flex font-black my-3 justify-center">
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
              <h4 className="text-2xl font-bold flex justify-center mb-4 text_store  ">
                3.12 $
              </h4>
              <div className="flex justify-center ">
                <Button />
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <img
              className="rounded-xl w-[400px] h-[250px]"
              src="../../../public/image/vegetable-item-1.jpg"
              alt=""
            />
            <div className=" mt-4 ">
              <a
                href="#"
                className="text-xl font-bold flex justify-center text_store   "
              >
                Organic Tomato
              </a>
              <div className="flex font-black my-3 justify-center">
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
              <h4 className="text-2xl font-bold flex justify-center mb-4  text_store ">
                3.12 $
              </h4>
              <div className="flex justify-center ">
                <Button />
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <img
              className="rounded-xl w-[400px] h-[250px]"
              src="../../../public/image/vegetable-item-4.jpg"
              alt=""
            />
            <div className=" mt-4 ">
              <a
                href="#"
                className="text-xl font-bold flex justify-center text_store  "
              >
                Organic Tomato
              </a>
              <div className="flex font-black my-3 justify-center ">
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
              <h4 className="text-2xl font-bold flex justify-center mb-4 text_store ">
                3.12 $
              </h4>
              <div className="flex justify-center ">
                <Button />
              </div>
            </div>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <img
              className="rounded-xl w-[400px] h-[250px]"
              src="../../../public/image/vegetable-item-6.jpg"
              alt=""
            />
            <div className=" mt-4 ">
              <a
                href="#"
                className="text-xl font-bold flex justify-center text_store   "
              >
                Organic Tomato
              </a>
              <div className="flex font-black my-3 justify-center">
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
              <h4 className="text-2xl font-bold flex justify-center mb-4 text_store ">
                3.12 $
              </h4>
              <div className="flex justify-center ">
                <Button />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BestsellerProducts;
