import "./style.scss";
import { Flex, Layout } from "antd";
import { useEffect } from "react";
import requestApi from "../../utils/interceptors";
import {
  setCategory,
  setProduct,
  setcartnumber,
} from "../../redux/userReducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import ButtonClick from "../Button/ButtonClick";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
  width: "310px",
};
const CartProduct = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("category");
  const dispatch = useDispatch();

  const category = async () => {
    try {
      const respone = await requestApi("categories", "GET", {});
      const a = respone.data.data;
      dispatch(setCategory(a));
      console.log(respone);
    } catch (error) {
      console.log(error);
    }
  };
  const filterCategory = useSelector((state: RootState) => state.user.category);
  //call api get all product

  const fetchProduct = async () => {
    try {
      const respone = await requestApi(
        !query ? "products" : `products?category=${query}`,
        "GET",
        {}
      );
      const arr = respone.data.data;
      dispatch(setProduct(arr));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [query]);
  useEffect(() => {
    category();
  }, []);

  const product = useSelector((state: RootState) => state.user.product);

  const lengthProduct = product.length;
  const filterProduct = lengthProduct > 5 ? product.slice(0, 8) : product;
  console.log(filterProduct);

  const buttonAdd = async (attribute_id: string, product_id: string) => {
    try {
      const respone = await requestApi("carts/items", "POST", {
        items: [
          {
            product_id: product_id,
            product_attribute_id: attribute_id,
            quantity: 1,
          },
        ],
      });
      console.log(respone);
      const respones = await requestApi("carts", "GET", {});
      const list = respones.data.data;
      dispatch(setcartnumber(list.carts.length));
      const message = "add product successfully";
      toast.success(message);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const respone = await requestApi("carts", "GET", {});
        const list = respone.data.data;
        dispatch(setcartnumber(list.carts.length));
      } catch (error) {
        console.log();
      }
    };
    fetchCart();
  }, []);
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
              <Link to="?" className="p-3 border-2 rounded-[30px] ">
                All Products
              </Link>
            </li>
            {filterCategory.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`?category=${item.slug}`}
                  className="p-3 border-2 rounded-[30px] ml-4 capitalize"
                >
                  {item.slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <Flex wrap="wrap" gap="35px">
          {filterProduct.map((product) => (
            <div key={product._id} className="gutter-row  ">
              <div style={style} className="rounded-[10px] relative">
                <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                  {product.category?.name}
                </div>
                <div className=" ">
                  <Link to={`product/${product._id}`}>
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
                    {product.attributes.map((attr) => attr.original_price)}$/KG
                  </p>
                  {product.attributes.map((attr) => (
                    <ButtonClick
                      key={attr._id}
                      onclick={() => buttonAdd(attr._id, product._id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Flex>
      </div>
    </Layout>
  );
};

export default CartProduct;
