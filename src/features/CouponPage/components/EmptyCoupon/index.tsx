import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

import EmptyCoupon from "../../assets/no-coupon.svg";
import styles from "./style.module.css";

export default function EmptyCart() {
  return (
    <Box className={styles["empty-container"]}>
      <Image src={EmptyCoupon} alt="empty" />
      <Box className={styles.container}>
        <Typography className={styles["cart-heading"]}>No Coupons</Typography>
        <Typography className={styles["cart-details"]}>
          There are no available coupons for you.
        </Typography>
      </Box>
    </Box>
  );
}
