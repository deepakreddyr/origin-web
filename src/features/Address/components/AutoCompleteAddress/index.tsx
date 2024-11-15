import { LocationCity } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";

import type { ServiceabilityPayload } from "../../../../layouts/Header/types/ServiceabilityPayload";
import {
  addressDetailsAtom,
  goBackToAddressAtom,
  isAddressIsOpen,
  saveAddressAtom,
} from "../../../AddressEditDetails/context/atoms";
import GoBack from "../../../AddressEditDetails/enums/GoBack";
import {
  isAddressListIsOpen,
  searchAddress,
  suggestionsList,
} from "../../context/atoms";
import styles from "./style.module.css";
import { addressActiveScreenAtom } from "@/features/AccountPage/context/atoms";
import { manageAddressScreens } from "@/features/AccountPage/enums/ActiveSidebar";

const AutoCompleteAddress = () => {
  const [, setIsOpen] = useAtom(isAddressListIsOpen);
  const [, setEditAddressOpen] = useAtom(isAddressIsOpen);
  const [, setGoBackAddress] = useAtom(goBackToAddressAtom);
  const [suggestions] = useAtom(suggestionsList);
  const [, setAddressDetails] = useAtom(addressDetailsAtom);
  const [, setAddressAtom] = useAtom(saveAddressAtom);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);

  const [search] = useAtom(searchAddress);

  const triggerServiceability = (payload: ServiceabilityPayload) => {
    localStorage.setItem("address", JSON.stringify(payload));
    setAddressDetails((prevState: any) => ({
      ...prevState,
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      address: payload.formatted_address,
    }));
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
    // setIsOpen(false);
    // Reset Edit Address
    // setEditAddressOpen(true);
    // setGoBackAddress(GoBack.ADDRESS_LIST_SIDEBAR);
    // setAddressAtom((prevState: any) => ({
    //   ...prevState,
    //   isSaved: false,
    // }));
  };

  const onClick =
    (addressItem: google.maps.places.AutocompletePrediction) => async () => {
      try {
        getGeocode({ address: addressItem.description }).then(
          (results: any) => {
            const { lat, lng } = getLatLng(results[0]);
            triggerServiceability({
              latitude: lat,
              longitude: lng,
              name: addressItem.structured_formatting.main_text,
              formatted_address: addressItem.description,
              address_id: "",
            });
          }
        );
      } catch (e) {
        //
      }
    };

  const renderAddressItem = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    return (
      <>
        <Box
          key={suggestion.description}
          sx={{
            padding: "0.5rem",
            margin: "0.5rem",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "flex-start",
          }}
          onClick={onClick(suggestion)}
        >
          <Box
            sx={{
              border: "2px solid #EAE5CF ",
              borderRadius: "6px",
              padding: "0.8rem",
            }}
          >
            <LocationCity />
          </Box>
          <Box
            sx={{
              marginLeft: " 0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.3rem",
              }}
            >
              <Typography sx={{ fontFamily: "SofiaPro" }} variant="body1">
                {suggestion.structured_formatting.main_text}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                color: "#7D786D",
                fontFamily: "SofiaPro",
              }}
            >
              {suggestion.description}
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{
            color: "#EAE5CF",
          }}
        />
      </>
    );
  };

  const renderAddressItems = () => {
    return suggestions.map(renderAddressItem);
  };

  if (suggestions.length > 0 && search.length !== 0)
    return (
      <Box className={styles["address-list-container"]}>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Typography className={styles.heading}>Search Result</Typography>
        </Box>
        {renderAddressItems()}
      </Box>
    );

  return <></>;
};

export default AutoCompleteAddress;
