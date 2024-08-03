import { Button, Form, Input, Layout, Modal } from "antd";
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
import { setCart, setcartnumber } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";
import { cartTypes } from "../../@type/global.type";
import { toast } from "react-toastify";

const PayMent = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };
  const listcard: cartTypes | null | undefined = useSelector(
    (state: RootState) => state.user.cart
  );

  const renderlist = listcard?.carts;
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
        acc[item.productDetails._id] = item.quantity;
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
  const fetchCart = async () => {
    try {
      const respone = await requestApi("carts", "GET", {});
      const list = respone.data.data;
      dispatch(setCart(list));
      dispatch(setcartnumber(list.carts.length));
    } catch (error) {}
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const deletecart = async (id: string, product_id: string) => {
    try {
      const respone = await requestApi(
        `carts/items/${id}?product_id=${product_id}`,
        "DELETE",
        {
          product_id,
        }
      );

      fetchCart();
    } catch (error) {}
  };

  const order = async (value: any) => {
    try {
      const respone = await requestApi("orders", "POST", {
        product_attribute_ids: renderlist?.map((v) => v.productAttributeId),
        payment_method: value.payment,
        address: value.address,
        phone: value.phone,
        note: value.note,
      });
      setOpen(false);
      const message = "Payment success";
      toast.success(message, {
        autoClose: 500,
      });
      console.log(message);
      await fetchCart();
    } catch (error) {}
  };

  const updateCart = async () => {
    try {
      const respone = await requestApi(`carts/items/${listcard?._id}`, "PUT", {
        items: listcard?.carts.map((c) => {
          return {
            product_id: c.productDetails._id,
            product_attribute_id: c.productAttributeId,
            quantity: quantities[c.productDetails._id] || 1,
          };
        }),
      });
      fetchCart();
    } catch (error) {}
  };

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
                      Image
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
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {renderlist &&
                    renderlist.map((cart, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center ">
                            <img
                              className="w-24 h-24 rounded-full"
                              src={cart.productDetails.thumbnail_url}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">
                            {cart.productDetails.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{cart.price}$/KG</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center mt-4">
                            <button
                              className="btn-minus  "
                              onClick={() =>
                                handleDecrement(cart.productDetails._id)
                              }
                            >
                              <i>
                                <MinusCircleOutlined />
                              </i>
                            </button>

                            <div className="mx-2 w-12 text-center border-0">
                              {quantities[cart.productDetails._id]}
                            </div>
                            <button className="btn-plus ">
                              <i
                                onClick={() => {
                                  handleIncrement(cart.productDetails._id);
                                }}
                              >
                                <PlusCircleOutlined />
                              </i>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">
                            {quantities[cart.productDetails._id] * cart.price}$
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="rounded-full  border-gray-300 p-2 mt-4">
                            <i className="fa fa-times text-red-500">
                              <CloseCircleOutlined
                                onClick={() =>
                                  deletecart(
                                    listcard._id,
                                    cart.productDetails._id
                                  )
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
        <div className="mt-5 ml-20">
          {/* <input
            type="text"
            className="border-0 border-b rounded me-5 py-3 mb-4"
            placeholder="Coupon Code"
          /> */}
          <button
            onClick={() => updateCart()}
            className="btn border border-secondary rounded-full px-9 py-3 text-primary hover:bg-green-400 hover:text-white"
            type="button"
          >
            Save
          </button>
          <div className=" justify-end mt-5 flex mr-20 ">
            <div className="col-8"></div>
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-gray-100 rounded  w-[500px] ">
                <div className="p-4">
                  <h1 className="text-3xl mb-4">
                    Cart <span className="font-normal">Total</span>
                  </h1>
                  {/* <div className="flex justify-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">{}</p>
                  </div> */}
                  {/* <div className="flex justify-between">
                    <h5 className="mb-0 me-4">Shipping</h5>
                    <div>
                      <p className="mb-0">Flat rate: $3.00</p>
                    </div>
                  </div> */}
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
