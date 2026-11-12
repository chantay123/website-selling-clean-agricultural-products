import { Col, Row } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./style.scss";
import "tailwindcss/tailwind.css";

/**
 * Site footer.
 *
 * The four information columns stack on narrow screens so the links stay
 * readable on a phone.
 */
const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.warn("Vui lòng nhập email của bạn");
      return;
    }

    // The backend does not expose a newsletter endpoint yet, so the form only
    // confirms the input locally.
    toast.success("Đăng ký nhận bản tin thành công");
    setEmail("");
  };

  return (
    <div className="bg-dark text-white py-10 mt-16 sm:mt-20">
      <div className="mt-10 mx-5 sm:mx-10 lg:ml-20 lg:mr-20">
        <div className="pb-4 mb-4 border-b border-yellow-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Link to="/">
                <h1 className="text-3xl sm:text-4xl">Agrimarket</h1>
                <p className="text-secondary">Nông sản sạch tận nguồn</p>
              </Link>
            </div>
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="btn-border border-2 w-full py-3 px-4 rounded-full relative bg-transparent text-white"
                  placeholder="Email của bạn"
                />
                <button
                  type="submit"
                  className="btn-search border-2 rounded-full text-white px-6 py-3 whitespace-nowrap"
                >
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 sm:mx-10 lg:mx-20">
        <Row gutter={[24, 32]} justify="space-between">
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-5">
              <h4 className="text-xl sm:text-2xl mb-3 font-semibold">
                Vì sao khách hàng chọn chúng tôi?
              </h4>
              <p className="mb-4 text-sm sm:text-base leading-7">
                Agrimarket là điểm phân phối nông sản sạch đạt chuẩn VietGAP
                và GlobalG.A.P. Mọi sản phẩm đều có giấy tờ chứng nhận nguồn
                gốc, mẫu kiểm nghiệm trước mỗi đợt thu mua và được vận chuyển
                trong chuỗi lạnh để giữ trọn độ tươi.
              </p>
              <Link
                to="/blog"
                className="btn-primary inline-block py-2 px-4 rounded-full border-secondary text-primary"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <div className="mb-5">
              <h4 className="text-xl sm:text-2xl mb-3 font-semibold">
                Thông tin cửa hàng
              </h4>
              <ul className="leading-7 text-sm sm:text-base">
                <li>
                  <Link to="/blog" className="text-base">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base">
                    <span>Liên hệ</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base">
                    Điều khoản & điều kiện
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base">
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base">
                    Câu hỏi thường gặp
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <h4 className="text-xl sm:text-2xl mb-3 font-semibold">
              Tài khoản của tôi
            </h4>
            <ul className="leading-7 text-sm sm:text-base">
              <li>
                <Link to="/profile" className="text-base">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-base">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/myfavorite" className="text-base">
                  Danh sách yêu thích
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-base">
                  Đặt hàng quốc tế
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-5 leading-7">
              <h4 className="text-xl sm:text-2xl mb-5 font-semibold">
                Liên hệ
              </h4>
              <p className="mb-2 text-sm sm:text-base">
                Địa chỉ: 1429 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh
              </p>
              <p className="mb-2 text-sm sm:text-base">
                Email: support@agrimarket.vn
              </p>
              <p className="mb-2 text-sm sm:text-base">
                Điện thoại: 0909 123 456
              </p>
              <p className="mb-2 text-sm sm:text-base">Phương thức thanh toán</p>
              <img
                className="max-w-full"
                src="/image/payment.png"
                alt="Phương thức thanh toán"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
