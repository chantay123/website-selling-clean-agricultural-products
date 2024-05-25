import { ShoppingOutlined } from "@ant-design/icons";
import "./style.scss";
import requestApi from "../../utils/interceptors";
const Button = () => {
  const buttonAdd = async () => {
    try {
      const respone = await requestApi("products", "POST", {});
    } catch (error) {}
  };

  return (
    <div>
      <button className="button-primary  border border-yellow-300 rounded-full px-3 py-1  flex items-center">
        <i className="shop mr-2">
          <ShoppingOutlined />
        </i>
        Add to cart
      </button>
    </div>
  );
};

export default Button;
