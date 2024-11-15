import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import * as React from "react";

import { suggestionsList } from "../../context/atoms";

interface RenderListI {
  id: string;
  areaName: string;
  fullAreaName: string;
}

interface Props {
  handleSelect: (name: string, description: string) => () => void;
}

export default function GoogleLocationList(props: Props) {
  const { handleSelect } = props;
  const [suggestions] = useAtom(suggestionsList);

  const renderAreaList = (renderProps: RenderListI) => {
    const { id, areaName, fullAreaName } = renderProps;
    return (
      <Box
        key={id}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          borderRadius: "4px",
          padding: 1,
          svg: {
            flexShrink: 0,
            ".fill-svg": {
              fill: "#5A5A5A",
            },
          },
          "&:hover": {
            backgroundColor: "#00855B",
            span: {
              color: "#ffffff",
            },
            ".address": {
              color: "rgba(255, 255, 255, 0.80)",
            },
            ".fill-svg": {
              fill: "#ffffff",
            },
          },
        }}
        onClick={handleSelect(areaName, fullAreaName)}
      >
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path
            d="M11.999 6.56578C11.9911 7.72966 11.7289 8.72494 11.3103 9.6862C10.8323 10.7835 10.1808 11.7805 9.43369 12.7212C8.78187 13.5419 8.06476 14.306 7.29107 15.0197C7.06577 15.2275 6.83203 15.4274 6.597 15.6251C6.2716 15.8985 5.72987 15.8992 5.40267 15.6278C4.73754 15.076 4.11848 14.4786 3.53322 13.8473C2.92467 13.191 2.36066 12.5017 1.85681 11.7671C1.18246 10.784 0.627663 9.7443 0.292022 8.60301C0.0856705 7.90225 -0.0269778 7.18807 0.0055366 6.45974C0.0672372 5.07609 0.562122 3.85584 1.51221 2.81611C2.39266 1.85188 3.48381 1.22561 4.78516 0.979522C6.64129 0.628394 8.32718 1.01901 9.80031 2.17917C11.001 3.12478 11.6969 4.36018 11.9353 5.83894C11.9801 6.11632 12.0062 6.39692 11.9987 6.56553L11.999 6.56578ZM5.99689 9.58414C7.53531 9.61418 8.99206 8.38474 9.00819 6.68944C9.02355 5.09 7.65897 3.75601 6.03171 3.75502C4.34199 3.75403 2.97484 5.05846 2.98816 6.68671C3.00198 8.37133 4.44465 9.61095 5.99664 9.58438L5.99689 9.58414Z"
            className="fill-svg"
          />
        </svg>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "calc(100% - 20px)",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: "600",
              fontSize: "12px",
              fontFamily: "SofiaPro",
            }}
          >
            {areaName}
          </Typography>
          <Typography
            component="span"
            className="address"
            sx={{
              fontWeight: "400",
              fontSize: "10px",
              color: "#5A5A5A",
              fontFamily: "SofiaPro",
            }}
          >
            {fullAreaName}
          </Typography>
        </Box>
      </Box>
    );
  };
  const renderSuggestions = () => {
    if (suggestions.length <= 0)
      return (
        <Typography
          variant="subtitle2"
          sx={{
            display: "block",
            textAlign: "center",
            padding: "0 16px 20px",
            fontFamily: "SofiaPro",
          }}
        >
          No result found
        </Typography>
      );
    return (
      <Box
        className="suggestions-list"
        sx={{
          overflow: "auto",
          maxHeight: 120,
          padding: "0 8px 12px",
          fontFamily: "SofiaPro",
          position: "relative",
        }}
      >
        {suggestions.map((suggestion) =>
          renderAreaList({
            id: suggestion.place_id,
            areaName: suggestion.structured_formatting.main_text,
            fullAreaName: suggestion.description,
          })
        )}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        "*::-webkit-scrollbar": {
          width: "6px",
        },
        "*::-webkit-scrollbar-track": {
          background: "none",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(125, 120, 109, 0.7)",
          borderRadius: "10px 0px 0px 10px",
          position: "absolute",
          maxHeight: "45px",
          backgroundClip: "content-box",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          display: "block",
          textTransform: "uppercase",
          color: "rgba(0, 0, 0, 0.50)",
          padding: "12px 16px",
          fontWeight: "normal",
        }}
      >
        Search Result
      </Typography>
      {renderSuggestions()}
    </Box>
  );
}
