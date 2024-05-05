import BestsellerProducts from "../../../components/BestsellerProducts/BestsellerProducts";
import CartProduct from "../../../components/CartProducts/CartProduct";
import ExoticFruits from "../../../components/Exotic Fruits";
import Footer from "../../../components/Footer";

import HeaderItem from "../../../components/HeaderItem";
import OurTestimonial from "../../../components/OurTestimonial";
import ProductPortfolio from "../../../components/ProductPortfolio";
import SearchProduct from "../../../components/SearchProduct";

const Mainhome = () => {
  return (
    <div>
      <HeaderItem />
      <SearchProduct />
      <ProductPortfolio />
      <CartProduct />
      <ExoticFruits />
      <BestsellerProducts />
      <OurTestimonial />
      <Footer />
    </div>
  );
};

export default Mainhome;
