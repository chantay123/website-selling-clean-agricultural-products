import "./style.scss";
import { Flex, Layout, Row } from "antd";
import Button from "../Button";
import { useEffect } from "react";
import requestApi from "../../utils/interceptors";
import { setProduct } from "../../redux/userReducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
  width: "310px",
};

const CartProduct = () => {
  const dispatch = useDispatch();
  const fetchProduct = async () => {
    try {
      const respone = await requestApi("products", "GET", {});
      const arr = respone.data.data;
      console.log(arr);
      dispatch(setProduct(arr));
      console.log(respone);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);
  const setproduct = useSelector((state: RootState) => state.user.product);
  return (
    <Layout className="bg-white ml-20 mr-20 mt-10 mb-10">
      <div className="mt-20 items-center flex ">
        <div className=" mt-20 ">
          <div>
            <h2 className="text-4xl font-bold mb-12">Our Organic Products</h2>
          </div>
        </div>
        <div className="mt-10 ml-72">
          <ul className="flex text-xl">
            <li>
              <a href="" className="p-3 border-2 rounded-[30px] ">
                All Products
              </a>
            </li>
            <li>
              <a href="" className="p-3 border-2 rounded-[30px] ml-4">
                Vegetables
              </a>
            </li>
            <li>
              <a href="" className="px-10 py-3 border-2 rounded-[30px] ml-4">
                Fruits
              </a>
            </li>
            <li>
              <a href="" className="px-10 py-3  border-2 rounded-[30px] ml-4">
                Bean
              </a>
            </li>
            <li>
              <a href="" className="p-3 border-2 rounded-[30px] ml-4">
                Mushroom
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Flex wrap="wrap" gap="35px">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="gutter-row ">
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                Fruits
              </div>
              <div className=" ">
                <a href="">
                  <img
                    className="w-[400px] h-[200px] rounded"
                    src="https://hinh365.com/wp-content/uploads/2020/06/7165fb65d84513110399991ed216e99a.jpg "
                    alt=""
                  />
                </a>
              </div>
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Cherry
              </h2>
              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </div>
        ))}
      </Flex>
    </Layout>
  );
};

export default CartProduct;
