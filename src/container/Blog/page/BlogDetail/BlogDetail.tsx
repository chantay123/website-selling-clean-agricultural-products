import {
  createBlogComment,
  createReport,
  deleteBlogComment,
  getBlogById,
  getBlogComments,
  likeBlog,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { BlogType, CommentType } from "../../../../@type/global.type";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/config";
import { Layout, Spin } from "antd";
import HeaderItem from "../../../../components/HeaderItem";
import Footer from "../../../../components/Footer";
import NotFound from "../../../../components/NotFound";
import { toast } from "react-toastify";

/**
 * Blog detail page.
 *
 * `GET /blogs/:id` is public, but the comments live behind a bearer token,
 * so the discussion is only loaded for a signed in visitor.
 */
const BlogDetail = () => {
  const { blogId } = useParams();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      try {
        const response = await getBlogById(blogId ?? "");
        if (!cancelled) {
          setBlog(response.data);
          setLikes(response.data?.likes_count ?? 0);
          setNotFound(false);
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlog();
    return () => {
      cancelled = true;
    };
  }, [blogId]);

  const fetchComments = useCallback(async () => {
    if (!blogId) return;
    setCommentsLoading(true);
    try {
      const response = await getBlogComments(blogId);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCommentsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (!blogId) return;
    fetchComments();
  }, [blogId, fetchComments]);

  /** Likes the article. The endpoint is private, so a guest is asked to sign in. */
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.warn("Đăng nhập để thích bài viết này");
      return;
    }

    try {
      await likeBlog(blogId ?? "");
      setLiked(true);
      setLikes((count) => count + 1);
      toast.success("Đã thích bài viết");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi thích bài viết"));
    }
  };

  /** Flags the article for the moderation queue. */
  const handleReport = async () => {
    if (!isAuthenticated) {
      toast.warn("Đăng nhập để báo cáo bài viết này");
      return;
    }

    try {
      await createReport({
        target_type: "blog",
        target_id: blogId ?? "",
        reason: "Inappropriate content",
      });
      setReported(true);
      toast.success("Đã gửi báo cáo, cảm ơn bạn");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi gửi báo cáo"));
    }
  };

  /** Publishes a new comment on the article. */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!content.trim()) {
      toast.warn("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setSubmitting(true);
      await createBlogComment(blogId ?? "", { content: content.trim() });
      setContent("");
      toast.success("Đăng bình luận thành công");
      fetchComments();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi đăng bình luận"));
    } finally {
      setSubmitting(false);
    }
  };

  /** Removes a comment. */
  const handleDelete = async (commentId: string) => {
    try {
      await deleteBlogComment(blogId ?? "", commentId);
      toast.success("Xoá bình luận thành công");
      fetchComments();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi xoá bình luận"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !blog) return <NotFound />;

  return (
    <div>
      <Layout>
        <HeaderItem />
      </Layout>

      <article className="blog-detail max-w-4xl mx-auto px-5 pb-16">
        <Link to="/blog" className="text-sm text-gray-500 hover:underline">
          &larr; Quay lại danh sách bài viết
        </Link>

        <h1 className="blog-detail__title mt-4 mb-3">{blog.title}</h1>

        <div className="blog-detail__meta flex flex-wrap gap-4 mb-6">
          <span>{blog.author_name || "Agrimarket"}</span>
          <span>{blog.views_count ?? 0} lượt xem</span>
          <span>{blog.comments_count ?? 0} bình luận</span>
          {blog.status ? <span>{blog.status}</span> : null}
        </div>

        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 border-2 border-secondary rounded-full text-primary hover:bg-green-400 hover:text-white transition-colors disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23a3.75 3.75 0 0 1-1.423-1.06 3.75 3.75 0 0 0-1.423-1.06 3.75 3.75 0 0 1-1.423-.23H6.633"
            />
          </svg>
          <span>{likes} lượt thích</span>
        </button>

        <button
          type="button"
          onClick={handleReport}
          disabled={reported}
          className="mb-6 ml-3 inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
            />
          </svg>
          <span>{reported ? "Đã báo cáo" : "Báo cáo"}</span>
        </button>

        {blog.thumbnail ? (
          <img
            className="blog-detail__cover mb-8"
            src={blog.thumbnail}
            alt={blog.title}
          />
        ) : (
          <div className="blog-detail__cover-placeholder mb-8" />
        )}

        <div className="blog-detail__content text-base whitespace-pre-line">
          {blog.detail || blog.description || ""}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Bình luận ({comments.length})
          </h2>

          {!isAuthenticated ? (
            <p className="text-gray-600 mb-6">
              Đăng nhập để tham gia thảo luận bài viết này.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mb-8">
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 px-6 py-2 bg-green-400 text-white rounded-full disabled:opacity-50"
              >
                {submitting ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </form>
          )}

          {commentsLoading ? (
            <div className="py-6 flex justify-center">
              <Spin />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-600">Chưa có bình luận nào.</p>
          ) : (
            <div>
              {comments.map((comment) => (
                <div key={comment._id} className="blog-comments__item">
                  <img
                    src={comment.avatar || "/image/avatar.jpg"}
                    alt="Ảnh đại diện"
                    className="blog-comments__avatar"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="blog-comments__author">
                        {comment.user_name || comment.username || "Người dùng"}
                      </span>
                      <span className="blog-comments__date">
                        {comment.created_at
                          ? new Date(comment.created_at).toLocaleDateString("vi-VN")
                          : ""}
                      </span>
                    </div>
                    <p className="mt-1 mb-1">{comment.content || ""}</p>
                    {isAuthenticated ? (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-sm text-red-600 underline"
                      >
                        Xoá
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;
