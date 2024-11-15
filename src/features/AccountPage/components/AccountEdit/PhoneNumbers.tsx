import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Typography,
  Input,
} from "@mui/material";
import React from "react";
import Edit from "../../assets/edit.svg";
import Image from "next/image";
interface Props {
  errors: any;
  variable: any;
  editField: any;
  onChangeVariable: any;
  handleEditClick: any;
  onSubmit: any;
  sxStyle: any;
  handleCancelClick: any;
}

const PhoneNumbers = (props: Props) => {
  const {
    errors,
    variable,
    editField,
    onChangeVariable,
    handleEditClick,
    onSubmit,
    sxStyle,
    handleCancelClick,
  } = props;
  return (
    <Box className="single-field">
      <InputLabel className="input-label" shrink htmlFor="phoneNumber">
        Phone Number
      </InputLabel>
      <Box className="input-button">
        <Input
          id="phoneNumber"
          className="input-field"
          value={variable.phone}
          onChange={onChangeVariable("phone")}
          disabled={editField !== "phone"}
        />
        {/* {editField !== "phone" && (
          <IconButton
            sx={{
              mr: "1rem",
            }}
            onClick={() => handleEditClick("phone")}
          >
            <Image src={Edit} alt="edit" />
          </IconButton>
        )} */}
      </Box>
      {errors.phone && (
        <Typography
          sx={{ fontFamily: "SofiaPro" }}
          color="red"
          variant="caption"
        >
          {errors.phone}
        </Typography>
      )}
      {editField === "phone" && (
        <Box sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "center" }}>
          <Button
            className="capitalize font-semibold"
            sx={sxStyle.updateButtonStyle}
            onClick={onSubmit("phone")}
          >
            Update
          </Button>
          <Button
            className="capitalize font-semibold"
            sx={sxStyle.cancelButtonStyle}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PhoneNumbers;
