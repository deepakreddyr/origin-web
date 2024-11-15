import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
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

export default function MajorAreaLocation(props: Props) {
  const { handleSelect } = props;

  const renderLocationName = (location: LocationI) => {
    return (
      <Typography
        key={location.place_id}
        component="li"
        sx={{
          border: "1px solid #00855b",
          display: "flex",
          cursor: "pointer",
          borderRadius: 1,
          padding: "6px 12px",
          color: "#F9F0DA",
          "&:hover": {
            backgroundColor: "#00855b",
            color: "#fff",
          },
        }}
        onClick={handleSelect(location.name, location.formatted_address)}
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
      </Typography>
    );
  };

  const renderLocationNames = () => {
    return (
      <Box
        component="ul"
        sx={{
          margin: 0,
          padding: 0,
          listStyleType: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {(locations[0].areas as LocationI[]).map(renderLocationName)}
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        width: "100%",
        marginTop: "1rem",
        borderRadius: "6px",
        svg: {
          position: "absolute",
          left: "12px",
          top: "-8px",
        },
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M12.1064 19.1275C10.943 20.2908 9.05696 20.2908 7.89365 19.1275L0.872479 12.1063C-0.290826 10.943 -0.290826 9.05695 0.87248 7.89365L7.89365 0.872477C9.05696 -0.290828 10.943 -0.290828 12.1064 0.872478L19.1275 7.89365C20.2908 9.05696 20.2908 10.943 19.1275 12.1064L12.1064 19.1275Z"
          fill="black"
        />
      </svg>

      <Box
        className="location-suggestion_list"
        sx={{
          padding: "20px 16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "12px",
            color: "#fff",
          }}
        >
          We are currently delivering to major areas in Bengaluru
        </Typography>
        {renderLocationNames()}
      </Box>
      <Box
        className="location-suggestion_thanks"
        sx={{
          padding: "12px 16px 20px",
          borderTop: "rgba(255, 255, 255, 0.20) 1px solid",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: 12,
            color: "#b1b1b1",
            maxWidth: 340,
            width: "100%",
          }}
        >
          Over whelming response from {""}
          <span style={{ fontWeight: "600", color: "#f1f1f1" }}>
            Nama Bengaluru! 🙌
          </span>
          {""}
          We are expanding our presence to all major areas...
        </Typography>
      </Box>
    </Paper>
  );
}
