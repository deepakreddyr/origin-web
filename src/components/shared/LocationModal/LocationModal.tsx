import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
import useScrollLock from '@/utilities/hooks/useScrollLock';

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
  const [isLeftAligned, setIsLeftAligned] = useState(false);

  // Prevent background scroll while modal is open
  useScrollLock(open);

  useEffect(() => {
    const updatePosition = () => {
      const anchor = document.getElementById('location-header-button');
      if (anchor && open) {
        const rect = anchor.getBoundingClientRect();
        const buttonCenter = rect.left + rect.width / 2;

        // If button is on the left half of the screen (e.g. Mango page), align modal to the right of it
        const isLeft = rect.left < window.innerWidth / 2;
        setIsLeftAligned(isLeft);

        const modalLeft = isLeft ? Math.max(10, buttonCenter - 40) : buttonCenter - 408;

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
        setErrorMessage('We do not have permission to determine your location. Please enter manually.');
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
        p: { xs: 2.5, md: 4 },
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
          fontSize: { xs: '20px', md: '24px' },
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
          fontFamily: 'SofiaPro',
          width: '100%'
        }}
      >
        Select your Location
      </Typography>
      <Typography
        sx={{
          color: '#666',
          mb: '18px',
          fontSize: { xs: '15px', md: '18px' },
          fontFamily: 'SofiaPro, sans-serif',
          maxWidth: '100%',
          width: { xs: '100%', md: '384px' },
          lineHeight: '1.4',
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        Allow location access to see produce from your nearest store.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'nowrap', width: '100%' }}>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={handleSearchAlternative}
          sx={{
            flex: 1,
            fontSize: { xs: '13px', md: '17px' },
            borderRadius: '32px',
            textTransform: 'none',
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 1.5 },
            whiteSpace: 'nowrap',
            fontFamily: 'SofiaPro',
            fontWeight: permissionError ? 600 : 400,
            borderColor: permissionError ? '#FFC107' : '#eee',
            backgroundColor: permissionError ? '#FFC107' : 'transparent',
            color: permissionError ? '#000' : '#6B7280',
            height: '48px',
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
            flex: 1,
            fontSize: { xs: '13px', md: '17px' },
            borderRadius: '32px',
            textTransform: 'none',
            px: { xs: 1, md: 2 },
            py: { xs: 1, md: 1.5 },
            whiteSpace: 'nowrap',
            fontFamily: 'SofiaPro',
            fontWeight: permissionError || isCheckingServiceability ? 400 : 600,
            backgroundColor: permissionError || isCheckingServiceability ? '#E6E6E6 !important' : '#FFC107 !important',
            color: permissionError || isCheckingServiceability ? '#00000099 !important' : '#000 !important',
            boxShadow: 'none',
            height: '48px',
            '&.Mui-disabled': {
              backgroundColor: '#E6E6E6 !important',
              color: '#00000099 !important'
            },
            '&:hover': {
              backgroundColor:
                permissionError || isCheckingServiceability ? '#E6E6E6 !important' : '#e6af06 !important',
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
            fontSize: { xs: '13px', md: '15px' },
            fontWeight: 400,
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
    <Box sx={{ p: { xs: 2.5, md: 4 }, position: 'relative' }}>
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
          fontSize: { xs: '20px', md: '24px' },
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
          fontFamily: 'SofiaPro'
        }}
      >
        Enter your Location
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#E6E6E6',
          borderRadius: '32px',
          height: '48px'
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

      <List sx={{ maxHeight: '150px', overflowY: 'auto', mb: 1, mx: -2 }}>
        {status === 'OK' &&
          data.map((suggestion) => (
            <ListItem
              button
              key={suggestion.place_id}
              onClick={handleSelectSuggestion(suggestion)}
              sx={{ borderRadius: '10px', mb: { xs: 0, md: 0.5 }, py: { xs: 0.5, md: 1 } }}
            >
              <ListItemIcon sx={{ minWidth: { xs: '48px', md: '56px' } }}>
                <Image
                  src="/assets/svg/searchmodalicon.svg"
                  alt="Location"
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                />
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
          mt: { xs: 0, md: 2 },
          borderRadius: '32px',
          textTransform: 'none',
          height: '48px',
          fontFamily: 'SofiaPro',
          fontWeight: 600,
          backgroundColor: permissionError || isCheckingServiceability ? '#E6E6E6 !important' : '#FFC107 !important',
          color: permissionError || isCheckingServiceability ? '#00000099 !important' : '#000 !important',
          boxShadow: 'none',
          '&.Mui-disabled': {
            backgroundColor: '#E6E6E6 !important',
            color: '#00000099 !important'
          },
          '&:hover': {
            backgroundColor: permissionError || isCheckingServiceability ? '#E6E6E6 !important' : '#e6af06 !important',
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
            fontSize: { xs: '14px', md: '14px' },
            fontWeight: 400,
            fontFamily: 'SofiaPro, sans-serif',
            // whiteSpace: 'pre-line',
            textAlign: 'center'
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );

  const renderUnserviceableView = () => (
    <Box sx={{ p: { xs: 2.5, md: 4 }, textAlign: 'center', position: 'relative' }}>
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
          fontSize: { xs: '20px', md: '24px' },
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
          fontFamily: 'SofiaPro'
        }}
      >
        Enter your Location
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF1F1',
          borderRadius: '32px',
          mb: 1,
          height: '48px',
          border: '1px solid #A60000'
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon sx={{ color: '#A60000' }} />
        </IconButton>
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: '14px',
            fontFamily: 'SofiaPro, sans-serif',
            '& input': {
              color: '#A60000 !important',
              WebkitTextFillColor: '#A60000 !important'
            },
            '&.Mui-disabled input': {
              color: '#A60000 !important',
              WebkitTextFillColor: '#A60000 !important'
            }
          }}
          value={value || 'Indiranagar'}
          disabled
        />
      </Paper>

      <Typography
        sx={{
          color: '#A60000',
          fontSize: { xs: '13px', md: '16px' },
          mb: 3,
          fontWeight: 400,
          fontFamily: 'SofiaPro, sans-serif'
        }}
      >
        We’re not available in your area yet. Please try a different location or consider pickup from store.
      </Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSearchAlternative}
        sx={{
          fontSize: { xs: '14px', md: '16px' },
          borderRadius: '32px',
          textTransform: 'none',
          height: '48px',
          fontFamily: 'SofiaPro',
          fontWeight: 600,
          backgroundColor: '#FFC107',
          color: '#000',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e6af06',
            boxShadow: 'none'
          }
        }}
      >
        Choose Alternative Location
      </Button>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={!isClosable}
      disableScrollLock={false}
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
          boxShadow: { xs: '0px 34.41px 68.82px -16.52px rgba(0, 0, 0, 0.25)', md: 'none' },
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
            right: isLeftAligned ? 'auto' : '40px',
            left: isLeftAligned ? '40px' : 'auto',
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
