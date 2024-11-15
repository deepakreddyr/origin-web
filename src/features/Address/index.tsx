import { Box } from "@mui/material";
import React from "react";
import AutoCompleteAddress from "./components/AutoCompleteAddress";
import AutoCompleteInputField from "./components/AutoCompleteInputField";
import SavedAddressList from "./components/SavedAddressList";

interface Props {
  setActiveScreen: any;
}

const AddressList = (props: Props) => {
  //kept on intention
  // React.useEffect(() => {
  //   getAddress(setAddressAtom);
  // }, []);

  return (
    <Box
      className="body-inner"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <AutoCompleteInputField />
      {/* <SavedAddressList /> */}
      <AutoCompleteAddress />
    </Box>
  );
};

export default AddressList;
