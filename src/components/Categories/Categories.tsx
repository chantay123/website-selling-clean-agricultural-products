import "./style.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { SearchOutlined } from "@ant-design/icons";
import { getHashtags, searchProducts } from "../../apis";
import { useSearchParams } from "react-router-dom";
import { setProduct } from "../../redux/userReducer/userReducer";
import { HashtagType } from "../../@type/global.type";
import { productTypes } from "../../@type/global.type";

const Categories = () => {
  const product = useSelector((state: RootState) => state.user.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setSearchParams] = useSearchParams();
  const group: Record<string, productTypes[]> = {};
  const dispatch = useDispatch();
  const [hashtags, setHashtags] = useState<HashtagType[]>([]);

  // The hashtags are a public resource of the API. They are loaded once so
  // that the visitor can narrow the search down with a trending tag.
  useEffect(() => {
    let cancelled = false;

    const fetchHashtags = async () => {
      try {
        const response = await getHashtags();
        if (!cancelled) setHashtags(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHashtags();
    return () => {
      cancelled = true;
    };
  }, []);

  const category = product.reduce((prev, curr) => {
    if (!prev[curr.category?.slug]) {
      prev[curr.category?.slug] = [curr];
    } else {
      prev[curr.category?.slug].push(curr);
    }
    return prev;
  }, group);

  const [amount, setAmount] = useState(0);
  // The price range only drives the local UI state; the filtering itself is
  // done by the API through the category / keyword query parameters.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };
  //Search product by name
  const handleSeachChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const keywords = event.target.value;
    setSearchTerm(keywords);
    setSearchParams((param) => {
      param.set("keyword", keywords);
      return param;
    });
    try {
      const respone = await searchProducts(keywords);
      dispatch(setProduct(respone.data));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Runs the search for a hashtag coming from the API.
   *
   * The backend only matches the search against the product name and slug,
   * so the tag is submitted as a keyword exactly like the search box does.
   */
  const handleHashtagClick = async (hashtag: HashtagType) => {
    const keyword = hashtag.slug || hashtag.name.replace(/^#/, "");

    setSearchTerm(keyword);
    setSearchParams((param) => {
      param.set("keyword", keyword);
      return param;
    });

    try {
      const respone = await searchProducts(keyword);
      dispatch(setProduct(respone.data));
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
            {hashtags.length > 0 && (
              <div className="mb-5 mt-6">
                <h4 className="mb-4 text-2xl text-catg font-semibold">
                  Hashtags
                </h4>
                <ul className="list-none flex flex-wrap gap-3">
                  {hashtags.map((hashtag) => (
                    <li key={hashtag._id}>
                      <button
                        type="button"
                        onClick={() => handleHashtagClick(hashtag)}
                        className="border border-gray-300 rounded-full px-4 py-1 text-base font-semibold hover:bg-gray-100"
                      >
                        {hashtag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
