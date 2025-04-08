import { ShoppingOutlined } from "@ant-design/icons";
import "./style.scss";

type buttonType = {
  label: string;
  Icon?: React.ElementType | undefined;
  classNameButton?: string;
  classNameIcon?: string;
  onClick?: () => void;
};

const ButtonClick: React.FC<buttonType> = ({
  label,
  Icon,
  classNameButton,
  classNameIcon,
  onClick,
}) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="button-primary  border border-yellow-300 rounded-full px-3 py-1  flex items-center"
      >
        <i className="shop mr-2">
          <ShoppingOutlined />
        </i>
        {label}
      </button>
    </div>
  );
};

export default ButtonClick;
