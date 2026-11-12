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
import { formatVND } from "../../../../utils/price";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408" }} />,
  2: <StarFilled style={{ color: "#81c408" }} />,
  3: <StarFilled style={{ color: "#81c408" }} />,
  4: <StarFilled style={{ color: "#81c408" }} />,
  5: <StarFilled />,
};

/** Formats a date coming from the API for the specification table. */
const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
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
        if (!cancelled && response.data) {
          dispatch(setProduct([response.data]));
        }
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
    if (!productId) return;
    fetchComments();
  }, [productId, fetchComments]);

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

  const attributes = detail.productAttributes ?? [];
  const selectedAttribute = attributes[0];

  const unit = selectedAttribute?.unit_of_measurement ?? "kg";
  const price = selectedAttribute?.discount_price ?? detail.price ?? 0;
  const originalPrice = selectedAttribute?.original_price ?? price;
  const discountPercent =
    selectedAttribute?.discounted_percent ??
    (originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  const buttonAdd = async (product_id: string) => {
    const attributeId = selectedAttribute?._id;

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
            quantity,
          },
        ],
      });
      const respones = await getCart();
      dispatch(setcartnumber(respones.data.items.length));
      toast.success("Thêm sản phẩm vào giỏ hàng thành công");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi thêm vào giỏ hàng"));
    }
  };

  const specificationRows = [
    { label: "Khối lượng", value: `${selectedAttribute?.weight ?? 1} ${unit}` },
    { label: "Xuất xứ", value: detail.origin || "Việt Nam" },
    {
      label: "Chứng nhận",
      value: selectedAttribute?.certification || "VietGAP",
    },
    {
      label: "Ngày thu hoạch",
      value: formatDate(selectedAttribute?.harvest_date),
    },
    {
      label: "Hạn sử dụng",
      value: formatDate(selectedAttribute?.expiration_date),
    },
    {
      label: "Quy cách",
      value: `${selectedAttribute?.quantity_per_unit ?? 1} ${unit}/đơn vị`,
    },
  ];

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
            {detail.images && detail.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {detail.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image._id ?? index}
                    className="border rounded overflow-hidden"
                  >
                    <img
                      className="w-full h-16 object-cover"
                      src={image.url}
                      alt={`${detail.name} - ảnh ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>
          <Col xs={24} lg={16} className="lg:ml-5">
            <div>
              <h4 className="text-cool-gray-600 text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {detail.name}
              </h4>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-color text-lg sm:text-xl">
                  Danh mục: {detail.category?.name || "Nông sản"}
                </span>
                {detail.hot && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                    Bán chạy
                  </span>
                )}
              </div>
            </div>
            <div className="flex font-black my-3 mb-4 ">
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate
                    disabled
                    value={detail.rating ?? 4}
                    character={({ index = 0 }) => customIcons[index + 1]}
                  />
                  <span className="text-color text-sm">
                    {detail.rating ?? 4}/5 · {detail.numberOfReview ?? 0} đánh giá
                  </span>
                </Flex>
              </Flex>
            </div>

            {/* ---------------------------------------------------------------
                Price block: the price of one kilogram, the price before the
                discount and the discount badge.
            ----------------------------------------------------------------*/}
            <div className="flex flex-wrap items-end gap-4 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-red-600">
                {formatVND(price)}
                <span className="text-lg font-medium">/{unit}</span>
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatVND(originalPrice)}/{unit}
                  </span>
                  <span className="px-2 py-1 rounded bg-red-500 text-white text-sm font-semibold">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
            {selectedAttribute && selectedAttribute.weight > 1 && (
              <p className="text-color mb-4">
                Giá theo quy cách {selectedAttribute.weight} {unit}:{" "}
                <span className="font-semibold text-cool-gray-600">
                  {formatVND(selectedAttribute.total_price)}
                </span>
              </p>
            )}

            <div>
              <p className="text-color mb-4 text-lg sm:text-xl mt-3 whitespace-pre-line">
                {detail?.description}
              </p>
            </div>
            <div>
              <div className="flex items-center w-24 mb-5 mt-5">
                <button
                  className="w-8 h-8 text-center -200 border border-gray-300 rounded-full"
                  onClick={handleDecrement}
                  aria-label="Giảm số lượng"
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
                  aria-label="Tăng số lượng"
                >
                  <i className="fa fa-plus">
                    <PlusCircleOutlined />
                  </i>
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {attributes.length > 0 && (
                  <ButtonClick
                    label="Thêm vào giỏ hàng"
                    onClick={() => buttonAdd(detail._id)}
                  />
                )}
              </div>
              {attributes.length > 1 && (
                <p className="text-color text-sm mt-3">
                  Sản phẩm có {attributes.length} quy cách bán, giá trên là giá
                  của quy cách nhỏ nhất.
                </p>
              )}
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
                Mô tả sản phẩm
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
                Đánh giá ({comments.length})
              </button>
            </div>
          </nav>
          <div className="tab-content mb-5">
            {activeTab === "description" && (
              <div className="tab-pane " id="nav-about" role="tabpanel">
                <p className="whitespace-pre-line text-color">
                  {detail?.description}
                </p>
                <div className="mt-5 w-full max-w-[500px]">
                  <div className="grid grid-cols-1 gap-4">
                    {specificationRows.map((row, index) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-2 text-center py-2 ${
                          index % 2 === 0 ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="col-span-1">
                          <p className="mb-0">{row.label}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="mb-0">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="tab-pane" id="nav-mission">
                {!isAuthenticated ? (
                  <p className="text-gray-600 mb-4">
                    Đăng nhập để gửi đánh giá cho sản phẩm này.
                  </p>
                ) : null}
                {commentsLoading ? (
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
                        alt="Ảnh đại diện"
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
                        {isAuthenticated ? (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="mt-2 text-sm text-red-600 underline"
                          >
                            Xoá
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
        <form action="#" onSubmit={handleSubmitComment}>
          <h4 className="mb-5 font-bold">Viết đánh giá của bạn</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="border-b rounded">
                <input
                  type="text"
                  className="form-control border-0 w-full p-2"
                  placeholder="Tên của bạn *"
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
                  placeholder="Email của bạn *"
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
                  placeholder="Nội dung đánh giá *"
                  spellCheck="false"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between py-3 mb-5">
                <div className="flex items-center">
                  <p className="mb-0 mr-3">Đánh giá sản phẩm:</p>
                  <Flex gap="middle" vertical>
                    <Rate onChange={setValue} value={value} />
                  </Flex>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn border border-secondary text-primary rounded-full px-4 py-3 disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
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
