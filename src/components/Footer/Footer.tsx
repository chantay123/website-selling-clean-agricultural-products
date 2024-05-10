import { Col, Row } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";
const Footer = () => {
  return (
    <div className="bg-dark text-white py-10  mt-20">
      <div className=" mt-10 ml-20 mr-20">
        <div className="pb-4 mb-4 border-b border-yellow-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div>
              <a href="#">
                <h1 className="text  text-4xl">Fruitables</h1>
                <p className="text-secondary">Fresh products</p>
              </a>
            </div>
            <div>
              <input
                className=" btn-border border-2  w-full py-3 px-4 rounded-full relative"
                type="text"
                placeholder="Your Email"
              ></input>
              <button
                type="submit"
                className=" btn-search border-2 absolute  py-3 px-3 rounded-full text-white -ml-[110px]  "
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Row justify="space-between">
          <Col span={4} className="ml-20">
            <div className="mb-5">
              <h4 className="text-2xl mb-3 font-semibold ">
                Why People Like us!
              </h4>
              <p className="mb-4 text-base leading-7">
                World Agricultural Store is one of the addresses distributing
                clean quality agricultural products. All agricultural products
                sold at the store have clear documents proving their origin. In
                addition, to ensure that all clean agricultural products are
                sampled for testing on each batch.
              </p>
              <a
                href=""
                className="btn-primary py-2 px-4 rounded-full border-secondary text-primary"
              >
                Read More
              </a>
            </div>
          </Col>
          <Col span={4}>
            <div className="">
              <div className="  mb-5">
                <h4 className="text-2xl mb-3 font-semibold ">Shop Info</h4>
                <ul className="leading-7">
                  <li>
                    <a href="" className="text-base ">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-base ">
                      <span>Contact Us</span>
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-base ">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-base ">
                      Terms & Condition
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-base ">
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
            </div>
          </Col>
          <Col span={4}>
            <h4 className="text-2xl mb-3 font-semibold  ">My Account</h4>
            <ul className="leading-7">
              <li>
                <a href="" className="text-xl ">
                  Shop details
                </a>
              </li>
              <li>
                <a href="" className="text-base ">
                  Shopping Cart
                </a>
              </li>
              <li>
                <a href="" className="text-base ">
                  Wishlist
                </a>
              </li>
              <li>
                <a href="" className="text-base ">
                  Order History
                </a>
              </li>
              <li>
                {" "}
                <a href="" className="text-base ">
                  International Orders
                </a>
              </li>
            </ul>
          </Col>
          <Col span={4}>
            <div className="mb-5 leading-7">
              <h4 className="text-2xl mb-5 font-semibold ">Contact</h4>
              <p className="mb-2 text-base">Address: 1429 Netus Rd, NY 48247</p>
              <p className="mb-2 text-base">Email: Example@gmail.com</p>
              <p className="mb-2 text-base">Phone: +0123 4567 8910</p>
              <p className="mb-2 text-base">Payment Accepted</p>
              <img src="img/payment.png" alt="" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
