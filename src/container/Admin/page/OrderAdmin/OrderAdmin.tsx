import { Space, Table, TableProps } from "antd";
import requestApi from "../../../../utils/interceptors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
   setAdminStatus,
   setOrder,
} from "../../../../redux/userReducer/userReducer";
import { RootState } from "../../../../redux/config";
import {
   OrderType
} from "../../../../@type/global.type";
import { Link, useNavigate } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import Sidebar from "../../components/Sidebar";
const OrderAdmin = () => {
   const access_token = localStorage.getItem("access_token");
   const profile = async () => {
      try {
         const response = await requestApi("auth/me", "GET", {},
            {
               Authorization: `Bearer ${access_token}`,
            }
         );
         const a = response.data.data;
         dispatch(setAdminStatus(a?.role.name === "admin"));
      } catch (error) {
         dispatch(setAdminStatus(false));
         console.log(error);
      }
   };
   useEffect(() => {
      profile();
   }, []);
   const isadmin = useSelector((state: RootState) => state.user.isAdmin);
   const deleteOrder = async (order_id: any) => {
      console.log(order_id);
      try {
         await requestApi(`orders/${order_id}`, "DELETE", {},
            {
               Authorization: `Bearer ${access_token}`,
            }
         );
         fetchOrder();
      } catch (error) {
         console.log(error);
      }
   };
   const dispatch = useDispatch();
   const fetchOrder = async () => {
      try {
         const response = await requestApi("orders", "GET", {},
            {
               Authorization: `Bearer ${access_token}`,
            }
         );
         const a = response.data.data;
         dispatch(setOrder(a));
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      fetchOrder();
   }, []);
   const list = useSelector((state: RootState) => state.user.order);
   const extendedList: OrderType[] = list.map((obj, index) => ({
      ...obj,
      key: `key-${index}`,
   }));
   const columns: TableProps<OrderType>["columns"] = [
      {
         title: "User ID",
         dataIndex: "user",
         className: " text-base text-gray-600 ",
         width: 200,
      },
      {
         title: "Payment Method",
         dataIndex: "payment_method",
         className: " text-base text-gray-600 ",
         width: 200,
      },
      {
         title: "Status",
         dataIndex: "status",
         className: " text-base text-gray-600 ",
         width: 200,
      }, 
      {
         title: "Address",
         dataIndex: "address",
         className: " text-base text-gray-600 ",
         width: 200,
      }, 
      {
         title: "Total Price",
         dataIndex: "total_price",
         className: " text-base text-gray-600 ",
         width: 200,
      }, 
      {
         title: "Order Date",
         dataIndex: "order_date",
         className: " text-base text-gray-600 ",
         width: 200,
      },
      // {
      //    title: "Note",
      //    dataIndex: "note",
      //    className: " text-base text-gray-600 ",
      //    width: 200,
      // },

      {
         title: "Action",
         key: "action",
         className: " text-base text-gray-500",
         render: (attributes: OrderType[], ordertype) => (
            <Space size="middle">
               <button
                  onClick={() => deleteOrder(ordertype._id)}
                  className="rounded-md border px-4 py-2 text-white bg-red-600"
               >
                  <i>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M14.74 9L14.394 18M9.652 18L9.26 9M19.228 5.79c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                     </svg>
                  </i>
               </button>
               <div>
                  <Link
                     to={`/editadmin/${ordertype._id}`}
                     className="rounded-md border px-2  text-white bg-yellow-300 items-center flex hover:bg-yellow-400 "
                  >
                     <i>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="size-6"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                           />
                        </svg>
                     </i>
                  </Link>
               </div>
            </Space>
         ),
      },
   ];

   const data: OrderType[] = extendedList;

   const navigate = useNavigate();
   if (isadmin === false) {
      navigate("*");
      return;
   }
   return (
      <div>
         <HeaderAdmin />
         <div className="flex">
            <Sidebar />
            <Table className="mt-10 w-full " columns={columns} dataSource={data} />
         </div>
      </div>
   );
};
export default OrderAdmin;