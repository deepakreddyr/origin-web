import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useAtom } from "jotai";
import * as React from "react";

import { dropdownTop } from "../../constants/dropdownTop";
import { activeDropdownTop } from "../../context/atoms";
import type { ServiceabilityPayload } from "../../types/ServiceabilityPayload";
import DetectLocation from "../DetectLocation";
import DropdownBottomSection from "../DropdownBottomSection";
import GoogleLocationList from "../GoogleLocationList";
import ServiceabilityDropDown from "../ServiceabilityDropDown";

interface Props {
  triggerServiceability: (payload: ServiceabilityPayload) => void;
  handleSelect: (name: string, description: string) => () => void;
}
export default function AreaLocation(props: Props) {
  const { handleSelect, triggerServiceability } = props;
  const [activeDropdown] = useAtom(activeDropdownTop);

  const renderDropdownUpperHalf = () => {
    switch (activeDropdown) {
      case dropdownTop.AREA_LIST: {
        return <GoogleLocationList handleSelect={handleSelect} />;
      }
      case dropdownTop.SERVICEABILITY: {
        return <ServiceabilityDropDown />;
      }
      case dropdownTop.DETECT_LOCATION: {
        return <DetectLocation triggerServiceability={triggerServiceability} />;
      }
      default: {
        return <GoogleLocationList handleSelect={handleSelect} />;
      }
    }
  };

  return (
    <Paper
      sx={{
        zIndex: "10",
        backgroundColor: "#F9F0DA",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        width: "100%",
        marginTop: "4px",
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.13)",
        border: "1px solid rgba(0, 0, 0, 0.07)",
      }}
    >
      <Box className="detect-location">{renderDropdownUpperHalf()}</Box>
      <DropdownBottomSection handleSelect={handleSelect} />
    </Paper>
  );
}
