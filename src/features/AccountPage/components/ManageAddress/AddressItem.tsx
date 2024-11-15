import { Box, Button, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";

import Friends from "/public/assets/svg/familyTag.svg";
import Home from "/public/assets/svg/HouseTag.svg";
import Office from "/public/assets/svg/OfficeTag.svg";
import Other from "/public/assets/svg/OthersTag.svg";
import type { ServiceabilityPayload } from "../../../../layouts/Header/types/ServiceabilityPayload";

import Edit from "../../assets/edit.svg";
import { addressAtom, deletingAddressAtom } from "../../context/atoms";
import type Address from "../../types/Address";
import styles from "./style.module.css";
import {
  addressDetailsAtom,
  isAddressIsOpen,
  isEditingAddress,
} from "@/features/AddressEditDetails/context/atoms";
import { manageAddressScreens } from "../../enums/ActiveSidebar";

interface Props {
  address: Address;
  setActiveScreen: any;
}

function AddressItem(props: Props) {
  const { address, setActiveScreen } = props;
  const [addressList, setAddress] = useAtom(addressAtom);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const [, setAddressDetails] = useAtom(addressDetailsAtom);
  const [, setIsEditingAddress] = useAtom(isEditingAddress);
  const [deletingOrder, setDeletingOrder] = useAtom(deletingAddressAtom);

  const onDeleteAddress = async () => {
    setDeletingOrder({
      isActive: true,
      addressDetails: address,
    });
    // try {
    //   const res = await deleteAddress(address.address_id);
    //   setAddress((prevState: AddressAtom) => ({
    //     ...prevState,
    //     data: res,
    //   }));
    // } catch (e) {
    //   //
    // }
  };

  const saveAddressInLocalStorage = () => {
    const payload: ServiceabilityPayload = {
      formatted_address: address.address,
      latitude: address.latitude,
      longitude: address.longitude,
      name: address.address_name,
      address_id: address.address_id,
    };
    localStorage.setItem("address", JSON.stringify(payload));
  };

  const onEditAddress = () => {
    saveAddressInLocalStorage();
    setAddressDetails((prevState) => ({
      ...prevState,
      address_name: String(address.address_name || ""),
      door_no: String(address.door_no || ""),
      landmark: String(address.landmark || ""),
      locality: String(address.locality || ""),
      latitude: address.latitude,
      longitude: address.longitude,
      formatted_address: address.address || "",
      address: address.address,
      address_id: address.address_id,
    }));

    setIsEditingAddress({
      isActive: true,
      addressDetails: address,
    });
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
    // setIsAddressOpen(true);
  };

  const renderImages = () => {
    if (address.address_name === "Home") {
      return <Image width={30} src={Home} alt="Home" />;
    }
    if (address.address_name === "Office") {
      return <Image width={30} src={Office} alt="Home" />;
    }
    if (address.address_name === "Friends & Family") {
      return <Image width={30} src={Friends} alt="Home" />;
    }
    return <Image width={30} src={Other} alt="Home" />;
  };

  return (
    <Box
      component="li"
      className={`address-list-item ${styles["address-list-item"]}`}
    >
      <Box
        className={`address-list-item-header ${styles["address-list-item-header"]}`}
      >
        <Box
          sx={{
            border: "1px solid #F2EEE4",
            borderRadius: "6px",
            padding: "0.3rem 0.4rem",
          }}
        >
          {renderImages()}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "350px" }}>
          <Typography
            variant="body1"
            sx={{ fontFamily: "SofiaPro", fontWeight: 600 }}
            component="span"
          >
            {address.address_name}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: "rgba(0, 0, 0, 0.60)",
              fontWeight: 400,
              fontFamily: "SofiaPro",
            }}
          >
            {address.address}
          </Typography>
        </Box>
      </Box>
      <Box
        className={`address-list-item-body ${styles["address-list-item-body"]}`}
      >
        <Box
          className="button-group"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            button: {
              gap: 1,
              marginTop: 1,
              backgroundColor: "#F8F4E9",
              fontSize: 12,
              padding: "7px 12px",
              borderRadius: "20px",
              "&:hover": {
                color: "white",
                ".fill-green, .fill-red": {
                  fill: "white",
                },
              },
            },
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{
              fontFamily: "SofiaPro",
              fontWeight: 600,
              textTransform: "capitalize",
              fontSize: "12px",
              boxShadow: "none",
              color: "#00855B",
              "&:hover": {
                boxShadow: "none",
              },
              ".fill-green": {
                fill: "#00855B",
              },
            }}
            onClick={onEditAddress}
          >
            <Image src={Edit} alt="edit" />
            Edit
          </Button>
          {!address.is_default && (
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{
                fontFamily: "SofiaPro",
                fontWeight: 600,
                textTransform: "capitalize",
                fontSize: "12px",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                color: "#FF453A",
                ".fill-red": {
                  fill: "#FF453A",
                },
              }}
              onClick={onDeleteAddress}
            >
              <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                <path
                  d="M0.909241 11.2319C0.909241 12.2046 1.72745 13.0006 2.72742 13.0006H7.27288C8.27285 13.0006 9.09106 12.2046 9.09106 11.2319V3.71484H0.909241V11.2319ZM6.81833 5.92573C6.81833 5.70464 7.0456 5.48355 7.27288 5.48355C7.50015 5.48355 7.72742 5.70464 7.72742 5.92573V10.7897C7.72742 11.0108 7.50015 11.2319 7.27288 11.2319C7.0456 11.2319 6.81833 11.0108 6.81833 10.7897V5.92573ZM4.5456 5.92573C4.5456 5.70464 4.72738 5.48355 5.00015 5.48355C5.27292 5.48355 5.4547 5.70464 5.4547 5.92573V10.7897C5.4547 11.0108 5.27292 11.2319 5.00015 11.2319C4.72738 11.2319 4.5456 11.0108 4.5456 10.7897V5.92573ZM2.27288 5.92573C2.27288 5.70464 2.50015 5.48355 2.72742 5.48355C2.9547 5.48355 3.18197 5.70464 3.18197 5.92573V10.7897C3.18197 11.0108 2.9547 11.2319 2.72742 11.2319C2.50015 11.2319 2.27288 11.0108 2.27288 10.7897V5.92573Z"
                  className="fill-red"
                />
                <path
                  d="M9.16325 1.21121H6.65276V0.524881C6.65276 0.242292 6.40167 0 6.1088 0H3.89118C3.59831 0 3.34721 0.242282 3.34721 0.524881V1.21121H0.794935C0.334627 1.21121 0 1.57452 0 1.97825V2.01867C0 2.46283 0.376521 2.78571 0.794935 2.78571H9.20506C9.66537 2.78571 10 2.4224 10 2.01867V1.97825C10 1.57452 9.62348 1.21121 9.16317 1.21121H9.16325Z"
                  className="fill-red"
                />
              </svg>
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AddressItem;
