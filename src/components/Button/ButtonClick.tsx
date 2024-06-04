import { ShoppingOutlined } from "@ant-design/icons";
import "./style.scss";

type buttonType = {
  onclick?: () => void;
};

const ButtonClick: React.FC<buttonType> = ({ onclick }) => {
  return (
    <div>
      <button
        onClick={onclick}
        className="button-primary  border border-yellow-300 rounded-full px-3 py-1  flex items-center"
      >
        <i className="shop mr-2">
          <ShoppingOutlined />
        </i>
        Add to cart
      </button>
    </div>
  );
};

export default ButtonClick;
