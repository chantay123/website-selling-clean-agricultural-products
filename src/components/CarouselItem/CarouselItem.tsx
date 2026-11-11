import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { getBanners } from "../../apis";
import { BannerType } from "../../@type/global.type";

/**
 * Fallback slides used while the banner collection is loading or when the
 * API is unreachable. They keep the original look of the hero section.
 */
const fallbackSlides = [
  { url: "/image/hero-img-1.png", description: "" },
  { url: "/image/hero-img-2.jpg", description: "" },
  { url: "/image/banner-fruits.jpg", description: "" },
  { url: "/image/single-item.jpg", description: "" },
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

  /**
   * The banner height shrinks on a phone so the hero does not take the whole
   * viewport. Tailwind handles the breakpoint, the inline style only carries
   * the rounded corners and the object fit.
   */
  const slideClass =
    "w-full h-[180px] sm:h-[240px] md:h-[300px] rounded-[20px] object-cover";

  return (
    <Carousel autoplay>
      {slides.length > 0 ? (
        slides.map((banner) => (
          <div key={banner._id}>
            <img className={slideClass} src={banner.url} alt={banner.description} />
          </div>
        ))
      ) : (
        fallbackSlides.map((slide, index) => (
          <div key={`fallback-${index}`}>
            <img className={slideClass} src={slide.url} alt="" />
          </div>
        ))
      )}
    </Carousel>
  );
};

export default CarouselItem;
