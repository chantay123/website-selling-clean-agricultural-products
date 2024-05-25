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
            title="Client"
            bordered={false}
            style={{ width: 400 }}
            className="bg-gray-200 "
          >
            <div className="flex  items-center">
              <Avatar>
                <img
                  src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTu54ZVXa6AYq52ST3yGOmrr5TLzSWZd0KZwYjE6GCcxNnPwRv6"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4>wqeqwe</h4>
                <p>234324</p>
              </div>
            </div>
            <div className="flex ml-10 mt-3 ">
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
              <Avatar>
                <img
                  src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTu54ZVXa6AYq52ST3yGOmrr5TLzSWZd0KZwYjE6GCcxNnPwRv6"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4>wqeqwe</h4>
                <p>234324</p>
              </div>
            </div>
            <div className="flex ml-10 mt-3 ">
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
              <Avatar>
                <img
                  src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTu54ZVXa6AYq52ST3yGOmrr5TLzSWZd0KZwYjE6GCcxNnPwRv6"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4>wqeqwe</h4>
                <p>234324</p>
              </div>
            </div>
            <div className="flex ml-10 mt-3 ">
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
              <Avatar>
                <img
                  src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTu54ZVXa6AYq52ST3yGOmrr5TLzSWZd0KZwYjE6GCcxNnPwRv6"
                  alt=""
                />
              </Avatar>
              <div className=" ml-3 leading-9">
                <h4>Client Name</h4>
                <p>Profession</p>
              </div>
            </div>
            <div className="flex ml-10 mt-3 ">
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
