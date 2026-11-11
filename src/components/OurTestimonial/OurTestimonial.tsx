import { Avatar, Card, Carousel, CarouselProps, Flex, Rate } from "antd";
import React from "react";

import "./style.scss";
import { StarFilled } from "@ant-design/icons";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  2: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  3: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  4: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  5: <StarFilled />,
};

const testimonials = [
  { name: "Phan Chan Tay", rating: 4 },
  { name: "Nguyen Van A", rating: 5 },
  { name: "Tran Thi B", rating: 4 },
];

const OurTestimonial = () => {
  /**
   * The number of visible slides depends on the viewport. Ant Design does not
   * read the breakpoint on its own, so the width is tracked here and the
   * carousel is reconfigured when it changes.
   */
  const [slidesToShow, setSlidesToShow] = React.useState(3);

  React.useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const settings: CarouselProps = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
  };

  return (
    <div className="mt-16 sm:mt-20 mx-5 sm:mx-10 lg:mx-20">
      <h4 className="text-primary flex justify-center text-2xl">
        Our Testimonial
      </h4>
      <h2 className="flex justify-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-center px-4">
        Our Client Saying!
      </h2>
      <Carousel
        {...settings}
        style={{ width: "100%" }}
        arrows={false}
        className="mt-10 lg:mt-20"
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="flex justify-center px-2">
            <Card
              bordered={false}
              className="bg-gray-200 w-full max-w-[400px]"
              styles={{ body: { padding: "1.5rem" } }}
            >
              <div className="flex items-center">
                <Avatar className="w-16 h-16 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
                    alt=""
                  />
                </Avatar>
                <div className="ml-3 leading-9">
                  <h4 className="text-xl">{testimonial.name}</h4>
                  <p className="text-base">Good</p>
                </div>
              </div>
              <div className="flex lg:ml-20 mt-3">
                <Flex gap="middle" vertical>
                  <Flex gap="middle">
                    <Rate
                      disabled
                      defaultValue={testimonial.rating}
                      character={({ index = 0 }) => customIcons[index + 1]}
                    />
                  </Flex>
                </Flex>
              </div>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default OurTestimonial;
