import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config";
import { SearchOutlined } from "@ant-design/icons";
import { getHashtags, searchProducts } from "../../apis";
import { useSearchParams } from "react-router-dom";
import { setProduct } from "../../redux/userReducer/userReducer";
import { HashtagType, productTypes } from "../../@type/global.type";
import { formatVND } from "../../utils/price";

/** The upper bound of the price slider (VND per kilogram). */
const MAX_PRICE = 250_000;

const Categories = () => {
  const product = useSelector((state: RootState) => state.user.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setSearchParams] = useSearchParams();
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

  /** Groups the products by their category (name + number of products). */
  const categories = useMemo(() => {
    const group: Record<string, { name: string; count: number }> = {};

    product.forEach((item) => {
      const slug = item.category?.slug || item.category?._id || "khac";
      const name = item.category?.name || "Nông sản";

      if (!group[slug]) {
        group[slug] = { name, count: 0 };
      }
      group[slug].count += 1;
    });

    return group;
  }, [product]);

  const [amount, setAmount] = useState(MAX_PRICE);

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

  /** Filters the products that are shown by the selected price range. */
  const visibleProducts: productTypes[] = useMemo(
    () =>
      product.filter((item) => {
        const price =
          item.productAttributes?.[0]?.discount_price ?? item.price ?? 0;
        return price <= amount;
      }),
    [product, amount]
  );

  return (
    <div>
      <div>
        <div className="w-full">
          <div className="container mx-auto p-5">
            <div className="">
              <div className="flex w-full sm:w-5">
                <input
                  type="search"
                  className="flex-1 min-w-0 border border-gray-300 rounded-l py-3 px-4 sm:px-10 focus:outline-none"
                  placeholder="Tìm kiếm nông sản..."
                  value={searchTerm}
                  onChange={handleSeachChange}
                />
                <button className="bg-gray-200 px-4 py-3 rounded-r">
                  <SearchOutlined />
                </button>
              </div>
            </div>
            <div className="mb-5 mt-6">
              <h4 className="mb-4 text-xl sm:text-2xl text-catg font-semibold">
                Danh mục
              </h4>
              <ul className="list-none">
                {Object.entries(categories)?.map(([slug, item]) => (
                  <li key={slug}>
                    <div className="flex justify-between items-center">
                      <a
                        href="#"
                        className="flex items-center font-semibold text-lg sm:text-xl mb-2"
                      >
                        {item.name}
                      </a>
                      <span>({item.count})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {hashtags.length > 0 && (
              <div className="mb-5 mt-6">
                <h4 className="mb-4 text-xl sm:text-2xl text-catg font-semibold">
                  Từ khoá nổi bật
                </h4>
                <ul className="list-none flex flex-wrap gap-3">
                  {hashtags.map((hashtag) => (
                    <li key={hashtag._id}>
                      <button
                        type="button"
                        onClick={() => handleHashtagClick(hashtag)}
                        className="border border-gray-300 rounded-full px-4 py-1 text-sm sm:text-base font-semibold hover:bg-gray-100"
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
                <h4 className="mb-2 text-xl sm:text-2xl text-catg font-semibold">
                  Khoảng giá
                </h4>
                <input
                  type="range"
                  className="w-full"
                  id="rangeInput"
                  name="rangeInput"
                  min="15000"
                  max={MAX_PRICE}
                  step="5000"
                  value={amount}
                  onInput={handleInputChange}
                />
                <output
                  id="amount"
                  name="amount"
                  htmlFor="rangeInput"
                  className="ml-2"
                >
                  {formatVND(amount)}/{`kg`}
                </output>
                <p className="text-sm text-gray-500 mt-2">
                  Đang hiển thị {visibleProducts.length} sản phẩm trong khoảng
                  giá này.
                </p>
              </div>
            </div>
            <div className="mb-3 mt-14">
              <h4 className="mb-4 text-xl sm:text-2xl text-catg font-semibold">
                Bộ lọc khác
              </h4>
              <div className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id="Categories-1"
                  name="Categories-1"
                  value="Organic"
                />
                <label className="text-base text-catg" htmlFor="Categories-1">
                  Hữu cơ
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id="Categories-2"
                  name="Categories-1"
                  value="tuoi-moi"
                />
                <label className="text-base text-catg" htmlFor="Categories-2">
                  Tươi mới
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id="Categories-3"
                  name="Categories-1"
                  value="ban-chay"
                />
                <label className="text-base text-catg" htmlFor="Categories-3">
                  Bán chạy
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id="Categories-4"
                  name="Categories-1"
                  value="khuyen-mai"
                />
                <label className="text-base text-catg" htmlFor="Categories-4">
                  Đang giảm giá
                </label>
              </div>
              <div className="mb-2">
                <input
                  type="radio"
                  className="mr-2"
                  id="Categories-5"
                  name="Categories-1"
                  value="Expired"
                />
                <label className="text-base text-catg" htmlFor="Categories-5">
                  Sắp hết hạn
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
