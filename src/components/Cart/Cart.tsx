import { Flex } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { addToCart, getCart } from "../../apis";
import ButtonClick from "../Button/ButtonClick";
import { setcartnumber } from "../../redux/userReducer/userReducer";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
  width: "310px",
};

const Cart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  //props
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
        const respone = await getCart();
        dispatch(setcartnumber(respone.data.items.length));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const filterProduct = useSelector((state: RootState) => state.user.product);
  return (
    <Flex wrap="wrap" gap="35px">
      {filterProduct.map((product) => (
        <div key={product._id} className="gutter-row  ">
          <div style={style} className="rounded-[10px] relative">
            <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
              {product.category?.name}
            </div>
            <div className="">
              <Link to={`/product/${product._id}`}>
                <img
                  className="w-[400px] h-[200px] rounded object-cover"
                  src={product.thumbnail_url}
                  alt=""
                />
              </Link>
            </div>
            <h2 className="flex justify-center text-2xl font-bold mt-8 ">
              {product.name}
            </h2>
            <div className="flex  mt-30 items-center justify-evenly mt-5">
              <p className=" text_money p-4 text-xl  font-popins font-semibold">
                {product.price}$/KG
              </p>
              <ButtonClick
                label="Add to cart"
                key={`${product._id}`}
                onClick={() => buttonAdd(product._id)}
              />
            </div>
          </div>
        </div>
      ))}
    </Flex>
  );
};

export default Cart;
