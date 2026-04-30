import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Skeleton,
  Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
// ...
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});
import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import axios from 'axios';
import { isGMapLoadedAtom } from '@/context/global';
import { locationAnchorAtom } from '@/features/Address/context/atoms';
import { useAtom } from 'jotai';
import { mainApiUrl, unprotectedUrl } from '@/url';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (locationData: any) => void;
  isClosable?: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({ open, onClose, onLocationSelect, isClosable = false }) => {
  const [view, setView] = useState<'initial' | 'search' | 'unserviceable'>('initial');
  const [permissionError, setPermissionError] = useState(false);
  const [isCheckingServiceability, setIsCheckingServiceability] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(false);
  const [isGMapLoaded] = useAtom(isGMapLoadedAtom);
  const [anchorEl] = useAtom(locationAnchorAtom);
  const [dynamicPosition, setDynamicPosition] = useState({ top: '127px', left: '762px' });

  useEffect(() => {
    const updatePosition = () => {
      const anchor = document.getElementById('location-header-button');
      if (anchor && open) {
        const rect = anchor.getBoundingClientRect();
        // Calculate left so that the tail (at right: 40px of 448px modal) aligns with button center
        const buttonCenter = rect.left + rect.width / 2;
        const modalLeft = buttonCenter - 408;

        setDynamicPosition({
          top: `${rect.bottom + 15}px`,
          left: `${modalLeft}px`
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [open]);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    initOnMount: true,
    requestOptions: {
      componentRestrictions: { country: 'in' }
    },
    debounce: 300
  });

  // Re-initialize if script was loaded late
  useEffect(() => {
    if (isGMapLoaded) {
      init();
    }
  }, [isGMapLoaded, init]);

  // Handle search timeout
  useEffect(() => {
    if (value.length > 2 && !status && view === 'search') {
      const timer = setTimeout(() => {
        setSearchTimeout(true);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setSearchTimeout(false);
    }
  }, [value, status, view]);

  const handleClose = (event: any, reason: string) => {
    if (!isClosable && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onClose();
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }

    setPermissionError(false);
    setIsCheckingServiceability(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let addressName = 'My Location';
        let fullAddress = '';

        try {
          const results = await getGeocode({ location: { lat: latitude, lng: longitude } });
          if (results && results[0]) {
            fullAddress = results[0].formatted_address;

            // Try to find a good short name (locality or neighborhood)
            const locality = results[0].address_components.find(
              (c) =>
                c.types.includes('sublocality_level_1') ||
                c.types.includes('locality') ||
                c.types.includes('neighborhood')
            );

            if (locality) {
              addressName = locality.long_name;
            } else {
              addressName = results[0].formatted_address.split(',')[0];
            }
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
        }

        await checkServiceability(latitude, longitude, addressName, fullAddress);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setPermissionError(true);
        setIsCheckingServiceability(false);
        setErrorMessage('We do not have permission to determine your location.\nPlease enter manually.');
      }
    );
  };

  const checkServiceability = async (lat: number, lng: number, addressName: string, formattedAddress?: string) => {
    setIsCheckingServiceability(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${mainApiUrl.fetchForAddressDeliverable || '/api/v5/public/check-deliverable'}`,
        {
          latitude: String(lat),
          longitude: String(lng)
        }
      );

      // API returns: {"deliverable":true,"store_id":4,"message":"Items are deliverable here"}
      if (response.data && response.data.deliverable) {
        const storeId = response.data.store_id;
        const locationData = {
          latitude: String(lat),
          longitude: String(lng),
          store_id: storeId,
          address_name: addressName,
          address: formattedAddress || addressName,
          is_deliverable: true
        };

        onLocationSelect(locationData);
        onClose();
      } else {
        setView('unserviceable');
      }
    } catch (error) {
      console.error('Serviceability check failed:', error);
      setView('unserviceable');
    } finally {
      setIsCheckingServiceability(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => async () => {
    setValue(suggestion.description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      await checkServiceability(lat, lng, suggestion.structured_formatting.main_text, suggestion.description);
    } catch (error) {
      console.error('Error fetching lat/lng:', error);
    }
  };

  const handleSearchAlternative = () => {
    setValue('');
    clearSuggestions();
    setPermissionError(false);
    setView('search');
  };

  const renderInitialView = () => (
    <Box
      sx={{
        p: '24px',
        pt: '32px',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {isClosable && (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#999' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      )}
      <Typography
        sx={{
          fontWeight: 700,
          mb: '12px',
          fontFamily: 'SofiaPro, sans-serif',
          width: '240px',
          fontSize: '24px',
          lineHeight: '1.2',
          color: '#000'
        }}
      >
        Select your Location
      </Typography>
      <Typography
        sx={{
          color: '#666',
          mb: '22px',
          fontSize: '16px',
          fontFamily: 'SofiaPro, sans-serif',
          width: '384px',
          lineHeight: '1.4',
          mx: 'auto'
        }}
      >
        Allow location access to see produce from your nearest store.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={handleSearchAlternative}
          sx={{
            borderRadius: '30px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontFamily: 'SofiaPro, sans-serif',
            borderColor: permissionError ? '#FFC107' : '#eee',
            backgroundColor: permissionError ? '#FFC107' : 'transparent',
            color: permissionError ? '#000' : '#333',
            '&:hover': {
              borderColor: '#FFC107',
              backgroundColor: '#FFC107',
              color: '#000'
            }
          }}
        >
          Search Manually
        </Button>
        <Button
          variant="contained"
          startIcon={isCheckingServiceability ? <CircularProgress size={20} color="inherit" /> : <GpsFixedIcon />}
          onClick={handleUseMyLocation}
          disabled={isCheckingServiceability}
          sx={{
            borderRadius: '30px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontFamily: 'SofiaPro, sans-serif',
            backgroundColor: permissionError ? '#E6E6E6' : '#FFC107',
            color: permissionError ? '#00000099' : '#000',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#e6af06',
              boxShadow: 'none'
            }
          }}
        >
          Use My Location
        </Button>
      </Box>

      {permissionError && (
        <Typography
          sx={{
            mt: 2,
            color: '#d32f2f',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'SofiaPro, sans-serif',
            whiteSpace: 'pre-line'
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const renderSearchView = () => (
    <Box sx={{ p: 4, position: 'relative' }}>
      {isClosable && (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#999' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      )}
      <Typography sx={{ fontWeight: 700, fontSize: '24px', mb: 3, textAlign: 'center', fontFamily: 'SofiaPro' }}>
        Enter your Location
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#E6E6E6',
          borderRadius: '30px'
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '14px', fontFamily: 'SofiaPro, sans-serif' }}
          placeholder={ready || isGMapLoaded ? 'Enter Your Location' : 'Initializing search...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!(ready || isGMapLoaded)}
          autoFocus
        />
      </Paper>

      <List sx={{ maxHeight: '150px', overflowY: 'auto', mb: 1 }}>
        {status === 'OK' &&
          data.map((suggestion) => (
            <ListItem
              button
              key={suggestion.place_id}
              onClick={handleSelectSuggestion(suggestion)}
              sx={{ borderRadius: '10px', mb: 0.5, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: '56px' }}>
                <Box sx={{ backgroundColor: '#FFF9C4', p: 1, borderRadius: '50%', display: 'flex' }}>
                  <LocationOnIcon sx={{ color: '#FBC02D', fontSize: '18px' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={suggestion.structured_formatting.main_text}
                secondary={suggestion.structured_formatting.secondary_text}
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 700, fontFamily: 'SofiaPro' }}
                secondaryTypographyProps={{ fontSize: '12px', fontFamily: 'SofiaPro', sx: { color: '#666' } }}
              />
            </ListItem>
          ))}
        {value.length > 2 && status !== 'OK' && (
          <Box sx={{ p: 1 }}>
            {status === 'ZERO_RESULTS' ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '14px', color: '#999', fontFamily: 'SofiaPro' }}>
                  No results found for "{value}"
                </Typography>
              </Box>
            ) : searchTimeout ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '14px', color: '#d32f2f', mb: 2, fontFamily: 'SofiaPro' }}>
                  Search is taking longer than expected.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setValue(value + ' ');
                    setTimeout(() => setValue(value.trim()), 50);
                  }}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    color: '#000',
                    borderColor: '#eee',
                    fontFamily: 'SofiaPro'
                  }}
                >
                  Retry Search
                </Button>
              </Box>
            ) : (
              // Skeleton Loading State
              <Box sx={{ py: 1 }}>
                {[1, 2].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                    <Skeleton variant="circular" width={36} height={36} sx={{ backgroundColor: '#f5f5f5' }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={20} sx={{ backgroundColor: '#f5f5f5' }} />
                      <Skeleton variant="text" width="90%" height={15} sx={{ backgroundColor: '#f5f5f5' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </List>

      <Button
        fullWidth
        variant="contained"
        startIcon={isCheckingServiceability ? <CircularProgress size={20} color="inherit" /> : <GpsFixedIcon />}
        onClick={handleUseMyLocation}
        disabled={isCheckingServiceability}
        sx={{
          mt: 2,
          borderRadius: '30px',
          textTransform: 'none',
          py: 1.5,
          fontFamily: 'SofiaPro, sans-serif',
          backgroundColor: permissionError ? '#eee' : '#FFC107',
          color: permissionError ? '#999' : '#000',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e6af06',
            boxShadow: 'none'
          }
        }}
      >
        Use My Location
      </Button>

      {permissionError && (
        <Typography
          sx={{
            mt: 1.5,
            color: '#d32f2f',
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'SofiaPro, sans-serif',
            whiteSpace: 'pre-line',
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const renderUnserviceableView = () => (
    <Box sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
      {isClosable && (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: '#999' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      )}
      <Typography sx={{ fontWeight: 700, mb: 3, fontFamily: 'SofiaPro' }}>Enter your Location</Typography>

      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF1F1',
          borderRadius: '30px',
          mb: 1,
          border: '1px solid #FFCDD2'
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon sx={{ color: '#D32F2F' }} />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: '14px', color: '#D32F2F', fontFamily: 'SofiaPro, sans-serif' }}
          value={value || 'Indiranagar'}
          disabled
        />
      </Paper>

      <Typography
        sx={{ color: '#D32F2F', fontSize: '12px', mb: 3, fontWeight: 500, fontFamily: 'SofiaPro, sans-serif' }}
      >
        We’re not available in your area yet. Please try a different location or consider pickup from store
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSearchAlternative}
        sx={{
          borderRadius: '30px',
          textTransform: 'none',
          py: 1.5,
          fontFamily: 'SofiaPro, sans-serif',
          backgroundColor: '#FFC107',
          color: '#000',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e6af06',
            boxShadow: 'none'
          }
        }}
      >
        Search Alternative Location
      </Button>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={!isClosable}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: '32px',
          width: { xs: '90%', md: '448px' },
          minHeight: '200px',
          height: 'auto',
          overflow: 'visible',
          position: { xs: 'relative', md: 'absolute' },
          top: { xs: 'auto', md: dynamicPosition.top },
          left: { xs: 'auto', md: dynamicPosition.left },
          margin: { xs: 'auto', md: 0 },
          transform: shake ? 'translateX(0)' : 'none',
          animation: shake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          '@keyframes shake': {
            '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
            '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
            '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
            '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-8px',
            right: '40px',
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            transform: 'rotate(45deg)',
            display: { xs: 'none', md: 'block' }
          }
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      {view === 'initial' && renderInitialView()}
      {view === 'search' && renderSearchView()}
      {view === 'unserviceable' && renderUnserviceableView()}
    </Dialog>
  );
};

export default LocationModal;
