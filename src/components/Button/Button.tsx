import { ShoppingOutlined } from "@ant-design/icons";
import "./style.scss";
const Button = () => {
  return (
    <div>
      <a
        href="#"
        className="button-primary  border border-yellow-300 rounded-full px-3 py-1  flex items-center"
      >
        <i className="shop mr-2">
          <ShoppingOutlined />
        </i>
        Add to cart
      </a>
    </div>
  );
};

export default Button;
