import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { getBlogs } from "../../apis";
import { BlogType } from "../../@type/global.type";
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
    <div className="mt-20 ml-20 mr-20">
      <h2 className="flex justify-center text-4xl font-bold">From Our Blog</h2>
      <p className="flex justify-center text-base mt-2 mb-8">
        News and stories about clean agricultural products
      </p>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {latest.map((blog) => (
          <Col key={blog._id} className="gutter-row" span={8}>
            <Card
              bordered={false}
              className="bg-gray-100 rounded-md h-full"
              cover={
                blog.thumbnail ? (
                  <img
                    className="w-full h-[180px] object-cover"
                    src={blog.thumbnail}
                    alt={blog.title}
                  />
                ) : undefined
              }
            >
              <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {blog.author_name || "Agrimarket"}
              </p>
              <p className="text-base mb-4">
                {blog.description || blog.detail || ""}
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{blog.views_count ?? 0} views</span>
                <span>{blog.comments_count ?? 0} comments</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BlogSection;
