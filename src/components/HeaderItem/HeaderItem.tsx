import Layout from "antd/es/layout/layout";
import "tailwindcss/tailwind.css";
import "./style.scss";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const HearderItem = () => {
  const navigate = useNavigate();
  return (
    <Layout className="bg-white background p-3 drop-shadow-xl fixed z-10 w-full">
      <div className="ml-[80px] mr-[80px] flex items-center justify-between ">
        <h1 className=" text-[2.5rem] font-bold ">Fruitables</h1>

        <div>
          <ul className="flex text-base">
            <li>
              <a className="nav-item p-4 " href="">
                Home
              </a>
            </li>
            <li>
              <a className=" item p-4" href="#">
                Product
              </a>
            </li>
            <li>
              <a className="item p-4" href="#">
                Product Detail
              </a>
            </li>
            <li>
              <a className="item p-4" href="#">
                Contact
              </a>
            </li>
            <li>
              <a className="item p-4" href="#">
                Knowledge
              </a>
            </li>
          </ul>
        </div>

        <div className="flex">
          {/* <a href="#" className=" ">
            <i className="">
              <ShoppingCartOutlined />
            </i>
          </a> */}
          <button className="btn btn-search border  w-10 h-10 rounded-full border-orange-300 bg-white me-4">
            <i>
              <SearchOutlined />
            </i>
          </button>
          <button
            onClick={() => {
              navigate("/login");
            }}
            type="submit"
            className="border-2 border-secondary py-2 px-10 rounded-full text-orange-500"
          >
            Login
          </button>
          <button
            type="submit"
            className="border-2 border-secondary py-2 px-8 rounded-full text-orange-500 ml-2  "
          >
            Register
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HearderItem;
