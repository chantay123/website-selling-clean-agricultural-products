import { Avatar, Card, Carousel, CarouselProps, Flex, Rate } from "antd";
import React from "react";

import { StarFilled } from "@ant-design/icons";
import { seedTestimonials } from "../../data/seed";

const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  2: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  3: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  4: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  5: <StarFilled />,
};

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
        Cảm nhận của khách hàng
      </h4>
      <h2 className="flex justify-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-center px-4">
        Khách hàng nói gì về chúng tôi?
      </h2>
      <Carousel
        {...settings}
        style={{ width: "100%" }}
        arrows={false}
        className="mt-10 lg:mt-20"
      >
        {seedTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex justify-center px-2">
            <Card
              bordered={false}
              className="bg-gray-200 w-full max-w-[400px]"
              styles={{ body: { padding: "1.5rem" } }}
            >
              <div className="flex items-center">
                <Avatar className="w-16 h-16 shrink-0">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </Avatar>
                <div className="ml-3 leading-9">
                  <h4 className="text-xl">{testimonial.name}</h4>
                  <p className="text-base">{testimonial.role}</p>
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
              <p className="text-color mt-4 leading-6">
                “{testimonial.content}”
              </p>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default OurTestimonial;
