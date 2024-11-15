import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import Coins from "/public/assets/svg/coins.svg";
import { transactionListAtom } from "../../context/atoms";

const All = () => {
  const [transactions] = useAtom(transactionListAtom);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const currentDate = new Date();

    const dayOptions: Intl.DateTimeFormatOptions = { day: "numeric" };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const isToday = date.toDateString() === currentDate.toDateString();
    const isTomorrow =
      new Date(date.getTime() + 24 * 60 * 60 * 1000).toDateString() ===
      currentDate.toDateString();

    let formattedDate = "";
    if (isToday) {
      formattedDate = "Today";
    } else if (isTomorrow) {
      formattedDate = "Tomorrow";
    } else {
      formattedDate = date.toLocaleDateString(undefined, dayOptions);
    }

    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <Box
      className="all-rewards"
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box
        component="ul"
        className="rewards-list"
        sx={{
          listStyleType: "none",
          padding: 0,
          marginTop: 1,
          marginBottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {transactions?.data?.map((transaction: any) => (
          <Box
            key={transaction.id}
            component="li"
            className="rewards-list-item"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              paddingTop: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.07)",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                <Typography variant="body1" component="span">
                  {transaction.transaction_message}
                </Typography>
                {/* <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontFamily: 'Roboto Mono' }}
                >
                  ₹1002
                </Typography> */}
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {transaction.transaction_type === "minus" ? (
                  <Typography component="span" sx={{ fontWeight: 400 }}>
                    -{transaction.reward_amount}
                  </Typography>
                ) : (
                  <Typography component="span" sx={{ fontWeight: 400 }}>
                    +{transaction.reward_amount}
                  </Typography>
                )}

                <Image src={Coins} alt="coin" />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography
                component="time"
                variant="body2"
                sx={{ color: "rgba(0, 0, 0, 0.60)", fontWeight: 400 }}
              >
                {formatDate(transaction.created_at)}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.60)",
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                }}
              />
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "rgba(0, 0, 0, 0.60)", fontWeight: 400 }}
              >
                ID {transaction.order_id}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            height: 32,
            background:
              "linear-gradient(180deg, rgba(255, 246, 222, 0.37) 0%, rgba(255, 246, 222, 0.95) 100%)",
          }}
        />
        {/* <Box sx={{ backgroundColor: '#FFF6DE', display: 'flex' }}>
          <Button
            sx={{
              fontSize: 14,
              fontWeight: 500,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Load more
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
};

export default All;
