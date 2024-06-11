import { Avatar, Card, Carousel, CarouselProps, Flex, Rate } from "antd";

import "./style.scss";
import { StarFilled } from "@ant-design/icons";
const customIcons: Record<number, React.ReactNode> = {
  1: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  2: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  3: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  4: <StarFilled style={{ color: "#81c408", width: "20px", height: "20px" }} />,
  5: <StarFilled />,
};
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
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <div className="flex  items-center">
              <Avatar className="w-16 h-16">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4 className="text-xl"> Phan Chan Tay</h4>
                <p className="text-base">Good</p>
              </div>
            </div>
            <div className="flex ml-20 mt-3 ">
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate
                    disabled
                    defaultValue={4}
                    character={({ index = 0 }) => customIcons[index + 1]}
                  />
                </Flex>
              </Flex>
            </div>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <div className="flex  items-center">
              <Avatar className="w-16 h-16">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4 className="text-xl"> Phan Chan Tay</h4>
                <p className="text-base">Good</p>
              </div>
            </div>
            <div className="flex ml-20 mt-3 ">
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate
                    disabled
                    defaultValue={4}
                    character={({ index = 0 }) => customIcons[index + 1]}
                  />
                </Flex>
              </Flex>
            </div>
          </Card>
        </div>
        <div className="flex justify-center">
          <Card
            title="Card title"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <div className="flex  items-center">
              <Avatar className="w-16 h-16">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4 className="text-xl"> Phan Chan Tay</h4>
                <p className="text-base">Good</p>
              </div>
            </div>
            <div className="flex ml-20 mt-3 ">
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate
                    disabled
                    defaultValue={4}
                    character={({ index = 0 }) => customIcons[index + 1]}
                  />
                </Flex>
              </Flex>
            </div>
          </Card>
        </div>
      </Carousel>
    </div>
  );
};

export default OurTestimonial;
