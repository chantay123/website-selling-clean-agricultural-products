import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../apis";
import { setCategory } from "../../redux/userReducer/userReducer";
import { RootState } from "../../redux/config";

/**
 * The categories are read from the API, the images live in `public/image`,
 * which Vite copies to the root of the build output. They must therefore be
 * referenced with an absolute path (`/image/...`); a relative path such as
 * `../../../public/image/...` only resolves in the dev server and results in
 * a broken image in production.
 */
const fallbackImages = [
  "/image/fruite-item-1.jpg",
  "/image/vegetable-item-1.jpg",
  "/image/vegetable-item-3.png",
  "/image/single-item.jpg",
  "/image/featur-2.jpg",
  "/image/banner-fruits.jpg",
];

const ProductPortfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.user.category);

  useEffect(() => {
    let cancelled = false;
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (!cancelled) dispatch(setCategory(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const items = categories.slice(0, 4).map((category, index) => ({
    title: category.name,
    image: category.image || fallbackImages[index % fallbackImages.length],
    categoryId: category._id,
  }));

  return (
    <div>
      <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:ml-20 lg:mr-12 rounded-md">
        <div className="mb-8">
          <h2 className="items-center flex justify-center text-3xl sm:text-4xl font-bold text-center px-4">
            Danh mục nông sản
          </h2>
        </div>
        <div>
          <Row gutter={[24, 24]}>
            {items.map((item) => (
              <Col
                className="gutter-row"
                xs={12}
                sm={12}
                md={6}
                key={item.categoryId}
              >
                <div className="rounded-[10px] bg-[#f4f6f8] p-3 h-full">
                  <a
                    className="block"
                    href=""
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(`/shop?category=${item.categoryId}`);
                    }}
                  >
                    <div>
                      <img
                        className="rounded w-full h-[130px] sm:h-[160px] lg:h-[180px] object-cover"
                        src={item.image}
                        alt={item.title}
                      />
                    </div>

                    <h2 className="flex justify-center text-base sm:text-xl font-bold mt-4 lg:mt-10 text-center">
                      {item.title}
                    </h2>
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductPortfolio;
