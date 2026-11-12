import { Col, Empty, Layout, Row, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../../../apis";
import { BlogType } from "../../../../@type/global.type";
import HeaderItem from "../../../../components/HeaderItem";
import Footer from "../../../../components/Footer";
import BlogCard from "../../../../components/BlogCard";
import "./style.scss";

/**
 * Blog listing page.
 *
 * `GET /blogs` is a public endpoint, so the page can be read without an
 * account. Only the blogs in the `Published` state are shown, with the
 * drafts kept out of the way.
 */
const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        if (!cancelled) setBlogs(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  const published = useMemo(
    () => blogs.filter((blog) => blog.status === "Published"),
    [blogs]
  );

  // The backend has no search endpoint for blogs, so the filtering happens
  // on the client over the already loaded collection.
  const visible = useMemo(() => {
    const source = published.length > 0 ? published : blogs;
    const term = keyword.trim().toLowerCase();
    if (!term) return source;
    return source.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(term) ||
        blog.description?.toLowerCase().includes(term) ||
        blog.detail?.toLowerCase().includes(term)
    );
  }, [blogs, published, keyword]);

  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>

      <section className="blog-page__hero py-12 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="blog-page__title text-white">Bài viết của Agrimarket</h1>
          <p className="blog-page__subtitle mt-3">
            Cập nhật kiến thức về nông sản sạch, truy xuất nguồn gốc và bảo
            quản thực phẩm
          </p>
          <Link
            to="/knowledge"
            className="inline-block mt-5 px-5 py-2 border border-white text-white rounded-full hover:bg-white hover:text-primary transition-colors"
          >
            Hướng dẫn chọn & bảo quản nông sản
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Bài viết mới nhất</h2>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : visible.length === 0 ? (
          <Empty description="Không có bài viết nào" className="py-20" />
        ) : (
          <Row gutter={[24, 24]}>
            {visible.map((blog) => (
              <Col key={blog._id} xs={24} sm={12} lg={8}>
                <BlogCard blog={blog} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogList;
