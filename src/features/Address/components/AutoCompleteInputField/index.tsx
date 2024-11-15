import { Box } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

import searchIcon from "../../../../assets/svg/search.svg";
import { searchAddress, suggestionsList } from "../../context/atoms";

const AutoCompleteInputField = () => {
  const [, setSearch] = useAtom(searchAddress);
  const [, setSuggestions] = useAtom(suggestionsList);

  const {
    value,
    suggestions: { data },
    setValue,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  React.useEffect(() => {
    if (data) {
      setSuggestions(data);
    }
  }, [data]);

  React.useEffect(() => {
    setSearch(value);
  }, []);

  const onChange = (event: any) => {
    const { value: inputValue } = event.target;
    setValue(inputValue);
    setSearch(inputValue);
  };

  return (
    <Box
      className="search-product"
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        alignItems: "center",
        gap: 2,
        maxWidth: 730,
        width: "100%",
      }}
    >
      <Box
        className="search-box"
        sx={{
          position: "relative",
          maxWidth: 580,
          width: "100%",
          input: {
            borderRadius: "48px",
            backgroundColor: "#F8F4E9",
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.04)",
            height: 46,
            border: 0,
            width: "100%",
            paddingLeft: "48px",
            fontSize: 14,
            fontWeight: "500",
            fontFamily: "SofiaPro",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
          },
        }}
      >
        <Box
          component="figure"
          sx={{
            position: "absolute",
            left: "16px",
            transform: "translateY(-50%)",
            top: "55%",
            margin: 0,
            display: "block",
            width: "20px",
            height: "20px",
          }}
        >
          <Image src={searchIcon} alt="" />
        </Box>
        <input
          value={value}
          onChange={onChange}
          placeholder="Location Search"
          required={false}
          className="font-[SofiaPro]  "
        />
      </Box>
    </Box>
  );
};

export default AutoCompleteInputField;
