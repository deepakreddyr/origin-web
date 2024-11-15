import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { OtpInput } from "./OtpInput";
import ResendOTP from "./ResendButton";
import TermsAndConditions from "../TermsAndConditions";
import PrimaryRoundedCta from "@/components/shared/PrimaryRoundedCta";
import { mainApiUrl } from "@/url";
import { request, header } from "@/utilities/request";
import { TabTypeConstant } from "../constants/tabTypeContent";
import type { LoginAtom } from "../types/LoginAtom";
import { useAtom } from "jotai";
import { profileAtom } from "@/features/AccountPage/context/atoms";

interface Props {
  mobileNumber: any;
  setLoginDetails: any;
  otpErrors: any;
  setOtpErrors: any;
  setTabType: any;
}

const VerifyOTP = (props: Props) => {
  const { mobileNumber, setLoginDetails, otpErrors, setOtpErrors, setTabType } =
    props;
  const [otp, setOtp] = useState("");
  const [profile, setProfileAtom] = useAtom(profileAtom);

  //   const onSubmitOTP = async () => {
  //     if (!otp) {
  //       setOtpErrors("Incorrect OTP");
  //       return;
  //     }
  //     setOtpErrors("");
  //   };

  const onSubmitOTP = async () => {
    if (!otp) {
      setOtpErrors("Incorrect OTP");
      return;
    }
    setOtpErrors("");

    try {
      const formData = new FormData();
      const requestURL = mainApiUrl.verifyOtp;
      formData.append("grant_type", "password");
      formData.append("username", `+91${mobileNumber}`);
      formData.append("password", otp);
      formData.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID || "");
      formData.append(
        "client_secret",
        process.env.NEXT_PUBLIC_CLIENT_SECRET || ""
      );
      formData.append("scope", "*");

      const response: any = await request(requestURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      localStorage.setItem("user_token", response.access_token);

      const requestURLProfile = mainApiUrl.getProfileDetails;

      const profileResponse: any = await request(requestURLProfile, {
        method: "GET",
        headers: {
          Authorization: header(),
          Accept: "application/json",
        },
      });
      setProfileAtom({
        ...profile,
        data: profileResponse.data,
      });
      if (!profileResponse.data.name) {
        setTabType(TabTypeConstant.REGISTER);
        setLoginDetails((prevDetails: LoginAtom) => ({
          ...prevDetails,
          user: response.access_token,
        }));
      } else {
        setLoginDetails((prevDetails: LoginAtom) => ({
          ...prevDetails,
          isLoginSidebarOpen: false,
          isLogin: true,
          user: response.access_token,
        }));
      }
    } catch (error: any) {
      const e = await error.response.json();
      setOtpErrors(e.message);
    }
  };

  const onSubmitMobileNumber = async () => {
    // if (!isMobileNumberValid(mobileNumber)) {
    //   setMobileNumberErrors("Incorrect mobile number");
    //   return;
    // }
    // try {
    //   setOtpErrors("");
    //   const formData = new FormData();
    //   const requestURL = `/api/v1/auth/otp`;
    //   formData.append("phone", mobileNumber);
    //   formData.append("scope", "client");
    //   // await request(requestURL, {
    //   //   method: "POST",
    //   //   headers: {
    //   //     Accept: "application/json",
    //   //   },
    //   //   body: formData,
    //   // });
    //   setTabType(TabTypeConstant.ENTER_OTP);
    //   setMobileNumberErrors("");
    // } catch (error) {
    //   setMobileNumberErrors("Unable to login please try later");
    // }
  };

  return (
    <Box
      className="render-otp-screen"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            position: "relative",
            display: "flex",
            transform: "initial",
            fontSize: 16,
            fontWeight: "400",
            color: "#000",
            fontFamily: "SofiaPro",
          }}
        >
          Enter OTP
        </Typography>
        <Typography
          sx={{
            position: "relative",
            display: "flex",
            transform: "initial",
            fontSize: 16,
            fontWeight: "400",
            color: "#000",
            fontFamily: "SofiaPro",
          }}
        >
          {`Sent to +91 ${mobileNumber}`}
        </Typography>
      </Box>
      <Box>
        <OtpInput
          otp={otp}
          setOtp={(value: string) => {
            setOtpErrors("");
            setOtp(value);
          }}
          onEnter={() => {
            onSubmitOTP();
          }}
          error={otpErrors}
          hasErrored={!!otpErrors}
        />
        <Typography
          variant="body2"
          sx={{
            color: "#C70000",
            fontWeight: "normal",
            display: "block",
            fontSize: "12px",
            fontFamily: "SofiaPro",
          }}
        >
          {otpErrors}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ResendOTP
          onResend={() => {
            setOtp("");
            onSubmitMobileNumber();
          }}
        />
      </Box>
      <button
        style={{ width: "100%", marginTop: "1rem" }}
        onClick={() => {
          if (otp.length < 4) {
            setOtpErrors("Enter valid OTP");
          }
        }}
      >
        <div className={"mt-[24px]"}>
          <PrimaryRoundedCta
            style=""
            name="Confirm"
            handler={onSubmitOTP}
            isDisabled={otp.length !== 4}
          />
        </div>
        <TermsAndConditions setLoginDetails={setLoginDetails} />
      </button>
    </Box>
  );
};

export default VerifyOTP;
