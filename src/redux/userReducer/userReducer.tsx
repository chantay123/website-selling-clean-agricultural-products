import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userType, userState } from "../../@type/user.type";
import { productTypes } from "../../@type/global.type";

const initialState: userState = {
  login: null,
  register: null,
  verify: null,
  resendOTP: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  email: null,
  isForgotPassword: false,
  product: [],
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    // Action to handle user login
    setLoginDetails: (state: userState, action: PayloadAction<userType>) => {
      state.login = action.payload;
    },
    // Action to handle user registration
    setRegistrationDetails: (
      state: userState,
      action: PayloadAction<userType>
    ) => {
      state.register = action.payload;
    },
    // Action to handle user verification
    setVerificationDetails: (
      state: userState,
      action: PayloadAction<userType>
    ) => {
      state.verify = action.payload;
    },
    // Action to resend OTP
    setOTPResendDetails: (
      state: userState,
      action: PayloadAction<userType>
    ) => {
      state.verify = action.payload;
    },
    // Toggle loading state
    setLoadingStatus: (state: userState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Update authentication status
    setAuthenticationStatus: (
      state: userState,
      action: PayloadAction<boolean>
    ) => {
      state.isAuthenticated = action.payload;
    },
    // Check if the user is an admin
    setAdminStatus: (state: userState, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    // Save registed email to resend OTP
    setEmailResendOTP: (state: userState, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setIsFogotPassword: (state: userState, action: PayloadAction<boolean>) => {
      state.isForgotPassword = action.payload;
    },
    //Save product
    setProduct: (state: userState, action: PayloadAction<productTypes[]>) => {
      state.product = action.payload;
    },
  },
});

export const {
  setLoginDetails,
  setRegistrationDetails,
  setVerificationDetails,
  setOTPResendDetails,
  setLoadingStatus,
  setAdminStatus,
  setAuthenticationStatus,
  setEmailResendOTP,
  setIsFogotPassword,
  setProduct,
} = userReducer.actions;

export default userReducer.reducer;
