import { Flex } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import requestApi from "../../utils/interceptors";
import ButtonClick from "../Button/ButtonClick";
import { setcartnumber } from "../../redux/userReducer/userReducer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
  width: "310px",
};

const Cart = () => {
  const dispatch = useDispatch();

  //props
  const buttonAdd = async (product_id: string) => {
    try {
      await requestApi("carts", "POST", {
        items: [
          {
            product: product_id,
            quantity: 1,
          },
        ],
      });
      const respones = await requestApi("carts", "GET", {});
      const list = respones.data.data;
      dispatch(setcartnumber(list.items.length));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const respone = await requestApi("carts", "GET", {});
        const list = respone.data.data;
        console.log(respone);
        dispatch(setcartnumber(list.items.length));
      } catch (error) {}
    };
    fetchCart();
  }, []);

  const filterProduct = useSelector((state: RootState) => state.user.product);
  console.log(filterProduct);
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
                {product.sold}$/KG
              </p>
              {product.productAttributes.map((attr, index) => (
                <ButtonClick
                  label="Add to cart"
                  key={`${product._id}-${index}`}
                  onClick={() => buttonAdd(product._id)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </Flex>
  );
};

export default Cart;
