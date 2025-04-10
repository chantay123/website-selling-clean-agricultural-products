import "./style.scss";
import { Flex, Layout } from "antd";
import { useEffect } from "react";
import requestApi from "../../utils/interceptors";
import {
  setCategory,
  setProduct,
  setcartnumber,
  setfavorite,
} from "../../redux/userReducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import ButtonClick from "../Button/ButtonClick";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonLike from "../ButtonLike";
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

  //call api get all product
  const filterCategory = useSelector((state: RootState) => state.user.category);
  const fetchProduct = async () => {
    try {
      const respone = await requestApi(
        !query ? "products" : `products/categories/${query}`,
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

  const buttonAdd = async (product_id: string) => {
    try {
      const respone = await requestApi("carts/items", "POST", {
        items: [
          {
            product_id: product_id,
            quantity: 1,
          },
        ],
      });
      console.log(respone);
      const respones = await requestApi("carts", "GET", {});
      console.log(respone);
      const list = respones.data.data;
      console.log(respone);
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
        dispatch(setcartnumber(list.items.length));
      } catch (error) {
        console.log();
      }
    };
    fetchCart();
  }, []);

  // const favorite = async () => {
  //   try {
  //     const response = await requestApi("users/products/favorites", "GET", {});
  //     console.log(response);
  //     const a = response.data.data;
  //     dispatch(setfavorite(a));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const buttonLike = async (product_id: string) => {
  //   console.log(product_id);
  //   try {
  //     await requestApi(`products/${product_id}/like`, "POST", {
  //       product_id: product_id,
  //     });
  //     // favorite();
  //   } catch (error: any) {
  //     const { message } = error.response.data;
  //     toast.error(message);
  //   }
  // };

  // const buttonUnlike = async (product_id: string) => {
  //   try {
  //     const respone = await requestApi(
  //       `products/${product_id}/unlike`,
  //       "POST",
  //       {
  //         product_id: product_id,
  //       }
  //     );
  //     // favorite();
  //     console.log(respone);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const listfavorite = useSelector((state: RootState) => state.user.favorite);
  // //check listfavorite
  // const checklike = (_id: string) => {
  //   if (listfavorite.some((e) => e._id === _id)) {
  //     return true;
  //   }
  //   return false;
  // };

  return (
    <Layout className="bg-white ml-20 mr-20 mt-10 mb-10">
      <div className="mt-20 items-center flex ">
        <div className=" mt-20 ">
          <div>
            <h2 className="text-4xl font-bold mb-12">Our Organic Products</h2>
          </div>
        </div>
        <div className="mt-10 ml-72">
          <ul className="flex text-sm ">
            <li>
              <Link to="?" className="p-3 border-2 rounded-[30px] ">
                All Products
              </Link>
            </li>
            {filterCategory.map((item) => (
              <li>
                <Link
                  to={`?category=${item._id}`}
                  className="p-4 border-2 rounded-[30px] ml-4 "
                >
                  {item.name}
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
                {/* <div className="absolute ml-64 mt-2">
                  {product.productAttributes?.map((attr) => (
                    <ButtonLike
                      className={
                        checklike(product._id) ? "bg-red-600" : "bg-gray-400"
                      }
                      key={attr._id}
                      onclick={() => {
                        if (checklike(product._id)) {
                          buttonUnlike(product._id);
                        } else {
                          buttonLike(product._id);
                        }
                      }}
                    />
                  ))}
                </div> */}
                <div>
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
                    {product.sold}$/KG
                  </p>
                  {product.productAttributes?.map(() => (
                    <ButtonClick
                      label="Add to card"
                      key={product._id}
                      onClick={() => buttonAdd(product._id)}
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
