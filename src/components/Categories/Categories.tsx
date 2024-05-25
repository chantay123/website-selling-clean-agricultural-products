import { SearchOutlined } from "@ant-design/icons";
import "./style.scss";
import { useState } from "react";

const Categories = () => {
  const [amount, setAmount] = useState(0);

  const handleInputChange = (event: any) => {
    setAmount(event.target.value);
  };
  return (
    <div>
      <div>
        <div className="">
          <div className=" w-full">
            <div className="container mx-auto p-5">
              <div className="">
                <div className="flex w-5">
                  <input
                    type="search"
                    className="flex-1 border border-gray-300 rounded-l py-3 px-10 focus:outline-none"
                    placeholder="keywords"
                  />
                  <button className="bg-gray-200 px-4 py-3 rounded-r">
                    <SearchOutlined />
                  </button>
                </div>
              </div>
              <div className="mb-5 mt-6">
                <h4 className="mb-4 text-2xl text-catg font-semibold">
                  Categories
                </h4>
                <ul className="list-none">
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center font-semibold text-xl mb-2"
                      >
                        Apples
                      </a>
                      <span>(3)</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center text-xl font-semibold mb-2"
                      >
                        Oranges
                      </a>
                      <span>(5)</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center  text-xl font-semibold mb-2"
                      >
                        Strawberry
                      </a>
                      <span>(2)</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center text-xl font-semibold mb-2"
                      >
                        Banana
                      </a>
                      <span>(8)</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center text-xl font-semibold"
                      >
                        Pumpkin
                      </a>
                      <span>(5)</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-8 mt-14">
                  <h4 className="mb-2 text-2xl text-catg font-semibold">
                    Price
                  </h4>
                  <input
                    type="range"
                    className="w-full"
                    id="rangeInput"
                    name="rangeInput"
                    min="0"
                    max="500"
                    value={amount}
                    onInput={handleInputChange}
                  />
                  <output
                    id="amount"
                    name="amount"
                    htmlFor="rangeInput"
                    className="ml-2"
                  >
                    {amount}
                  </output>
                </div>
              </div>
              <div className="mb-3 mt-14">
                <h4 className=" mb-4 text-2xl  text-catg font-semibold">
                  Additional
                </h4>
                <div className="mb-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="Categories-1"
                    name="Categories-1"
                    value="Beverages"
                  />
                  <label className="text-base text-catg" htmlFor="Categories-1">
                    {" "}
                    Organic
                  </label>
                </div>
                <div className="mb-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="Categories-2"
                    name="Categories-1"
                    value="Beverages"
                  />
                  <label className="text-base text-catg" htmlFor="Categories-2">
                    {" "}
                    Fresh
                  </label>
                </div>
                <div className="mb-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="Categories-3"
                    name="Categories-1"
                    value="Beverages"
                  />
                  <label className="text-base text-catg" htmlFor="Categories-3">
                    {" "}
                    Sales
                  </label>
                </div>
                <div className="mb-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="Categories-4"
                    name="Categories-1"
                    value="Beverages"
                  />
                  <label className="text-base text-catg" htmlFor="Categories-4">
                    {" "}
                    Discount
                  </label>
                </div>
                <div className="mb-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="Categories-5"
                    name="Categories-1"
                    value="Beverages"
                  />
                  <label className="text-base text-catg" htmlFor="Categories-5">
                    {" "}
                    Expired
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
