import "./style.scss";
import { Flex, Layout } from "antd";
import { useEffect } from "react";
import {
  addToCart,
  getCart,
  getCategories,
  getProducts,
  getProductsByCategory,
} from "../../apis";
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
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const category = async () => {
    try {
      const respone = await getCategories();
      dispatch(setCategory(respone.data));
    } catch (error) {
      console.log(error);
    }
  };

  //call api get all product
  const filterCategory = useSelector((state: RootState) => state.user.category);
  const fetchProduct = async () => {
    try {
      const respone = query
        ? await getProductsByCategory(query)
        : await getProducts();
      dispatch(setProduct(respone.data));
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
    const target = product.find((item) => item._id === product_id);
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
      const message = "add product successfully";
      toast.success(message);
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
              <li key={item._id}>
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
                    {product.price}$/KG
                  </p>
                  <ButtonClick
                    label="Add to card"
                    key={product._id}
                    onClick={() => buttonAdd(product._id)}
                  />
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
