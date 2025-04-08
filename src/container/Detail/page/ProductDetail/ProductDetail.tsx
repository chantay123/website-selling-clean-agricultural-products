import { Col, Flex, Layout, Rate, Row } from "antd";
import HeaderItem from "../../../../components/HeaderItem";
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useState } from "react";
import "./style.scss";
import Footer from "../../../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import requestApi from "../../../../utils/interceptors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/config";
import ButtonClick from "../../../../components/Button/ButtonClick";
import { toast } from "react-toastify";
import { setcartnumber } from "../../../../redux/userReducer/userReducer";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const product = useSelector((state: RootState) => state.user.product);

  const detail = product.find((p) => p._id === productId);

  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const [value, setValue] = useState(3);
  if (detail === undefined) {
    navigate("*");
    return;
  }
  const buttonAdd = async (attribute_id: string, product_id: string) => {
    try {
      await requestApi("carts/items", "POST", {
        items: [
          {
            product_id: product_id,
            product_attribute_id: attribute_id,
            quantity: 1,
          },
        ],
      });
      const respones = await requestApi("carts", "GET", {});
      const list = respones.data.data;
      dispatch(setcartnumber(list.carts.length));
      const message = "add product successfully";
      toast.success(message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>
      <div className="mt-32 ml-20 mr-20">
        <Row>
          <Col span={8}>
            <div className="border rounded ">
              <a href="">
                <img src={detail?.thumbnail_url} alt="" />
              </a>
            </div>
          </Col>
          <Col span={12} className=" ml-5">
            <div>
              <h4 className=" text-cool-gray-600 text-4xl font-bold mb-4 ">
                {detail.name}
              </h4>
              <p className=" text-color text-xl mb-6">
                {" "}
                Category: {detail.category.name}
              </p>
            </div>
            <div className="flex font-black my-3 mb-4 ">
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
            <div>
              <p className=" text-color mb-4 text-xl  mt-3 ">
                {detail?.description}
              </p>
              {/* <p className="text-color text-xl mb-6">
                Susp endisse ultricies nisi vel quam suscipit. Sabertooth
                peacock flounder chain pickerel hatchetfish, pencilfish
                snailfish
              </p> */}
            </div>
            <div>
              <div className="flex items-center w-24 mb-5 mt-5">
                <button
                  className="w-8 h-8 text-center -200 border border-gray-300 rounded-full"
                  onClick={handleDecrement}
                >
                  <i>
                    <MinusCircleOutlined />
                  </i>
                </button>
                <input
                  type="text"
                  className="w-12 h-8 mx-2 text-center border-0 bg-gray-200 rounded-full"
                  value={quantity}
                  readOnly
                />
                <button
                  className="w-8 h-8 text-center  border border-gray-300 rounded-full"
                  onClick={handleIncrement}
                >
                  <i className="fa fa-plus">
                    <PlusCircleOutlined />
                  </i>
                </button>
              </div>
              <div className="mt-6">
                {detail.attributes.map((attr) => (
                  <ButtonClick
                    key={attr._id}
                    onclick={() => buttonAdd(attr._id, detail._id)}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt-10">
          <nav>
            <div className="flex border-b mb-3">
              <button
                className={`px-4 py-2 text-base ${
                  activeTab === "description"
                    ? "border-b-2 border-yellow-300 text-green-400 font-semibold"
                    : "text-gray-500"
                }`}
                type="button"
                role="tab"
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 text-base ${
                  activeTab === "reviews"
                    ? "border-b-2 border-yellow-300 text-green-400 font-semibold"
                    : "text-gray-500"
                }`}
                type="button"
                role="tab"
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>
          </nav>
          <div className="tab-content mb-5">
            {activeTab === "description" && (
              <div className="tab-pane " id="nav-about" role="tabpanel">
                <p>
                  The generated Lorem Ipsum is therefore always free from
                  repetition injected humour, or non-characteristic words etc.
                  Susp endisse ultricies nisi vel quam suscipit
                </p>
                <p>
                  Sabertooth peacock flounder; chain pickerel hatchetfish,
                  pencilfish snailfish filefish Antarctic icefish goldeye
                  aholehole trumpetfish pilot fish airbreathing catfish,
                  electric ray sweeper.
                </p>
                <div className="mt-5 w-[500px]">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 bg-gray-100 text-center py-2">
                      <div className="col-span-1">
                        <p className="mb-0">Weight</p>
                      </div>
                      <div className="col-span-1">
                        <p className="mb-0">1 kg</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 text-center py-2">
                      <div className="col-span-1">
                        <p className="mb-0">Country of Origin</p>
                      </div>
                      <div className="col-span-1">
                        <p className="mb-0">Agro Farm</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 bg-gray-100 text-center py-2">
                      <div className="col-span-1">
                        <p className="mb-0">Quality</p>
                      </div>
                      <div className="col-span-1">
                        <p className="mb-0">Organic</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 text-center py-2">
                      <div className="col-span-1">
                        <p className="mb-0">Сheck</p>
                      </div>
                      <div className="col-span-1">
                        <p className="mb-0">Healthy</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 bg-gray-100 text-center py-2">
                      <div className="col-span-1">
                        <p className="mb-0">Min Weight</p>
                      </div>
                      <div className="col-span-1">
                        <p className="mb-0">250 Kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="tab-pane" id="nav-mission">
                <div className="flex mb-4">
                  <img
                    src="img/avatar.jpg"
                    className="rounded-full p-3 w-24 h-24"
                    alt="Avatar"
                  />
                  <div className="ml-4">
                    <p className="mb-2 text-sm">April 12, 2024</p>
                    <div className="flex justify-between">
                      <h5>Jason Smith</h5>
                      <div className="flex font-black my-3 mb-4 ">
                        <Flex gap="middle" vertical>
                          <Flex gap="middle">
                            <Rate
                              disabled
                              defaultValue={4}
                              character={({ index = 0 }) =>
                                customIcons[index + 1]
                              }
                            />
                          </Flex>
                        </Flex>
                      </div>
                    </div>
                    <p>
                      The generated Lorem Ipsum is therefore always free from
                      repetition injected humour, or non-characteristic words
                      etc. Susp endisse ultricies nisi vel quam suscipit{" "}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <img
                    src="img/avatar.jpg"
                    className="rounded-full p-3 w-24 h-24"
                    alt="Avatar"
                  />
                  <div className="ml-4">
                    <p className="mb-2 text-sm">April 12, 2024</p>
                    <div className="flex justify-between">
                      <h5>Sam Peters</h5>
                      <div className="flex font-black my-3 mb-4 ">
                        <Flex gap="middle" vertical>
                          <Flex gap="middle">
                            <Rate
                              disabled
                              defaultValue={4}
                              character={({ index = 0 }) =>
                                customIcons[index + 1]
                              }
                            />
                          </Flex>
                        </Flex>
                      </div>
                    </div>
                    <p>
                      The generated Lorem Ipsum is therefore always free from
                      repetition injected humour, or non-characteristic words
                      etc. Susp endisse ultricies nisi vel quam suscipit{" "}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "vision" && (
              <div className="tab-pane">
                <p className="text-gray-700">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum et
                  tempor sit. Aliqu diam amet diam et eos labore. 3
                </p>
                <p className="mb-0">
                  Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et
                  eos labore. Clita erat ipsum et lorem et sit
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" mt-20 ml-20 mr-20 ">
        <form action="#">
          <h4 className="mb-5 font-bold">Leave a Reply</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="border-b rounded">
                <input
                  type="text"
                  className="form-control border-0 w-full p-2"
                  placeholder="Your Name *"
                />
              </div>
            </div>
            <div>
              <div className="border-b rounded">
                <input
                  type="email"
                  className="form-control border-0 w-full p-2"
                  placeholder="Your Email *"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="border-b rounded my-4">
                <textarea
                  name=""
                  id=""
                  className="form-control border-0 w-full p-2"
                  placeholder="Your Review *"
                  spellCheck="false"
                ></textarea>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between py-3 mb-5">
                <div className="flex items-center">
                  <p className="mb-0 mr-3">Please rate:</p>
                  <Flex gap="middle" vertical>
                    <Rate onChange={setValue} value={value} />
                  </Flex>
                </div>
                <button
                  type="submit"
                  className="btn border border-secondary text-primary rounded-full px-4 py-3"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;
