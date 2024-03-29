import { useState } from "react";
import OTPInput from "react-otp-input";
import "tailwindcss/tailwind.css";
import { BG } from "../../../../constants/images";

const Verification = () => {
  const [otp, setOtp] = useState("");
  return (
    <div>
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-10 ">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
        />
      </div>
    </div>
  );
};

export default Verification;
