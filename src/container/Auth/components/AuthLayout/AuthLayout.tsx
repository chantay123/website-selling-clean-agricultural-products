import { BG } from "../../../../constants/images";
import "tailwindcss/tailwind.css";

/**
 * Shared shell of every authentication screen.
 *
 * The form is centred with flexbox instead of absolute positioning so a form
 * taller than the viewport stays scrollable instead of being cut off.
 */
type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="w-screen min-h-screen relative flex items-center justify-center overflow-y-auto">
      <img
        className="fixed inset-0 w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <div className="relative w-full flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
