import { Box, IconButton, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useState } from "react";

import Toggle from "../../assets/toggle.svg";
import { orderDetailsAtom } from "../../context/atoms";
import type { Bill } from "../../types/Bill";

interface Props {
  bill: Bill;
  totalSavings: number | undefined;
}

const ToggleBill = (props: Props) => {
  const { bill, totalSavings } = props;
  const [isToggleOn, setIsToggleON] = useState(false);
  const orderDetails = useAtomValue(orderDetailsAtom);
  // const { data: item } = orderDetails;
  const handleToggle = () => {
    setIsToggleON(!isToggleOn);
  };

  const renderBills = () => {
    if (!isToggleOn) return <></>;
    return (
      <Box
        sx={{
          padding: "0rem 1rem 0.3rem 1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px",
              color: "#414141",
            }}
          >
            Item Total
          </Typography>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            ₹{bill.sub_total}
          </Typography>
        </Box>
        {!!totalSavings && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "12px",
                color: "#00855B",
                marginTop: "0.3rem",
              }}
            >
              Savings
            </Typography>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px",
                color: "#00855B",
                marginTop: "0.3rem",
              }}
            >
              - ₹{totalSavings}
            </Typography>
          </Box>
        )}

        {bill.reward_spent !== null && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "12px",
                marginTop: "0.3rem",
                color: "#00855B",
              }}
            >
              Rewards
            </Typography>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px",
                marginTop: "0.3rem",
                color: "#00855B",
              }}
            >
              -₹{bill.reward_spent}
            </Typography>
            {orderDetails.data?.coupon ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "12px",
                    color: "#00855b",
                    marginTop: "0.3rem",
                  }}
                >
                  Coupon Applied {orderDetails.data?.coupon.code}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "12px",
                    marginTop: "0.3rem",
                    color: "#00855b",
                  }}
                >
                  -₹{bill.discount}
                </Typography>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderPayment = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0rem 1rem 0.3rem 1rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "12px",
            color: "#414141",
          }}
        >
          TO PAY
        </Typography>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ₹{bill?.total}
        </Typography>
      </Box>
    );
  };
  const renderContent = () => {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "12px",
              padding: "0rem 0.3rem 0.3rem 1rem",
              marginTop: "0.3rem",
            }}
          >
            Bill ID: {bill.bill_id}
          </Typography>
          <IconButton onClick={handleToggle}>
            <Image src={Toggle} alt="Toggle" />
          </IconButton>
        </Box>

        {renderPayment()}
        {renderBills()}
      </Box>
    );
  };

  return renderContent();
};

export default ToggleBill;
