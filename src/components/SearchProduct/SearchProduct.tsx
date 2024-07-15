import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
import CarouselItem from "../CarouselItem";

const SearchProduct = () => {
  return (
    <div className="header__top  ">
      <div className="ml-[80px] mr-[80px] flex">
        <Row>
          <Col span={12} push={12}>
            <div className="mt-44 ml-32">
              <CarouselItem />
            </div>
          </Col>
          <Col span={12} pull={12}>
            <div className="">
              <h4 className="text-secondary mb-3 text-2xl mt-40 font-semibold">
                100% Organic Foods
              </h4>
              <h2 className=" text-primary  mb-10 text-6xl font-semibold">
                Organic Veggies & Fruits Foods
              </h2>
              {/* <input
                className=" btn-border border-2  w-3/4 py-3 px-4 rounded-full relative"
                type="text"
                placeholder="Search"
              ></input>
              <button
                type="submit"
                className="btn-search border-2 absolute  py-3 px-4 rounded-full text-white -ml-[110px] font-bold "
              >
                Submit Now
              </button> */}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchProduct;
