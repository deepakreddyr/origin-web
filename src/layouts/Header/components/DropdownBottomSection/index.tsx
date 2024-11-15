import { Box, Typography } from "@mui/material";
import * as React from "react";

import locations from "../../data/location.json";

interface Props {
  handleSelect: (name: string, description: string) => () => void;
}
interface LocationI {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  place_id: string;
  formatted_address: string;
}

export default function DropdownBottomSection(props: Props) {
  const { handleSelect } = props;
  const renderAreaName = (location: LocationI) => {
    return (
      <Box
        key={location.place_id}
        component="li"
        sx={{
          border: "1px solid #00855b",
          display: "flex",
          cursor: "pointer",
          borderRadius: 1,
          padding: "6px 12px",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#00855b",
          },
        }}
        onClick={() => handleSelect(location.name, location.formatted_address)}
      >
        <Typography
          variant="body2"
          sx={{
            display: "block",
            fontWeight: "normal",
          }}
        >
          {location.name}
        </Typography>
      </Box>
    );
  };
  const renderLocationNames = () => {
    return (
      <Box
        component="ul"
        sx={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {(locations[0].areas as LocationI[]).map(renderAreaName)}
      </Box>
    );
  };
  return (
    <Box
      className="location-suggestion"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.50)",
      }}
    >
      <Box
        className="location-suggestion_list"
        sx={{
          padding: "20px 16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Typography sx={{ fontWeight: "500", fontSize: 12 }}>
          We are currently delivering to major areas in Bengaluru
        </Typography>
        {renderLocationNames()}
      </Box>
      <Box
        className="location-suggestion_thanks"
        sx={{
          padding: "12px 16px 20px",
          borderTop: "1px solid rgba(0, 0, 0, 0.07)",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: 12,
            color: "#5A5A5A",
            maxWidth: 340,
            width: "100%",
          }}
        >
          Over whelming response from {""}
          <span style={{ fontWeight: "600", color: "#000" }}>
            Nama Bengaluru! 🙌
          </span>
          {""}
          We are expanding our presence to all major areas...
        </Typography>
      </Box>
    </Box>
  );
}
