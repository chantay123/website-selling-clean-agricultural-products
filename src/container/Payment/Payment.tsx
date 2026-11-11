import { Button, Form, Input, Layout, Modal } from "antd";
import HearderItem from "../../components/HeaderItem/HeaderItem";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { getCart, removeCartItem, updateCartItems, createOrder } from "../../apis";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setcartnumber } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";
import { cartTypes } from "../../@type/global.type";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/api.adapter";

const PayMent = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const listcard: cartTypes | null | undefined = useSelector(
    (state: RootState) => state.user.cart
  );

  const renderlist = listcard?.items;
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleIncrement = (productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };
  useEffect(() => {
    if (renderlist) {
      const initialQuantities = renderlist.reduce((acc, item) => {
        acc[item.product_id._id] = item.quantity;
        return acc;
      }, {} as { [key: string]: number });
      setQuantities(initialQuantities);
    }
  }, [renderlist]);

  const handleDecrement = (productid: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productid]: Math.max((prevQuantities[productid] || 0) - 1, 1),
    }));
  };
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const fetchCart = async () => {
    try {
      const respones = await getCart();
      const list = respones.data;
      dispatch(setCart(list));
      dispatch(setcartnumber(list.items.length));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // The cart is a private resource: calling it while the visitor is not
    // logged in would return a 401 and the interceptor would send the guest
    // to the login page.
    if (!isAuthenticated) return;

    fetchCart();
  }, [isAuthenticated]);

  const deletecart = async (id: string, product_id: string) => {
    try {
      await removeCartItem(id, product_id);

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  /** Places the order for every item currently in the cart. */
  const order = async (value: any) => {
    if (!listcard || !renderlist || renderlist.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    try {
      const response = await createOrder({
        product_attribute_ids: renderlist.map(
          (item) => item.productAttributeId ?? ""
        ),
        payment_method: value.payment,
        address: value.address,
        phone: value.Phone,
        note: value.note,
      });
      setOpen(false);
      toast.success(response.message || "Payment success");
      await fetchCart();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi thanh toán"));
    }
  };

  /** Persists the quantities currently displayed in the cart. */
  const updateCart = async () => {
    if (!listcard || !renderlist) return;

    try {
      await updateCartItems(listcard._id, {
        items: renderlist.map((item) => ({
          product_id: item.product_id._id,
          product_attribute_id: item.productAttributeId ?? "",
          quantity: quantities[item.product_id._id] || 1,
        })),
      });
      toast.success("Cập nhật giỏ hàng thành công");
      fetchCart();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi cập nhật giỏ hàng"));
    }
  };

  return (
    <div>
      <div>
        <Layout>
          <HearderItem />
        </Layout>
      </div>
      <div className="mx-5 sm:mx-10 lg:ml-20 lg:mr-20 mt-16 sm:mt-20">
        <div className="container-fluid py-5">
          <div className="container py-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead className="border-b ">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {renderlist &&
                    renderlist.map((cart) => (
                      <tr key={cart.product_id._id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center ">
                            <img
                              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover"
                              src={cart.product_id.thumbnail_url}
                              alt={cart.product_id.name}
                            />
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{cart.product_id.name}</p>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">
                            {cart.price ?? cart.product_id.price}$/KG
                          </p>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center mt-4">
                            <button
                              className="btn-minus  "
                              onClick={() =>
                                handleDecrement(cart.product_id._id)
                              }
                            >
                              <i>
                                <MinusCircleOutlined />
                              </i>
                            </button>

                            <div className="mx-2 w-12 text-center border-0">
                              {quantities[cart.product_id._id]}
                            </div>
                            <button className="btn-plus ">
                              <i
                                onClick={() => {
                                  handleIncrement(cart.product_id._id);
                                }}
                              >
                                <PlusCircleOutlined />
                              </i>
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">
                            {(quantities[cart.product_id._id] || 0) *
                              (cart.price ?? 0)}
                            $
                          </p>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <button className="rounded-full  border-gray-300 p-2 mt-4">
                            <i className="fa fa-times text-red-500">
                              <CloseCircleOutlined
                                onClick={() =>
                                  deletecart(listcard._id, cart.product_id._id)
                                }
                              />
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
        <div className="mt-8 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
          <button
            onClick={() => updateCart()}
            className="btn border border-secondary rounded-full px-9 py-3 text-primary hover:bg-green-400 hover:text-white"
            type="button"
          >
            Save
          </button>
          <div className="justify-end mt-5 flex">
            <div className="w-full sm:w-8/12 md:w-7/12 lg:w-6/12 xl:w-4/12">
              <div className="bg-gray-100 rounded w-full">
                <div className="p-4">
                  <h1 className="text-2xl sm:text-3xl mb-4">
                    Cart <span className="font-normal">Total</span>
                  </h1>
                  <p className="mb-0 text-right">Shipping to Viet Nam.</p>
                </div>
                <div className="py-4 mb-4 border-t border-b flex justify-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>

                  <p className="mb-0 pe-4"> {listcard?.total_price}$</p>
                </div>
                <div>
                  <button
                    className="btn border border-secondary rounded-full px-4 py-3 text-primary uppercase mb-4 ms-4"
                    type="button"
                    onClick={showModal}
                  >
                    Proceed Checkout
                  </button>
                  <Modal
                    title="Checkout"
                    open={open}
                    onCancel={handleCancel}
                    cancelButtonProps={{ disabled: false }}
                    footer={null}
                  >
                    <Form
                      onFinish={(value) => order(value)}
                      name="wrap"
                      labelCol={{ flex: "110px" }}
                      labelAlign="left"
                      labelWrap
                      wrapperCol={{ flex: 1 }}
                      colon={false}
                      style={{ maxWidth: 600 }}
                    >
                      <Form.Item label="Address" name="address">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Payment" name="payment">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Phone" name="Phone">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Note" name="note">
                        <Input />
                      </Form.Item>
                      <Form.Item label=" ">
                        <Button htmlType="submit" className="text_submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
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
