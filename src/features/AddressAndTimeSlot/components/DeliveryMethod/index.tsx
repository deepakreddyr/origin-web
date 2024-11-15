import { Box, Paper, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";

import { cartAtom } from "../../../CartPage/context/atoms";
import styles from "./style.module.css";

const DeliveryMethod = () => {
  const [cartAPIInfo] = useAtom(cartAtom);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const renderTimeSlotSelector = () => {
    const handleSlotClick = (slot: any) => {
      setSelectedSlot(slot);
    };

    return (
      <Box className={styles.timeslot}>
        {cartAPIInfo.cart?.timeslot?.map((slot: any) => (
          <Paper
            key={slot.id}
            elevation={selectedSlot === slot ? 3 : 1}
            onClick={() => handleSlotClick(slot)}
            className={`slot ${
              selectedSlot === slot ? styles.selected : styles.notSelected
            }`}
          >
            <Typography>
              {slot.from} - {slot.to}
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  const deliveryDate = cartAPIInfo.cart?.delivery_date || 0; // Ensure a default value if delivery_date is not available
  const formattedDeliveryDate = new Date(
    deliveryDate * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box className={styles["delivering-method"]}>
      <Typography
        variant="body2"
        component="h5"
        sx={{ fontWeight: 700, textTransform: "uppercase" }}
      >
        Selected Time slot
      </Typography>
      {selectedSlot ? (
        <Typography className={styles.date}>{formattedDeliveryDate}</Typography>
      ) : (
        <Typography>Please select a time slot</Typography>
      )}
      {renderTimeSlotSelector()}
    </Box>
  );
};

export default DeliveryMethod;
