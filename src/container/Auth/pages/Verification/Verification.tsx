import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "tailwindcss/tailwind.css";
import { Button, CountdownProps, Statistic } from "antd";
import { getStore, setStore } from "../../../../utils/setting";
import "./style.scss";
import {
  authenticateForgotPassword,
  authenticateOtp,
  resendOtp as resendOtpApi,
} from "../../../../apis";
import { getApiErrorMessage } from "../../../../utils/api.adapter";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/config";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

const { Countdown } = Statistic;

const Verification = () => {
  const [deadline, setDeadline] = useState<number>(Date.now() + 1000 * 60 * 5); // Setting deadline for OTP verification
  const [disableResendOTP] = useState<boolean>(false); // Setting whether to disable OTP resending
  const [OTP, setOTP] = useState<string[]>(Array(6).fill("")); // Setting OTP as an array of 6 empty strings
  const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null)); // Creating a ref for input elements

  const email = useSelector((state: RootState) => state.user.email);
  const forgotpassword = useSelector(
    (state: RootState) => state.user.isForgotPassword
  );
  const navigate = useNavigate();

  useEffect(() => {
    const remainingTime = getStore("remainingTime");
    if (remainingTime) {
      setDeadline(Date.now() + parseInt(remainingTime));
    } else {
      setDeadline(Date.now() + 1000 * 60 * 5);
    }
  }, []);

  // Event handler for Countdown component's onChange event
  const onChange: CountdownProps["onChange"] = (val) => {
    if (typeof val === "number") {
      setStore("remainingTime", val);
    }
  };
  // Handling text change in the input fields const
  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = event.target.value;
    if (isNaN(parseInt(input, 10))) {
      event.target.value = "";
    } else {
      const newOTP = [...OTP];
      newOTP[index] = input;
      setOTP(newOTP);
      if (index + 1 < newOTP.length) {
        inputRef.current[index + 1].focus();
      }
    }
  };
  // Handling keyboard events for the input fields const
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const { key } = event;
    if (key === "Backspace") {
      if (OTP[index].length === 1) {
        const newOTP = [...OTP];
        newOTP[index] = "";
        setOTP(newOTP);
      } else {
        if (index > 0) {
          inputRef.current[index - 1].focus();
        }
      }
    }
  };

  //call api verification otp
  const handleConfirmClick = async () => {
    const otpString = OTP.join("");
    const OTP_LENGTH: number = Number(import.meta.env.VITE_OTP_LENGTH);

    if (otpString.length === OTP_LENGTH) {
      if (forgotpassword === true) {
        try {
          const response = await authenticateForgotPassword(otpString);
          const { message } = response;
          toast.success(message);
          navigate("/new-password");
        } catch (error: any) {
          toast.error(getApiErrorMessage(error, "Mã OTP không dúng"));
        }
      } else {
        try {
          const response = await authenticateOtp(otpString);
          const { message } = response;
          toast.success(message);
          navigate("/");
        } catch (error: any) {
          toast.error(getApiErrorMessage(error, "Mã OTP không dúng"));
        }
      }
    } else {
      toast.warn("Please enter all characters of otp string");
    }
  };
  //call api resend otp
  const handleResendClick = async () => {
    try {
      const response = await resendOtpApi(email ?? "");
      const { message } = response;
      toast.success(message);
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "L?i g?i l?i OTP"));
    }
  };

  // Handling paste events for the input fields
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const paste = event.clipboardData.getData("text");
    if (paste.match(/^\d{6}$/)) {
      const newOTP = paste.split("").map((digit) => digit.padStart(1, "0"));
      setOTP(newOTP);
    }
  };
  return (
    <AuthLayout>
      <div className="text-center rounded-xl bg-white p-6 sm:p-10 w-full max-w-[520px] shadow-lg">
        <div>
          <h3 className="mb-6 text-2xl sm:text-4xl font-semibold">
            Verification Email
          </h3>
          <p className="mb-2 text-xs font-normal text-stone-500 lg:text-base">
            Please enter the OTP sent to your registered email address to
            complete the verification process.
          </p>
          <div className="mb-4 text-center">
            <Countdown value={deadline} format="mm:ss" onChange={onChange} />
          </div>
          <div className="flex justify-between m-auto gap-2 max-w-[420px]">
            {OTP.map((number, id) => (
              <input
                key={id}
                ref={(ref) => (inputRef.current[id] = ref as HTMLInputElement)}
                type="text"
                className="h-12 w-full max-w-[64px] rounded-md border-2 text-center text-xl lg:h-16 lg:text-4xl"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="\d{1}"
                value={number}
                maxLength={1}
                onChange={(event) => handleTextChange(event, id)}
                onKeyDown={(event) => handleKeyDown(event, id)}
                onPaste={(event) => handlePaste(event)}
              />
            ))}
          </div>
          <Button
            onClick={handleConfirmClick}
            htmlType="submit"
            className="mt-10 w-full max-w-[250px] font-bold text-white bg-green-400 h-10 rounded-full"
          >
            Submit
          </Button>
          <br></br>
          <Button
            className="mt-2 w-full max-w-[250px] font-bold text-white bg-green-400 h-10 rounded-full"
            onClick={handleResendClick}
            htmlType="button"
            disabled={disableResendOTP}
          >
            Resend OTP
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Verification;
