import { Col, Row } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
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
              <a href="#">
                <h1 className="text-3xl sm:text-4xl">Fruitables</h1>
                <p className="text-secondary">Fresh products</p>
              </a>
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
                  placeholder="Your Email"
                />
                <button
                  type="submit"
                  className="btn-search border-2 rounded-full text-white px-6 py-3 whitespace-nowrap"
                >
                  Subscribe Now
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
                Why People Like us!
              </h4>
              <p className="mb-4 text-sm sm:text-base leading-7">
                World Agricultural Store is one of the addresses distributing
                clean quality agricultural products. All agricultural products
                sold at the store have clear documents proving their origin. In
                addition, to ensure that all clean agricultural products are
                sampled for testing on each batch.
              </p>
              <a
                href=""
                className="btn-primary inline-block py-2 px-4 rounded-full border-secondary text-primary"
              >
                Read More
              </a>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <div className="mb-5">
              <h4 className="text-xl sm:text-2xl mb-3 font-semibold">Shop Info</h4>
              <ul className="leading-7 text-sm sm:text-base">
                <li>
                  <a href="" className="text-base">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="" className="text-base">
                    <span>Contact Us</span>
                  </a>
                </li>
                <li>
                  <a href="" className="text-base">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="" className="text-base">
                    Terms & Condition
                  </a>
                </li>
                <li>
                  <a href="" className="text-base">
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="" className="text-base">
                    FAQs & Help
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <h4 className="text-xl sm:text-2xl mb-3 font-semibold">My Account</h4>
            <ul className="leading-7 text-sm sm:text-base">
              <li>
                <a href="" className="text-base">
                  Shop details
                </a>
              </li>
              <li>
                <a href="" className="text-base">
                  Shopping Cart
                </a>
              </li>
              <li>
                <a href="" className="text-base">
                  Wishlist
                </a>
              </li>
              <li>
                <a href="" className="text-base">
                  Order History
                </a>
              </li>
              <li>
                <a href="" className="text-base">
                  International Orders
                </a>
              </li>
            </ul>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="mb-5 leading-7">
              <h4 className="text-xl sm:text-2xl mb-5 font-semibold">Contact</h4>
              <p className="mb-2 text-sm sm:text-base">
                Address: 1429 Netus Rd, NY 48247
              </p>
              <p className="mb-2 text-sm sm:text-base">Email: Example@gmail.com</p>
              <p className="mb-2 text-sm sm:text-base">Phone: +0123 4567 8910</p>
              <p className="mb-2 text-sm sm:text-base">Payment Accepted</p>
              <img
                className="max-w-full"
                src="/image/payment.png"
                alt="Payment methods"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
