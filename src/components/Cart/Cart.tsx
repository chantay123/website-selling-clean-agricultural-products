import { Col, Row } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { addToCart, getCart } from "../../apis";
import ButtonClick from "../Button/ButtonClick";
import { setcartnumber } from "../../redux/userReducer/userReducer";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Product grid of the shop page.
 *
 * The cards use a fluid width instead of a fixed one so the grid adapts to
 * the container without overflowing on a phone.
 */
const Cart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const buttonAdd = async (product_id: string) => {
    const target = filterProduct.find((item) => item._id === product_id);
    const attributeId = target?.productAttributes?.[0]?._id;

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
      toast.success("add product successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // The cart is a private resource: calling it while the visitor is not
    // logged in would return a 401 and the interceptor would send the guest
    // to the login page.
    if (!isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const respones = await getCart();
        dispatch(setcartnumber(respones.data.items.length));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const filterProduct = useSelector((state: RootState) => state.user.product);

  return (
    <Row gutter={[24, 24]}>
      {filterProduct.map((product) => (
        <Col key={product._id} xs={12} sm={12} md={8} xl={6}>
          <div className="rounded-[10px] relative bg-[#f4f6f8] h-full flex flex-col">
            <div className="absolute text-white px-4 py-1 m-3 rounded-[10px] bg-green-400 text-sm">
              {product.category?.name}
            </div>
            <div>
              <Link to={`/product/${product._id}`}>
                <img
                  className="w-full h-[160px] sm:h-[200px] rounded object-cover"
                  src={product.thumbnail_url}
                  alt={product.name}
                />
              </Link>
            </div>
            <h2 className="flex justify-center text-lg sm:text-2xl font-bold mt-4 px-2 text-center">
              {product.name}
            </h2>
            <div className="flex items-center justify-evenly mt-3 mb-4 px-2 mt-auto">
              <p className="text_money text-base sm:text-xl font-popins font-semibold">
                {product.price}$/KG
              </p>
              <ButtonClick
                label="Add to cart"
                key={`${product._id}`}
                onClick={() => buttonAdd(product._id)}
              />
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Cart;
