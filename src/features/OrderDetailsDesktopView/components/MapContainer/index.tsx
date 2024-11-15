import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { orderDetailsAtom } from "../../context/atoms";
import { getOrderDetails } from "../../services/getOrderDetails";

interface Location {
  lat: number;
  lng: number;
}

interface Props {
  driverLocation: Location;
  customerLocation: Location;
}

const containerStyle = {
  height: "400px",
  width: "100%",
};

const MapContainer = (props: Props) => {
  const { customerLocation: endingPoint, driverLocation: startingPoint } =
    props;
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    React.useState<google.maps.DirectionsResult | null>(null);

  const googleControlOptions: google.maps.MapOptions = {
    zoomControl: false,
    scaleControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };

  const router = useRouter();
  const [, setOrderDetails] = useAtom(orderDetailsAtom);
  const refreshInterval = React.useRef<any>(null);

  const refreshDetails = () => {
    const { type, authToken, id } = router.query;
    if (type && authToken && id) {
      getOrderDetails(
        setOrderDetails,
        {
          id: String(id),
        },
        true
      );
    }
  };

  React.useEffect(() => {
    refreshInterval.current = setInterval(refreshDetails, 120 * 1000);
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [router.query]);

  React.useEffect(() => {
    if (map) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
      });

      const request: google.maps.DirectionsRequest = {
        origin: startingPoint,
        destination: endingPoint,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          setDirections(result);
        }
      });
    }
  }, [map]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY as string | "",
  });

  const handleMapLoad = (mapInstance: google.maps.Map | null) => {
    if (mapInstance) {
      setMap(mapInstance);
    }
  };

  return (
    <div style={containerStyle}>
      {isLoaded ? (
        <GoogleMap
          onLoad={handleMapLoad}
          zoom={10}
          center={startingPoint}
          mapContainerStyle={containerStyle}
          options={googleControlOptions}
        >
          <Marker position={startingPoint} />
          <Marker position={endingPoint} />
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MapContainer;
