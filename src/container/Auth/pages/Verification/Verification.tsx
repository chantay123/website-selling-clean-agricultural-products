import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "tailwindcss/tailwind.css";
import { BG } from "../../../../constants/images";
import { Button, CountdownProps, Statistic } from "antd";
import { getStore, setStore } from "../../../../utils/setting";
import "./style.scss";
const { Countdown } = Statistic;

const Verification = () => {
  const [deadline, setDeadline] = useState<number>(Date.now() + 1000 * 60 * 5); // Setting deadline for OTP verification
  const [disableResendOTP, setDisableResendOTP] = useState<boolean>(false); // Setting whether to disable OTP resending
  const [OTP, setOTP] = useState<string[]>(Array(6).fill("")); // Setting OTP as an array of 6 empty strings
  const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null)); // Creating a ref for input elements
  useEffect(() => {
    const remainingTime = getStore("remainingTime");
    if (remainingTime) {
      setDeadline(Date.now() + parseInt(remainingTime));
    } else {
      setDeadline(Date.now() + 1000 * 60 * 5);
    }
  }, []);

  // // Function to handle OTP verification
  const handleSendOTP = async () => {};

  // // Function to handle OTP resending
  const handleResendOTP = async () => {};

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

  // Handling paste events for the input fields
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const paste = event.clipboardData.getData("text");
    if (paste.match(/^\d{6}$/)) {
      const newOTP = paste.split("").map((digit) => digit.padStart(1, "0"));
      setOTP(newOTP);
    }
  };
  return (
    <div className=" relative w-screen h-screen">
      <img
        className="w-full h-full object-cover"
        src={BG.MAIN_BG}
        alt="background"
      />
      <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-16 xs:w-full xs:h-full xs:p-5 ss:w-[90%] ss:h-[70%] smm:p-20 smm:w-[70%] smm:h-[60%] mds:h-[50%] lg:w-[60%] lg:h-[50%] xl:w-[40%] xl:h-[60%] ">
        <div className="xs:mt-16 ss:mt-10 xss:mt-8 sm:mt-16  smm:mt-2 lg:mt-8 xl:mt-2">
          <h3 className="mb-6 text-3xl font-semibold sm:text-4xl ">
            Verification Email
          </h3>
          <p className="mb-2 text-xs font-normal text-stone-500 lg:text-base  ">
            Please enter the OTP sent to your registered email address to
            complete the verification process.
          </p>
          <div className="mb-4 text-center">
            <Countdown value={deadline} format="mm:ss" onChange={onChange} />
          </div>
          <div className="flex justify-between m-auto lg:w-4/5 ">
            {OTP.map((number, id) => (
              <input
                key={id}
                ref={(ref) => (inputRef.current[id] = ref as HTMLInputElement)}
                type="text"
                className=" h-12 w-10 rounded-md border-2 text-center text-xl  lg:h-16 lg:w-16 lg:text-4xl"
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
            onClick={handleSendOTP}
            className="mt-10 xs:w-[250px] md:w-[500px] lg:w-[500px] font-bold text-white bg-green-400 h-10 rounded-full "
          >
            Submit
          </Button>
          <Button
            className="mt-2 xs:w-[250px] w-[500px] md:w-[500px] lg:w-[500px]  font-bold text-white bg-green-400 h-10 rounded-full"
            onClick={handleResendOTP}
            disabled={disableResendOTP}
          >
            Resend OTP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
