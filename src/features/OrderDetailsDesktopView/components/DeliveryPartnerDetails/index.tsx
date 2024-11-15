import { Box, Typography } from "@mui/material";
// import { useAtomValue } from 'jotai';
import Image from "next/image";
import React from "react";

import Call from "../../assets/call.svg";
// import { orderDetailsAtom } from '../../context/atoms';
import styles from "./styles.module.css";

const DeliveryPartnerDetails = () => {
  //   const orderDetails = useAtomValue(orderDetailsAtom);

  return (
    <Box className={styles["delivery-partner-container"]}>
      <Typography className={styles["delivery-partner-heading"]}>
        Your Delivery Partner
      </Typography>
      <Box className={styles["delivery-partner-details-container"]}>
        <Box className={styles["delivery-partner-details"]}>
          <Box className={styles["delivery-partner-image"]}>
            <Image src={Call} alt="watch" className={styles["call-img"]} />
          </Box>
          <Box>
            <Typography className={styles["delivery-partner-name"]}>
              Prabakaran
            </Typography>
            <Typography className={styles["delivery-partner-text"]}>
              Speaks Tamil & English
            </Typography>
          </Box>
        </Box>

        <Box className={styles["call-container"]}>
          <button className={styles["call-button"]}>
            <Image src={Call} alt="watch" className={styles["call-img"]} />
            Call
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryPartnerDetails;
