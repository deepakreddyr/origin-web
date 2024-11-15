import { Box, Typography } from "@mui/material";

const CancellationPolicy = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        width: "100%",
        margin: " 0.8rem 0.3rem 0.3rem 0.6rem",
      }}
    >
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        Cancellation policy
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: "400",
          color: "rgba(0, 0, 0, 0.6)",
          marginTop: "0.5rem",
        }}
      >
        Orders cannot be cancelled and are non refundable once packed for
        delivery.
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: "400",
          color: "rgba(0, 0, 0, 0.6)",
          marginTop: "0.5rem",
        }}
      >
        Review your order before making a payment to avoid cancellation.
      </Typography>
    </Box>
  );
};

export default CancellationPolicy;
