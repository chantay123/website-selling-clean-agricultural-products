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
import { formatVND } from "../../utils/price";
const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  paddingBottom: "1rem",
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
    <Layout className="bg-white mx-5 sm:mx-10 lg:ml-20 lg:mr-20 mt-10 mb-10">
      <div className="mt-16 sm:mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center lg:text-left">
          Nông sản hữu cơ của chúng tôi
        </h2>
        <div className="w-full lg:w-auto lg:ml-72">
          <ul className="flex flex-wrap gap-2 sm:gap-4 text-sm justify-center lg:justify-start">
            <li>
              <Link
                to="?"
                className="inline-block p-3 border-2 rounded-[30px]"
              >
                Tất cả sản phẩm
              </Link>
            </li>
            {filterCategory.map((item) => (
              <li key={item._id}>
                <Link
                  to={`?category=${item._id}`}
                  className="inline-block p-3 sm:p-4 border-2 rounded-[30px]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <Flex wrap="wrap" gap={24}>
          {filterProduct.map((product) => {
            const unit =
              product.productAttributes?.[0]?.unit_of_measurement ?? "kg";
            const discountPercent =
              product.productAttributes?.[0]?.discounted_percent ?? 0;

            return (
              <div key={product._id} className="gutter-row w-full sm:w-[310px]">
                <div
                  style={style}
                  className="rounded-[10px] relative w-full h-auto min-h-[380px] flex flex-col"
                >
                  <div className="absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                    {product.category?.name}
                  </div>
                  {discountPercent > 0 && (
                    <div className="absolute text-white px-3 py-1 m-3 ml-24 rounded-[10px] bg-red-500 text-sm font-semibold">
                      -{discountPercent}%
                    </div>
                  )}
                  <div>
                    <Link to={`product/${product._id}`}>
                      <img
                        className="w-full h-[200px] rounded object-cover"
                        src={product.thumbnail_url}
                        alt={product.name}
                      />
                    </Link>
                  </div>
                  <h2 className="flex justify-center text-2xl font-bold mt-8 px-2 text-center">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-evenly mt-5 mb-4 px-2 mt-auto">
                    <p className="text_money p-4 text-xl font-popins font-semibold">
                      {formatVND(product.price)}/{unit}
                    </p>
                    <ButtonClick
                      label="Thêm vào giỏ"
                      key={product._id}
                      onClick={() => buttonAdd(product._id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {filterProduct.length === 0 && (
            <div className="w-full text-center py-16">
              <p className="text-2xl font-bold text-cool-gray-600">
                Không tìm thấy sản phẩm nào
              </p>
              <p className="text-color mt-2">
                Danh mục này hiện chưa có sản phẩm. Hãy thử một danh mục khác
                nhé.
              </p>
            </div>
          )}
        </Flex>
      </div>
    </Layout>
  );
};

export default CartProduct;
