import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { getBanners } from "../../apis";
import { BannerType } from "../../@type/global.type";

const contentStyle: React.CSSProperties = {
  color: "#fff",
  borderRadius: "20px",
  objectFit: "cover",
  height: "300px",
  width: "100%",
};

/**
 * Fallback slides used while the banner collection is loading or when the
 * API is unreachable. They keep the original look of the hero section.
 */
const fallbackSlides = [
  { url: "../../../public/image/hero-img-1.png", description: "" },
  { url: "../../../public/image/hero-img-2.jpg", description: "" },
  {
    url: "https://bloganchoi.com/wp-content/uploads/2021/03/ra-cu-qua-giup-ban-no-lau-hon.jpg",
    description: "",
  },
  {
    url: "https://media.tapchitaichinh.vn/w1480/images/upload/buituananh/05202021/3551_gia_thuc_pham_hom_nay.jpg",
    description: "",
  },
];

const CarouselItem = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        if (!cancelled) setBanners(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBanners();
    return () => {
      cancelled = true;
    };
  }, []);

  // The API returns 1332 banners but only a few of them are meaningful
  // illustrations, so the carousel shows the first ones that have a URL.
  const slides = banners.filter((banner) => Boolean(banner.url)).slice(0, 8);

  return (
    <Carousel autoplay>
      {slides.length > 0 ? (
        slides.map((banner) => (
          <div key={banner._id}>
            <img style={contentStyle} src={banner.url} alt={banner.description} />
          </div>
        ))
      ) : (
        fallbackSlides.map((slide, index) => (
          <div key={`fallback-${index}`}>
            <img style={contentStyle} src={slide.url} alt="" />
          </div>
        ))
      )}
    </Carousel>
  );
};

export default CarouselItem;
