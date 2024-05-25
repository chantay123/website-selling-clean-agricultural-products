import { Col, Row, Space, Table, TableProps } from "antd";
import requestApi from "../../utils/interceptors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";
import {
  ProductAttribute,
  extendedProductType,
  productTypes,
} from "../../@type/global.type";

const Admin = () => {
  const dispatch = useDispatch();
  const fetchPRODUCT = async () => {
    try {
      const respons = await requestApi("products", "GET", {});
      const a = respons.data.data;
      dispatch(setProduct(a));
      console.log(respons);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPRODUCT();
  }, []);
  const list = useSelector((state: RootState) => state.user.product);
  const extendedList: extendedProductType[] = list.map((obj, index) => ({
    ...obj,
    key: `key-${index}`,
  }));
  const columns: TableProps<productTypes>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Origin",
      dataIndex: "origin",
      className: "text-sm",
      width: 200,
    },
    {
      title: "Attributes",
      dataIndex: "attributes",
      className: "text-sm",
      width: 200,
      render: (attributes: ProductAttribute[]) => (
        <ul>
          {attributes.map((attr, index) => (
            <li key={index}>
              Weight: {attr.weight} kg, Original Price: ${attr.original_price}
              {attr.discounted_percent && (
                <>
                  , Discounted: {attr.discounted_percent}%, Discount Price: $
                  {attr.discount_price}
                </>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Space size="middle">
          <a>Delete</a>
          <a> Edit</a>
        </Space>
      ),
    },
  ];

  const data: extendedProductType[] = extendedList;

  return (
    <div>
      <Row>
        <Col span={5}>
          <div className="flex ">
            <div className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
              <div className="py-4 text-gray-500 dark:text-gray-400">
                <a
                  className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
                  href="#"
                >
                  Fruitables
                </a>
                <ul className="mt-6">
                  <li className="relative px-6 py-3">
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-green-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                    <a
                      className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                      href=""
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span className="ml-4">Product</span>
                    </a>
                  </li>
                </ul>
                <ul>
                  <li className="relative px-6 py-3">
                    <a
                      className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                      href=""
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      <span className="ml-4">category</span>
                    </a>
                  </li>
                  <li className="relative px-6 py-3">
                    <a
                      className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                      href=""
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <span className="ml-4">Cards</span>
                    </a>
                  </li>
                </ul>
                <div className="px-6 my-6">
                  <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-400 border border-transparent rounded-lg">
                    Create account
                    <span className="ml-2" aria-hidden="true">
                      +
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <div></div>
        <Col span={18}>
          <div className="mt-9 ml-2">
            <Table columns={columns} dataSource={data} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
