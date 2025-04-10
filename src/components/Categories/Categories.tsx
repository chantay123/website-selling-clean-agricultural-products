import "./style.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { SearchOutlined } from "@ant-design/icons";
import requestApi from "../../utils/interceptors";
import { useSearchParams } from "react-router-dom";
import { setProduct } from "../../redux/userReducer/userReducer";

const Categories = () => {
  const product = useSelector((state: RootState) => state.user.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("keyword");
  const group: Record<string, any[]> = {};
  const dispatch = useDispatch();

  const category = product.reduce((prev, curr) => {
    if (!prev[curr.category?.slug]) {
      prev[curr.category?.slug] = [curr];
    } else {
      prev[curr.category?.slug].push(curr);
    }
    return prev;
  }, group);

 
  const [amount, setAmount] = useState(0);
  const handleInputChange = async (event: any) => {
    console.log(event.target.value);
    setAmount(event.target.value);
    useEffect(() => {
      handleInputChange;
    }, []);
  };
  //Search product by name
  const handleSeachChange = async (event: any) => {
    const keywords = event.target.value;
    setSearchTerm(keywords);
    setSearchParams((param) => {
      param.set("keyword", keywords);
      return param;
    });
    try {
      const respone = await requestApi(
        `products/search?keyword=${keywords}`,
        "POST",
        {}
      );
      console.log(respone);
      const arr = respone.data.data;
      dispatch(setProduct(arr));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <div className=" w-full">
          <div className="container mx-auto p-5">
            <div className="">
              <div className="flex w-5">
                <input
                  type="search"
                  className="flex-1 border border-gray-300 rounded-l py-3 px-10 focus:outline-none"
                  placeholder="keywords"
                  value={searchTerm}
                  onChange={handleSeachChange}
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
                {Object.entries(category)?.map(([slug, product]) => (
                  <li>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center font-semibold text-xl mb-2"
                      >
                        {slug}
                      </a>
                      <span>({product.length})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-8 mt-14">
                <h4 className="mb-2 text-2xl text-catg font-semibold">Price</h4>
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
  );
};

export default Categories;
