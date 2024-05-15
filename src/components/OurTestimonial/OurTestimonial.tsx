import { Card, Carousel, CarouselProps } from "antd";

import "./style.scss";

const OurTestimonial = () => {
  const settings: CarouselProps = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <div className="mt-20  ml-20 mr-20">
      <h4 className=" text-primary flex  justify-center text-2xl">
        Our Testimonial
      </h4>
      <h2 className="flex  justify-center text-5xl font-bold mb- ">
        Our Client Saying!
      </h2>
      <Carousel
        {...settings}
        style={{ width: "100%" }}
        arrows={false}
        className="mt-20 "
      >
        <div className="flex justify-center">
          <Card
            title="Client NGUYEN NON"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
      </Carousel>
    </div>
  );
};

export default OurTestimonial;
