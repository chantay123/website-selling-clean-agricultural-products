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
        {/* <div className="slide-item p-3 rounded-lg ">
          <Card
            className=" border-2 bg-blue-900 border-gray-opacity w-56  rounded-lg"
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%", padding: 0 }}
          >
            <Fancybox>
              <a
                href={
                  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                data-fancybox="gallery"
              ></a>
            </Fancybox>
          </Card>
        </div>
        <div className="slide-item p-3 rounded-lg shadow-md">
          <Card
            className=" border-2 bg-blue-900 border-gray-opacity w-56 hover:border-gray-500 rounded-lg"
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%", padding: 0 }}
          >
            <Fancybox>
              <a
                href={
                  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                data-fancybox="gallery"
              >
                <Avatar
                  shape="square"
                  src={
                    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className="cursor-pointer w-full h-40"
                />
              </a>
            </Fancybox>
            <div className="p-3">
              <h3 className="text-white font-popins text-base">qweqweqwe</h3>
              <Button className="text-white font-popins w-full bg-gray-opacity border-0">
                Follow
              </Button>
            </div>
          </Card>
        </div>
        <div className="slide-item p-3 rounded-lg shadow-md">
          <Card
            className=" border-2 bg-blue-900 border-gray-opacity w-56 hover:border-gray-500 rounded-lg"
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%", padding: 0 }}
          >
            <Fancybox>
              <a
                href={
                  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                data-fancybox="gallery"
              >
                <Avatar
                  shape="square"
                  src={
                    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className="cursor-pointer w-full h-40"
                />
              </a>
            </Fancybox>
            <div className="p-3">
              <h3 className="text-white font-popins text-base">qweqweqwe</h3>
              <Button className="text-white font-popins w-full bg-gray-opacity border-0">
                Follow
              </Button>
            </div>
          </Card>
        </div>
        <div className="slide-item p-3 rounded-lg shadow-md">
          <Card
            className=" border-2 bg-blue-900 border-gray-opacity w-56 hover:border-gray-500 rounded-lg"
            style={{ height: "100%" }}
            bodyStyle={{ height: "100%", padding: 0 }}
          >
            <Fancybox>
              <a
                href={
                  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                data-fancybox="gallery"
              >
                <Avatar
                  shape="square"
                  src={
                    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  className="cursor-pointer w-full h-40"
                />
              </a>
            </Fancybox>
            <div className="p-3">
              <h3 className="text-white font-popins text-base">qweqweqwe</h3>
              <Button className="text-white font-popins w-full bg-gray-opacity border-0">
                Follow
              </Button>
            </div>
          </Card>
        </div> */}
      </Carousel>
    </div>
  );
};

export default OurTestimonial;
