import React from "react";
import {
  Radio,
  FormControlLabel,
  RadioProps,
  FormControlLabelProps,
} from "@mui/material";

interface OriginRadioProps extends RadioProps {
  label: string;
  formControlLabelProps?: Omit<FormControlLabelProps, "control" | "label">;
}

const OriginRadio: React.FC<OriginRadioProps> = ({
  label,
  formControlLabelProps,
  ...radioProps
}) => {
  return (
    <FormControlLabel
      {...formControlLabelProps}
      control={
        <Radio
          className="p-0 ms-2.5"
          {...radioProps}
          name="hi"
          sx={{
            svg: {
              width: "26px",
              height: "26px",
            },
            "&.Mui-checked": {
              color: "black",
            },
          }}
        />
      }
      label={label}
    />
  );
};

export default OriginRadio;
