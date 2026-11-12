import { Col, Empty, Layout, Row } from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeaderItem from "../../../components/HeaderItem";
import Footer from "../../../components/Footer";
import {
  knowledgeCategories,
  knowledgeGuides,
  KnowledgeCategory,
} from "../../../data/knowledge";
import { seedProducts } from "../../../data/seed";
import "./style.scss";

/**
 * Knowledge hub.
 *
 * The blog holds the editorial articles, this page holds the practical
 * guides a customer looks for: how to pick, store and cook the products of
 * the shop. Every guide is written for the Vietnamese products of the
 * catalogue and links to the products it talks about.
 */
const Knowledge = () => {
  const [active, setActive] = useState<KnowledgeCategory | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const term = keyword.trim().toLowerCase();

    return knowledgeGuides.filter((guide) => {
      const matchesCategory =
        active === "all" || guide.category === active;
      const matchesKeyword =
        !term ||
        guide.title.toLowerCase().includes(term) ||
        guide.summary.toLowerCase().includes(term) ||
        guide.detail.toLowerCase().includes(term);

      return matchesCategory && matchesKeyword;
    });
  }, [active, keyword]);

  const productById = (id: string) =>
    seedProducts.find((product) => product._id === id);

  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>

      <section className="knowledge-hero py-12 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="knowledge-hero__title text-white">
            Kiến thức nông sản
          </h1>
          <p className="knowledge-hero__subtitle mt-3">
            Hướng dẫn chọn, bảo quản và chế biến nông sản sạch theo đúng mùa vụ
            Việt Nam
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Category filters */}
        <div className="knowledge-categories flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`knowledge-chip ${
              active === "all" ? "knowledge-chip--active" : ""
            }`}
          >
            Tất cả
          </button>
          {knowledgeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              className={`knowledge-chip ${
                active === category.id ? "knowledge-chip--active" : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search + counter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Hướng dẫn thực hành</h2>
            <p className="text-gray-500 mt-1">
              {visible.length} hướng dẫn
              {active !== "all"
                ? ` · ${knowledgeCategories.find((c) => c.id === active)?.name}`
                : ""}
            </p>
          </div>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm hướng dẫn..."
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
          />
        </div>

        {visible.length === 0 ? (
          <Empty description="Không có hướng dẫn nào phù hợp" className="py-20" />
        ) : (
          <Row gutter={[24, 24]}>
            {visible.map((guide) => {
              const isOpen = openId === guide._id;
              const category = knowledgeCategories.find(
                (item) => item.id === guide.category
              );

              return (
                <Col key={guide._id} xs={24} lg={12}>
                  <article
                    className={`knowledge-card h-full ${
                      isOpen ? "knowledge-card--open" : ""
                    }`}
                  >
                    <header className="mb-3">
                      <span className="knowledge-card__category">
                        {category?.name}
                      </span>
                      <h3 className="knowledge-card__title text-xl font-bold mt-2">
                        {guide.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {guide.readTime} phút đọc
                      </p>
                    </header>

                    <p className="knowledge-card__summary text-base mb-4">
                      {guide.summary}
                    </p>

                    {isOpen ? (
                      <div className="knowledge-card__body">
                        <div className="knowledge-card__detail whitespace-pre-line">
                          {guide.detail}
                        </div>

                        {guide.tips.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="font-bold mb-2">Mẹo thực hành</h4>
                            <ul className="knowledge-card__tips">
                              {guide.tips.map((tip) => (
                                <li key={tip}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {guide.relatedProducts.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="font-bold mb-2">
                              Sản phẩm liên quan
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {guide.relatedProducts.map((productId) => {
                                const product = productById(productId);
                                if (!product) return null;

                                return (
                                  <Link
                                    key={productId}
                                    to={`/product/${product.slug}`}
                                    className="knowledge-card__product"
                                  >
                                    <img
                                      src={product.thumbnail_url}
                                      alt={product.name}
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                    <span>
                                      <span className="block font-semibold text-sm">
                                        {product.name}
                                      </span>
                                      <span className="block text-xs text-gray-500">
                                        {product.price?.toLocaleString("vi-VN")} đ
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => setOpenId(null)}
                          className="mt-5 text-sm text-gray-600 underline"
                        >
                          Thu gọn
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenId(guide._id)}
                        className="knowledge-card__more"
                      >
                        Đọc hướng dẫn
                      </button>
                    )}
                  </article>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Cross link to the editorial blog */}
        <div className="knowledge-cta mt-14 p-6 sm:p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">
            Bài viết chuyên sâu từ ban biên tập
          </h3>
          <p className="text-gray-600 mb-5">
            Những bài phân tích dài hơn về truy xuất nguồn gốc, dinh dưỡng và
            xu hướng nông sản sạch.
          </p>
          <Link
            to="/blog"
            className="inline-block px-6 py-2 border-2 border-secondary text-primary rounded-full hover:bg-green-400 hover:text-white transition-colors"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Knowledge;
