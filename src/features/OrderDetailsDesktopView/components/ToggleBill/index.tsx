import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import Toggle from "../../assets/toggle.svg";
import type { Bill } from "../../types/Bill";

interface Props {
  bill: Bill;
  totalSavings: number | undefined;
}

const ToggleBill = (props: Props) => {
  const { bill, totalSavings } = props;
  const [isToggleOn, setIsToggleON] = useState(false);
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
            Market Price
          </Typography>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "12px",
            }}
          >
            ₹ {bill.sub_total}
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
              }}
            >
              Savings
            </Typography>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "12px",
                color: "#00855B",
              }}
            >
              - ₹ {totalSavings}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* <Typography
            sx={{
              fontWeight: '500',
              fontSize: '12px',
              color: '#D25337',
            }}
          >
            Coupon Applied “SAVEIT”
          </Typography> */}
          {/* <Typography
            sx={{
              fontWeight: '600',
              fontSize: '12px',
              color: '#D25337',
            }}
          >
            -₹ {bill.discount}
          </Typography> */}
        </Box>
      </Box>
    );
  };

  const renderPayment = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0rem 1rem 1rem 1rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "12px",
            color: "#414141",
          }}
        >
          TO BE PAID (COD)
        </Typography>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ₹ {bill?.total}
        </Typography>
      </Box>
    );
  };
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
          }}
        >
          OderID: {bill.bill_id}
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

export default ToggleBill;
