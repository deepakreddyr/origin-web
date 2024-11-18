import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

interface Props {
  selectedText: string[];
  handleMessageChange: (selectedString: string) => void;
  handleSelectedTextChange: (value: string) => void;
  message: string;
}

const RatingSad = (props: Props) => {
  const {
    selectedText,
    handleMessageChange,
    handleSelectedTextChange,
    message,
  } = props;

  const list = [
    {
      name: "Late Delivery",
    },
    {
      name: "Took Longer Route",
    },
    {
      name: "Bad Service",
    },
    {
      name: "Called multiple Times",
    },
    {
      name: "Delivery person was Rude",
    },
  ];
  return (
    <Box
      className="rating-happy-content"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        component="ul"
        className="pick-list"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          margin: 0,
          padding: "12px",
          listStyleType: "none",
          backgroundColor: "#F2EAD4",
          borderRadius: "0 16px 16px",
        }}
      >
        {list.map((item, i) => {
          const isSelected = selectedText.includes(item.name);

          return (
            <Box
              component="li"
              key={`${item}-${i}`}
              className="pick-list-item"
              onClick={() => {
                handleSelectedTextChange(item.name);
              }}
              sx={{
                padding: 1,
                cursor: "pointer",
                backgroundColor: "#E7E1CB",
                border: "#E7E1CB 1px solid",
                borderRadius: "6px",
                borderColor: isSelected ? "#00855B" : "none",
              }}
            >
              <Typography sx={{ fontWeight: 400, color: "#00855B" }}>
                {item.name}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box
        className="submit-feedback"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginTop: "auto",
          position: "sticky",
          bottom: 0,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            component="span"
            variant="h6"
            sx={{ textAlign: "center", display: "block" }}
          >
            Write a few lines about your experience
          </Typography>
          <TextField
            value={message}
            onChange={(event) => handleMessageChange(event.target.value)}
            placeholder="MultiLine with rows: 2 and rowsMax: 4"
            multiline
            rows={2}
            sx={{
              borderRadius: "10px",
              border: "1px solid rgba(0, 0, 0, 0.10)",
              boxShadow: "none",
              width: "100%",
              "&:focus": {
                borderWidth: "1px",
                boxShadow: "none",
              },
            }}
          />
          <Typography
            component="small"
            variant="body2"
            sx={{
              textAlign: "center",
              display: "block",
              color: "rgba(0, 0, 0, 0.50)",
              fontWeight: 400,
            }}
          >
            This feedback will give us a chance serve you better.
          </Typography>
        </Box>
        <Box
          className="facing-issus"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 400 }}>
            Facing a issue?
          </Typography>
          <Button variant="outlined" color="success">
            Chat with Us
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RatingSad;
