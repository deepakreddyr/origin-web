import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import { MarkerF } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { addressDetailsAtom } from "../../context/atoms";
import { checkServiceabilityAddress } from "../../services/checkServiceability";

interface Location {
  lat: number;
  lng: number;
}

const containerStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "14px",
};

const AddressMapContainer = () => {
  const [addressDetails, setAddressDetails] = useAtom(addressDetailsAtom);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const googleControlOptions: google.maps.MapOptions = {
    zoomControl: false,
    scaleControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY as string,
  });
  // const handleMapLoad = (mapInstance: google.maps.Map | null) => {
  //   if (mapInstance) {
  //     setMap(mapInstance);
  //     mapInstance.setZoom(8);
  //     setTimeout(() => {
  //       mapInstance.panTo({
  //         lat: addressDetails.latitude,
  //         lng: addressDetails.longitude,
  //       });
  //       mapInstance.setZoom(18);
  //     }, 1000);
  //   }
  // };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });

    if (response.results[0]) {
      return response.results[0].formatted_address;
    } else {
      console.error("No address found for the given coordinates.");
      return "";
    }
  };

  const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    const address = JSON?.parse(localStorage.getItem("address") || "{}");

    if (lat && lng) {
      const formattedAddress = await getAddressFromCoordinates(lat, lng);
      let addressFormatToCheck = {
        latitude: lat,
        longitude: lng,
      };
      const res = await checkServiceabilityAddress(addressFormatToCheck);

      let newAddress = {
        ...address,
        latitude: lat,
        longitude: lng,
        formatted_address: formattedAddress,
      };

      setAddressDetails((prevState) => ({
        ...prevState,
        latitude: Number(lat),
        longitude: Number(lng),
        address: formattedAddress,
        deliverable: res,
      }));

      localStorage.setItem("address", JSON.stringify(newAddress));
    }
  };

  return (
    <div style={containerStyle}>
      {isLoaded ? (
        <GoogleMap
          // onLoad={handleMapLoad} // keeping it with intention
          zoom={17}
          center={{
            lat: addressDetails.latitude,
            lng: addressDetails.longitude,
          }}
          mapContainerStyle={containerStyle}
          options={googleControlOptions}
        >
          <MarkerF
            position={{
              lat: addressDetails.latitude,
              lng: addressDetails.longitude,
            }}
            animation={google.maps.Animation.DROP}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AddressMapContainer;
