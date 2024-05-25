import { Flex, Pagination } from "antd";
import Button from "../Button";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/config";

const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
  width: "310px",
};

const Cart = () => {
  const filterProduct = useSelector((state: RootState) => state.user.product);
  return (
    <Flex wrap="wrap" gap="35px">
      {filterProduct.map((product) => (
        <div key={product._id} className="gutter-row  ">
          <div style={style} className="rounded-[10px] relative">
            <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
              {product.category.name}
            </div>
            <div className=" ">
              <a href="">
                <img
                  className="w-[400px] h-[200px] rounded"
                  src={product.thumbnail_url}
                  alt=""
                />
              </a>
            </div>
            <h2 className="flex justify-center text-2xl font-bold mt-8 ">
              {product.name}
            </h2>
            <div className="flex  mt-30 items-center justify-evenly mt-5">
              <p className=" text_money p-4 text-xl  font-popins font-semibold">
                {product.attributes.map((attr) => attr.original_price)}$/KG
              </p>
              <Button />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-10">
        <Pagination defaultCurrent={1} total={50} />
      </div>
    </Flex>
  );
};

export default Cart;
