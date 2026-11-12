import { Card } from "antd";
import { Link } from "react-router-dom";
import { BlogType } from "../../@type/global.type";

/**
 * A single blog teaser.
 *
 * The backend does not always provide a thumbnail, so a gradient placeholder
 * keeps the grid aligned instead of leaving a hole in the layout.
 */
type Props = {
  blog: BlogType;
};

const BlogCard = ({ blog }: Props) => {
  return (
    <Link to={`/blog/${blog._id}`} className="blog-card block h-full">
      <Card
        bordered={false}
        className="blog-card__body bg-gray-100 rounded-md h-full overflow-hidden"
        cover={
          blog.thumbnail ? (
            <img
              className="blog-card__image w-full h-[180px] object-cover"
              src={blog.thumbnail}
              alt={blog.title}
            />
          ) : (
            <div className="blog-card__placeholder w-full h-[180px]" />
          )
        }
      >
        <h3 className="blog-card__title text-xl font-bold mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="blog-card__author text-sm text-gray-500 mb-3">
          {blog.author_name || "Agrimarket"}
        </p>
        <p className="blog-card__excerpt text-base mb-4 line-clamp-3">
          {blog.description || blog.detail || ""}
        </p>
        <div className="blog-card__meta flex gap-4 text-sm text-gray-500">
          <span>{blog.views_count ?? 0} lượt xem</span>
          <span>{blog.comments_count ?? 0} bình luận</span>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
