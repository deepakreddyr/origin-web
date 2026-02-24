import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { isGMapLoadedAtom } from '@/context/global';
import locationPin from '@/assets/svg/location-pin.svg';

interface LocationSelectorProps {
  open: boolean;
  onLocationSelected: (storeId: string, address: any) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ open, onLocationSelected }) => {
  const [isGMapLoaded] = useAtom(isGMapLoadedAtom);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    initOnMount: false,
    requestOptions: {
      componentRestrictions: { country: 'in' }
    },
    debounce: 300
  });

  useEffect(() => {
    if (isGMapLoaded && open && window.google) {
      init();
    }
  }, [isGMapLoaded, open, init]);

  const handleClose = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 300);
  };

  const handleSelect = async (description: string) => {
    if (!window.google) {
      setError('Google Maps is not loaded yet.');
      return;
    }
    setValue(description, false);
    clearSuggestions();
    setLoading(true);
    setError(null);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      const payload = {
        latitude: lat,
        longitude: lng,
        formatted_address: description,
        name: description.split(',')[0]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v5/public/check-deliverable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'MM-Device-Type': 'web',
          'MM-Build-Version': '1.0.1'
        },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      const resData = await response.json();

      if (resData.deliverable && resData.store_id) {
        localStorage.setItem('store-id', JSON.stringify(resData.store_id));
        localStorage.setItem(
          'selected_address',
          JSON.stringify({
            ...payload,
            store_id: resData.store_id
          })
        );
        onLocationSelected(resData.store_id, payload);
      } else {
        setError(resData.message || 'Location not deliverable at the moment.');
      }
    } catch (e) {
      setError('Failed to fetch location details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        try {
          if (!window.google) throw new Error('GMap not loaded');
          const results = await getGeocode({ location: { lat, lng } });
          if (results.length > 0) {
            handleSelect(results[0].formatted_address);
          } else {
            setError('Could not determine address for your location.');
            setLoading(false);
          }
        } catch (e) {
          setError('Error fetching address. Please search manually.');
          setLoading(false);
        }
      },
      (geoError) => {
        let msg = 'Location access denied. Please search manually.';
        if (geoError.code === geoError.PERMISSION_DENIED)
          msg = 'Location permission denied. Please allow it in browser settings or search manually.';
        else if (geoError.code === geoError.POSITION_UNAVAILABLE) msg = 'Location information is unavailable.';
        else if (geoError.code === geoError.TIMEOUT) msg = ' ';
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // If search status is not OK and not empty/Zero, show it as error
  useEffect(() => {
    if (status && status !== 'OK' && status !== 'ZERO_RESULTS') {
      setError(`Search Error: ${status}. Please check if the API key is valid.`);
    }
  }, [status]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="location-selector-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Box
        className={shaking ? 'shake' : ''}
        sx={{
          width: { xs: '90%', sm: 480 },
          bgcolor: 'white',
          borderRadius: '32px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          p: 4,
          outline: 'none',
          position: 'relative'
        }}
      >
        <Typography
          id="location-selector-title"
          variant="h5"
          sx={{
            fontFamily: 'Stinger, Recoleta, serif',
            lineHeight: 1.2,
            fontWeight: 700,
            mb: 1,
            color: '#231F20'
          }}
        >
          Your Location
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'SofiaPro, sans-serif',
            color: '#231F20CC',
            mb: 3
          }}
        >
          Select your delivery area to see available items
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#F8F4E9',
            borderRadius: '16px',
            mb: status === 'OK' ? 0 : 2,
            border: '1px solid #EDE6CC',
            transition: 'border-color 0.2s',
            '&:focus-within': {
              borderColor: '#fac510'
            }
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon sx={{ color: '#231F20' }} />
          </IconButton>
          <InputBase
            sx={{ flex: 1, ml: 1, fontFamily: 'SofiaPro', fontSize: '14px' }}
            placeholder={!isGMapLoaded ? 'Loading Maps...' : 'Search for your street, area, or landmark'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isGMapLoaded}
          />
          {(loading || (!ready && value && isGMapLoaded)) && (
            <CircularProgress size={20} sx={{ mr: 1, color: '#fac510' }} />
          )}
        </Paper>

        {status === 'OK' && (
          <List
            sx={{
              pt: 0,
              mb: 2,
              maxHeight: 200,
              overflow: 'auto',
              bgcolor: '#fff',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              border: '1px solid #EDE6CC',
              borderTop: 0
            }}
          >
            {data.map((suggestion) => (
              <ListItem
                button
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion.description)}
                sx={{ '&:hover': { bgcolor: '#F8F4E9' } }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: '#7D786D' }} />
                </ListItemIcon>
                <ListItemText
                  primary={suggestion.structured_formatting.main_text}
                  secondary={suggestion.structured_formatting.secondary_text}
                  primaryTypographyProps={{ fontSize: '14px', fontFamily: 'SofiaPro', fontWeight: 600 }}
                  secondaryTypographyProps={{ fontSize: '12px', fontFamily: 'SofiaPro' }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Button
          fullWidth
          variant="text"
          startIcon={<MyLocationIcon />}
          onClick={handleCurrentLocation}
          disabled={loading}
          sx={{
            justifyContent: 'flex-start',
            color: '#fac510',
            fontFamily: 'SofiaPro',
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            mt: 1,
            mb: 1,
            '&:hover': { bgcolor: 'rgba(250, 197, 16, 0.05)' }
          }}
        >
          Use My Current Location
        </Button>

        {error && (
          <Typography
            color="error"
            variant="caption"
            sx={{
              display: 'block',
              mb: 2,
              mt: 1,
              textAlign: 'center',
              fontFamily: 'SofiaPro',
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            {error}
          </Typography>
        )}

        {status === 'ZERO_RESULTS' && (
          <Typography
            color="textSecondary"
            variant="caption"
            sx={{ display: 'block', mb: 2, textAlign: 'center', fontFamily: 'SofiaPro' }}
          >
            No results found for "{value}".
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Box sx={{ position: 'relative', width: 120, height: 120, animation: 'bounce 2s infinite ease-in-out' }}>
            <Image src={locationPin} alt="Location" fill style={{ objectFit: 'contain' }} />
          </Box>
        </Box>

        <style jsx global>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </Box>
    </Modal>
  );
};

export default LocationSelector;
