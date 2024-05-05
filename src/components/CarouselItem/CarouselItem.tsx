import { Carousel } from "antd";
import "./style.scss";
import "tailwindcss/tailwind.css";

const contentStyle: React.CSSProperties = {
  color: "#fff",
  borderRadius: "20px",
  objectFit: "cover",
  height: "300px",
  width: "100%",
};
const CarouselItem = () => {
  return (
    <Carousel autoplay>
      <div>
        <img
          style={contentStyle}
          src="http://127.0.0.1:5500/fruitables-1.0.0/img/hero-img-2.jpg"
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="http://127.0.0.1:5500/fruitables-1.0.0/img/hero-img-1.png"
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="https://bloganchoi.com/wp-content/uploads/2021/03/ra-cu-qua-giup-ban-no-lau-hon.jpg"
        />
      </div>
      <div>
        <img
          style={contentStyle}
          src="https://media.tapchitaichinh.vn/w1480/images/upload/buituananh/05202021/3551_gia_thuc_pham_hom_nay.jpg"
        />
      </div>
    </Carousel>
  );
};

export default CarouselItem;
