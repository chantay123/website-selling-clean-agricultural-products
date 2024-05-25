import { Layout } from "antd";
import HearderItem from "../../components/HeaderItem/HeaderItem";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import requestApi from "../../utils/interceptors";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setProduct } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";

const PayMent = () => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const dispatch = useDispatch();
  const fetchCart = async () => {
    try {
      const respone = await requestApi("carts", "GET", {});
      const list = respone.data.data;
      dispatch(setCart(list));
      console.log(list);
    } catch (error) {}
  };
  useEffect(() => {
    fetchCart();
  });
  const listcard = useSelector((state: RootState) => state.user.product);
  return (
    <div>
      <div>
        <Layout>
          <HearderItem />
        </Layout>
      </div>
      <div className="ml-20 mr-20 mt-20">
        <div className="container-fluid py-5">
          <div className="container py-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead className="border-b ">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Handle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listcard.map((cart) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center ">
                          <img
                            className="w-24 h-24 rounded-full"
                            src={cart.thumbnail_url}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="mb-0 mt-4">{cart.name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="mb-0 mt-4">
                          {cart.attributes.map((attr) => attr.discount_price)}$
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center mt-4">
                          <button
                            className="btn-minus   "
                            onClick={handleDecrement}
                          >
                            <i>
                              <MinusCircleOutlined />
                            </i>
                          </button>
                          <input
                            type="text"
                            className="mx-2 w-12 text-center border-0"
                            value={quantity}
                            readOnly
                          />
                          <button className="btn-plus ">
                            <i onClick={handleIncrement}>
                              <PlusCircleOutlined />
                            </i>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="mb-0 mt-4">{cart.total_price}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="rounded-full  border-gray-300 p-2 mt-4">
                          <i className="fa fa-times text-red-500">
                            <CloseCircleOutlined />
                          </i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mt-5 ml-20">
          <input
            type="text"
            className="border-0 border-b rounded me-5 py-3 mb-4"
            placeholder="Coupon Code"
          />
          <button
            className="btn border border-secondary rounded-full px-4 py-3 text-primary"
            type="button"
          >
            Apply Coupon
          </button>
          <div className=" justify-end mt-5 flex mr-20 ">
            <div className="col-8"></div>
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-gray-100 rounded  w-[500px] ">
                <div className="p-4">
                  <h1 className="text-3xl mb-4">
                    Cart <span className="font-normal">Total</span>
                  </h1>
                  <div className="flex justify-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">$96.00</p>
                  </div>
                  <div className="flex justify-between">
                    <h5 className="mb-0 me-4">Shipping</h5>
                    <div>
                      <p className="mb-0">Flat rate: $3.00</p>
                    </div>
                  </div>
                  <p className="mb-0 text-right">Shipping to Ukraine.</p>
                </div>
                <div className="py-4 mb-4 border-t border-b flex justify-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>
                  <p className="mb-0 pe-4">$99.00</p>
                </div>
                <button
                  className="btn border border-secondary rounded-full px-4 py-3 text-primary uppercase mb-4 ms-4"
                  type="button"
                >
                  Proceed Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default PayMent;
