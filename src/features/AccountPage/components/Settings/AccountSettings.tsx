import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import RightArrow from "/public/assets/svg/arrow-right.svg";
import Logout from "/public/assets/svg/logout.svg";
import { deleteAccount } from "../../../AddressEditDetails/services/deleteAccount";
import RemoveAccount from "./RemoveAccount";
import { useAtom } from "jotai";
import { login } from "@/components/Login/context/atom";
import { LoginAtom } from "@/components/Login/types/LoginAtom";
import { TabTypeConstant } from "@/components/Login/constants/tabTypeContent";

const AccountSettings = ({
  deleteState,
  setIsOpen,
}: {
  deleteState: any;
  setIsOpen: any;
}) => {
  const [isDeleting, setIsDeleting] = deleteState;
  const [loginDetails, setLoginDetails] = useAtom(login);
  const router = useRouter();
  const onDeleteAccount = async () => {
    try {
      // await deleteAccount();
      localStorage.clear();
      router.push("/");
      router.reload();
    } catch (e) {
      //
    }
  };

  const onCancelDelete = () => {
    setIsDeleting(false);
  };

  if (isDeleting) {
    return (
      <RemoveAccount onDelete={onDeleteAccount} onCancel={onCancelDelete} />
    );
  }

  return (
    <Box
      className="settings-wrapper"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <Box
        className="account-related"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          className="account-related-list"
          component="ul"
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 0,
            padding: 0,
            gap: 1,
          }}
        >
          <Box
            onClick={() => {
              router.push("/terms-and-conditions");
              setIsOpen(false);
            }}
            className="account-related-list-item"
            component="li"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "16px",
              backgroundColor: "#F8F4E9",
              padding: "23px 20px",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontFamily: "SofiaPro",
                fontWeight: 600,
              }}
            >
              Terms & Policies
            </Typography>
            <Image src={RightArrow} alt="RightArrow" />
          </Box>
          <Box
            onClick={() => {
              setIsOpen(false);
              setLoginDetails((prevDetails: LoginAtom) => ({
                ...prevDetails,
                isLogin: false,
                user: null,
                tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
              }));
              localStorage.clear();
            }}
            className="account-related-list-item"
            component="li"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "16px",
              backgroundColor: "#F8F4E9",
              padding: "23px 20px",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontFamily: "SofiaPro",
                fontWeight: 600,
                color: "#C70000",
              }}
            >
              Logout
            </Typography>
            <Image src={Logout} alt="Logout" />
          </Box>
        </Box>
      </Box>
      <Box
        className="delete-account"
        sx={{
          borderTop: "#EAE5CF 1px solid",
          paddingTop: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
        onClick={() => {
          setIsDeleting(true);
        }}
      >
        <Typography
          variant="body2"
          component="span"
          sx={{
            fontFamily: "SofiaPro",
            fontWeight: 600,
            color: "#C70000",
            borderRadius: "14px",
            backgroundColor: "#F8F4E9",
            padding: "23px 20px",

            fontSize: "14px",

            display: "block",
            cursor: "pointer",
          }}
        >
          Delete my Account
        </Typography>
        <Typography
          variant="body2"
          component="span"
          sx={{
            color: "rgba(0, 0, 0, 0.50)",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "SofiaPro",
          }}
        >
          Deleting your account will remove all your orders & other data from
          your account.
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountSettings;
