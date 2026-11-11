import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../apis";
import { BlogType } from "../../@type/global.type";
import BlogCard from "../BlogCard";
import "./style.scss";

/**
 * Renders the latest blog posts published on the backend.
 *
 * The endpoint is public, so no token is required. The cards keep the visual
 * language of the rest of the site (rounded images, muted grey blocks).
 */
const BlogSection = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        if (!cancelled) setBlogs(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

  const published = blogs.filter((blog) => blog.status === "Published");
  const latest = (published.length > 0 ? published : blogs).slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:mx-20">
      <h2 className="flex justify-center text-3xl sm:text-4xl font-bold">
        From Our Blog
      </h2>
      <p className="flex justify-center text-base mt-2 mb-8">
        News and stories about clean agricultural products
      </p>
      <Row gutter={[24, 24]}>
        {latest.map((blog) => (
          <Col key={blog._id} xs={24} sm={12} lg={8}>
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
      <div className="flex justify-center mt-8">
        <Link
          to="/blog"
          className="px-6 py-2 border-2 border-secondary text-primary rounded-full hover:bg-green-400 hover:text-white transition-colors"
        >
          View all articles
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
