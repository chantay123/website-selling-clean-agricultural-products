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
import { useParams } from "react-router-dom";
import { addToCart, getCart, getProductById } from "../../../../apis";
import {
  createProductComment,
  deleteProductComment,
  getProductComments,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { CommentType } from "../../../../@type/global.type";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/config";
import ButtonClick from "../../../../components/Button/ButtonClick";
import Loading from "../../../../components/Loading";
import NotFound from "../../../../components/NotFound";
import { toast } from "react-toastify";
import { setcartnumber, setProduct } from "../../../../redux/userReducer/userReducer";
import { useCallback, useEffect } from "react";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const product = useSelector((state: RootState) => state.user.product);

  /**
   * The product is fetched from the API so that the detail page also works
   * when it is opened directly (deep link) and the store is still empty.
   */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId ?? "");
        if (!cancelled) dispatch(setProduct([response.data]));
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [productId, dispatch]);

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

  /**
   * Reviews.
   *
   * `GET /products/:id/comments` is a private endpoint, so the list is only
   * requested for a signed in visitor. Anonymous visitors still see the tab
   * but get a short invitation to log in.
   */
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!productId) return;
    setCommentsLoading(true);
    try {
      const response = await getProductComments(productId);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCommentsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!isAuthenticated || !productId) return;
    fetchComments();
  }, [isAuthenticated, productId, fetchComments]);

  /** Publishes the review written in the "Leave a Reply" form. */
  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!commentText.trim()) {
      toast.warn("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmitting(true);
      await createProductComment(productId ?? "", {
        content: commentText.trim(),
        rating: value,
      });
      setCommentText("");
      toast.success("Đăng đánh giá thành công");
      fetchComments();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi đăng đánh giá"));
    } finally {
      setSubmitting(false);
    }
  };

  /** Removes a review (admin or author). */
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteProductComment(productId ?? "", commentId);
      toast.success("Xoá đánh giá thành công");
      fetchComments();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá đánh giá"));
    }
  };
  // The product detail is loaded asynchronously, so the page has three
  // states: loading, not found and success. Redirecting while the request
  // is still running would send the user to the 404 page by mistake.
  if (loading) return <Loading />;
  if (detail === undefined) return <NotFound />;
  const buttonAdd = async (product_id: string) => {
    const attributeId = detail?.productAttributes?.[0]?._id;

    if (!attributeId) {
      toast.error("Sản phẩm không có thuộc tính để thêm vào giỏ hàng");
      return;
    }

    try {
      await addToCart({
        items: [
          {
            product_id: product_id,
            product_attribute_id: attributeId,
            quantity: 1,
          },
        ],
      });
      const respones = await getCart();
      dispatch(setcartnumber(respones.data.items.length));
      const message = "add product successfully";
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi thêm vào giỏ hàng"));
    }
  };
  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>
      <div className="mt-24 sm:mt-32 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <div className="border rounded overflow-hidden">
              <a href="">
                <img
                  className="w-full h-auto object-cover"
                  src={detail?.thumbnail_url}
                  alt={detail.name}
                />
              </a>
            </div>
          </Col>
          <Col xs={24} lg={12} className="lg:ml-5">
            <div>
              <h4 className="text-cool-gray-600 text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {detail.name}
              </h4>
              <p className="text-color text-lg sm:text-xl mb-6">
                {" "}
                Category: {detail.category?.name}
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
              <p className="text-color mb-4 text-lg sm:text-xl mt-3">
                {detail?.description}
              </p>
              <p className="text-color text-lg sm:text-xl mb-6">
                Susp endisse ultricies nisi vel quam suscipit. Sabertooth
                peacock flounder chain pickerel hatchetfish, pencilfish
                snailfish
              </p>
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
                {(detail.productAttributes ?? []).map((attr) => (
                  <ButtonClick
                    label="Add to cart"
                    key={attr._id}
                    onClick={() => buttonAdd(detail._id)}
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
                <div className="mt-5 w-full max-w-[500px]">
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
                {!isAuthenticated ? (
                  <p className="text-gray-600">
                    Đăng nhập để xem và gửi đánh giá cho sản phẩm này.
                  </p>
                ) : commentsLoading ? (
                  <p className="text-gray-600">Đang tải đánh giá...</p>
                ) : comments.length === 0 ? (
                  <p className="text-gray-600">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex mb-4 gap-3">
                      <img
                        src={comment.avatar || "/image/avatar.jpg"}
                        className="rounded-full w-16 h-16 sm:w-24 sm:h-24 shrink-0 object-cover"
                        alt="Avatar"
                      />
                      <div className="ml-0 sm:ml-4 flex-1 min-w-0">
                        <p className="mb-2 text-sm">
                          {comment.created_at
                            ? new Date(comment.created_at).toLocaleDateString(
                                "vi-VN"
                              )
                            : ""}
                        </p>
                        <div className="flex flex-wrap justify-between gap-2">
                          <h5 className="break-words">
                            {comment.user_name || comment.username || "Người dùng"}
                          </h5>
                          {comment.rating ? (
                            <div className="flex font-black my-3 mb-4">
                              <Flex gap="middle" vertical>
                                <Flex gap="middle">
                                  <Rate
                                    disabled
                                    defaultValue={comment.rating}
                                    character={({ index = 0 }) =>
                                      customIcons[index + 1]
                                    }
                                  />
                                </Flex>
                              </Flex>
                            </div>
                          ) : null}
                        </div>
                        <p className="break-words">{comment.content || ""}</p>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="mt-2 text-sm text-red-600 underline"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
      <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
        <form action="#" onSubmit={handleSubmitComment}>
          <h4 className="mb-5 font-bold">Leave a Reply</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="border-b rounded">
                <input
                  type="text"
                  className="form-control border-0 w-full p-2"
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={(event) => setCommentName(event.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="border-b rounded">
                <input
                  type="email"
                  className="form-control border-0 w-full p-2"
                  placeholder="Your Email *"
                  value={commentEmail}
                  onChange={(event) => setCommentEmail(event.target.value)}
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
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
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
                  disabled={submitting}
                  className="btn border border-secondary text-primary rounded-full px-4 py-3 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Comment"}
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
