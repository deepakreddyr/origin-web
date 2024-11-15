import { Box, Button, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";

import type { AppliedCoupon } from "../../../CouponPage/context/atoms";
import {
  isCouponApplied,
  isCouponPageIsOpen,
} from "../../../CouponPage/context/atoms";
import Arrow from "../../assets/arrowCoupon.svg";
import Coupon from "../../assets/coupon.svg";
import useCartCalculation from "../../hooks/useCartCalculation";
import styles from "./style.module.css";

const CouponSection = () => {
  const [isCouponPageOpen, setIsCouponPageOpen] = useAtom(isCouponPageIsOpen);
  const [appliedCoupon, setAppliedCoupon] = useAtom(isCouponApplied);
  const { couponDiscount, getCouponDetails } = useCartCalculation();

  if (appliedCoupon.isApplied) {
    return (
      <Box className={`coupon-section ${styles["coupon-applied-container"]}`}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Box
            component="figure"
            sx={{
              flexShrink: 0,
              margin: 0,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={Coupon} alt="coupon" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography className={styles.title}>
              {`'${getCouponDetails()?.code}' applied!`}
            </Typography>

            <Typography className={styles.description} variant="body2">
              {`You save ${couponDiscount} on this order.`}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="text"
          className={styles["remove-button"]}
          onClick={() => {
            setAppliedCoupon((prevState: AppliedCoupon) => ({
              ...prevState,
              coupon: null,
              isApplied: false,
            }));
          }}
        >
          <Typography>REMOVE</Typography>
        </Button>
      </Box>
    );
  }
  const renderCoupon = () => {
    return (
      <Box
        className={`coupon-section ${styles["coupon-container"]}`}
        onClick={() => {
          setIsCouponPageOpen(!isCouponPageOpen);
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Box
            component="figure"
            sx={{
              flexShrink: 0,
              margin: 0,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={Coupon} alt="coupon" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" component="span">
              View Coupons & Offers
            </Typography>
            <Typography
              sx={{
                color: "#D78204",
                fontWeight: "normal",
                fontFamily: "Roboto Mono, monospace",
              }}
              variant="body2"
              component="span"
            >
              {/* Save ₹250 on this order by using “WELCOME YOU” */}
            </Typography>
          </Box>
        </Box>
        <Image className={styles["arrow-img"]} src={Arrow} alt="coupon" />
      </Box>
    );
  };
  return (
    <Box
      className="delivery-instruction"
      sx={{
        backgroundColor: "rgba(242, 238, 228, 0.3)",
        display: "flex",
        flexDirection: "column",
        border: "2px solid #F2EEE4",
        padding: "1rem",

        margin: " 0.8rem 0.3rem 0.3rem 0.3rem",

        borderRadius: "16px",
      }}
    >
      <Typography component="h3" variant="body1" sx={{ fontWeight: 600 }}>
        Save with Coupons
      </Typography>
      {renderCoupon()}
    </Box>
  );
};

export default CouponSection;
