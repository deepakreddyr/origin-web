import { Box, Button } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import {
  addressDetailsAtom,
  goBackToAddressAtom,
  isAddressIsOpen,
  isEditingAddress,
} from "../../../AddressEditDetails/context/atoms";
import GoBack from "../../../AddressEditDetails/enums/GoBack";
import {
  activeAccountsPageAtom,
  addressActiveScreenAtom,
  addressAtom,
  deletingAddressAtom,
  isAccountIsOpen,
} from "../../context/atoms";
import ActiveSidebar, {
  ManageAddressScreenKeys,
  manageAddressScreens,
} from "../../enums/ActiveSidebar";
import { deleteAddress } from "../../services/deleteAddress";
import { getAddress } from "../../services/getAddress";
import styles from "../../style.module.css";
import type AddressAtom from "../../types/AddressAtom";
import DeleteConfirmation from "../DeleteConfirmation";
import AddressItem from "./AddressItem";
import NoData from "./NoData";
import Address from "@/features/AddressEditDetails";
import CheckServiceability from "@/features/AddressEditDetails/components/CheckServiceability";
import CompleteAddress from "@/features/AddressEditDetails/components/CompleteAddress";
import AddressList from "@/features/Address";
import { ReactNode } from "react";

type ScreenMapType = {
  [key in ManageAddressScreenKeys]: ReactNode;
};
const ManageAddress = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);
  const [, setIsAddressOpen] = useAtom(isAddressIsOpen);
  const [address, setAddress] = useAtom(addressAtom);
  const [, setGoBackAddress] = useAtom(goBackToAddressAtom);
  const [deletingAddressA, setDeletingAddress] = useAtom(deletingAddressAtom);
  const [isAddressOpen] = useAtom(isAddressIsOpen);
  const [activeScreen, setActiveScreen] = useAtom(addressActiveScreenAtom);
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [editingDetails, setIsEditingAddress] = useAtom(isEditingAddress);

  useEffect(() => {
    getAddress(setAddress);
    // if (!address.loading) {
    //   if (address?.data?.length === 0 || !address?.data) {
    //     // setActiveScreen(manageAddressScreens.NO_DATA);
    //   }
    // }
    // setGoBackAddress(GoBack.MANAGE_ADDRESS_PAGE);
  }, []);

  const onEditAddress = () => {
    // setIsAddressOpen(true);
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
  };

  const addNewAddressHandler = () => {
    setActiveScreen(manageAddressScreens.SERVICEABILITY);
    setAddressDetails({
      address_name: "",
      formatted_address: "",
      address: "",
      door_no: "",
      locality: "",
      landmark: "",
      latitude: 0,
      longitude: 0,
      deliverable: false,
      address_id: null,
    });
    setIsEditingAddress({
      ...editingDetails,
      isActive: false,
    });
  };

  // const onCancelDelete = () => {
  //   setDeletingAddress({
  //     isActive: false,
  //     addressDetails: null,
  //   });
  // };

  // const onDeleteAddress = async () => {
  //   if (
  //     deletingAddressA.isActive &&
  //     deletingAddressA.addressDetails?.address_id
  //   ) {
  //     try {
  //       const res = await deleteAddress(
  //         deletingAddressA.addressDetails?.address_id
  //       );
  //       setAddress((prevState: AddressAtom) => ({
  //         ...prevState,
  //         data: res,
  //       }));
  //       setDeletingAddress({
  //         isActive: false,
  //         addressDetails: null,
  //       });
  //     } catch (e) {
  //       //
  //     }
  //   }
  // };
  const addAdressCTA = () => {
    return (
      <Button
        variant="contained"
        color="success"
        sx={{
          // marginTop: "auto",
          backgroundColor: "#FFDD00",
          color: "black",
          fontFamily: "SofiaPro",
          fontSize: "16px",
          borderRadius: "100px",
          height: "48px",
          fontWeight: 600,
          textTransform: "capitalize",
          boxShadow: "none",
          ":hover": {
            backgroundColor: "#ffdd00a6",
            color: "black",
            boxShadow: "none",
          },
        }}
        onClick={addNewAddressHandler}
      >
        + New Address
      </Button>
    );
  };
  const renderContent = () => {
    if (deletingAddressA.isActive)
      return (
        <DeleteConfirmation
          text="Confirm Address Delete?"
          desc="Are you sure you want to delete this address?"
          setDeletingAddress={setDeletingAddress}
          deletingAddressA={deletingAddressA}
          setAddress={setAddress}
        />
      );
    return (
      <Box
        className={`weekly ${styles.weekly}`}
        sx={{ flexGrow: 1, paddingTop: "20px", paddingBottom: "20px" }}
      >
        {SCREEN_MAP[activeScreen]}
      </Box>
    );
  };

  const onBackHandler = () => {
    if (
      activeScreen === manageAddressScreens.SERVICEABILITY &&
      address?.data?.length === 0
    ) {
      setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
    }
    if (
      activeScreen === manageAddressScreens.ADDRESS_LIST ||
      activeScreen === manageAddressScreens.NO_DATA
    ) {
      setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
    }
    if (
      activeScreen === manageAddressScreens.SERVICEABILITY ||
      activeScreen === manageAddressScreens.COMPLETE_ADDRESS
    ) {
      setActiveScreen(manageAddressScreens.ADDRESS_LIST);
    }

    if (activeScreen === manageAddressScreens.MANUAL_ADDRESS) {
      setActiveScreen(manageAddressScreens.SERVICEABILITY);
    }
  };

  const SCREEN_MAP: ScreenMapType = {
    ADDRESS_LIST: (
      <Box component="ul" className={`weekly-list ${styles["weekly-list"]}`}>
        {address.data?.map((add) => (
          <AddressItem
            key={add.address_id}
            address={add}
            setActiveScreen={setActiveScreen}
          />
        ))}
      </Box>
    ),
    SERVICEABILITY: <CheckServiceability setActiveScreen={setActiveScreen} />,
    COMPLETE_ADDRESS: <CompleteAddress setActiveScreen={setActiveScreen} />,
    MANUAL_ADDRESS: <AddressList setActiveScreen={setActiveScreen} />,
    NO_DATA: (
      <>
        <NoData onEditAddress={onEditAddress} />
        {addAdressCTA()}
      </>
    ),
  };

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Manage Address"
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={() => {
        onBackHandler();
        // setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      {address?.data ? (
        renderContent()
      ) : (
        <>
          <NoData onEditAddress={onEditAddress} />
          {addAdressCTA()}
        </>
      )}
      {/* {isAddressOpen && <Address />} */}
      {activeScreen === manageAddressScreens.ADDRESS_LIST &&
        !deletingAddressA.isActive &&
        address?.data &&
        addAdressCTA()}
    </AccountSidebarLayout>
  );
};

export default ManageAddress;
