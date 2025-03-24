import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import originBike from '/public/assets/images/originBike.png';
import gpsIcon from '/public/assets/images/gpsIcon.png';

const MapContainer = ({ driverLocation, customerLocation, fetchOrderdetails }: any) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [markers, setMarkers] = useState<any[]>([
    { latitude: driverLocation.lat, longitude: driverLocation.lng },
    { latitude: customerLocation.lat, longitude: customerLocation.lng }
  ]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY || ''
  });

  const onMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      mapRef.current = mapInstance;

      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapInstance,
        suppressMarkers: true // Suppress default A and B markers
      });

      updateDirections(); // Set initial directions
    },
    [driverLocation, customerLocation]
  );

  const updateDirections = () => {
    if (mapRef.current && driverLocation && customerLocation) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: customerLocation,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
            setDirections(result);
          }
        }
      );
    }
  };

  const updateDriverLocation = (newDriverLocation: { lat: number; lng: number }) => {
    // Update the markers state with the new driver location
    setMarkers([
      { latitude: newDriverLocation.lat, longitude: newDriverLocation.lng },
      { latitude: customerLocation.lat, longitude: customerLocation.lng }
    ]);

    // Recalculate directions with the updated driver location
    updateDirections();
  };

  // Simulate driver location updates (you can replace this with actual updates from API)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating new driver location updates
      const newDriverLocation = {
        lat: driverLocation.lat + 0.001,
        lng: driverLocation.lng + 0.001
      };
      updateDriverLocation(newDriverLocation);
    }, 5000);

    return () => clearInterval(interval);
  }, [driverLocation, customerLocation]);

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend({
          lat: marker.latitude,
          lng: marker.longitude
        });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [markers]);

  return (
    <div className="w-full h-[35vw] mob:h-[90vw]  mob:w-screen ">
      {isLoaded ? (
        <GoogleMap
          onLoad={onMapLoad}
          // zoom={10}
          mapContainerClassName="w-full h-[35vw] mob:h-[90vw]  mob:w-screen "
          options={{
            zoomControl: false,
            scaleControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false
          }}
        >
          <Marker
            position={{ lat: markers[0].latitude, lng: markers[0].longitude }}
            icon={{
              url: originBike.src,
              scaledSize: new google.maps.Size(40, 40) // Adjust the size as needed
            }}
          />
          <Marker
            position={{ lat: markers[1].latitude, lng: markers[1].longitude }}
            icon={{
              url: gpsIcon.src,
              scaledSize: new google.maps.Size(40, 40) // Adjust the size as needed
            }}
          />
          {/* {markers.map((marker, index) => (
            <Marker key={index} position={{ lat: marker.latitude, lng: marker.longitude }} />
          ))} */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true // Suppresses the default A and B markers
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="text-center text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default MapContainer;
