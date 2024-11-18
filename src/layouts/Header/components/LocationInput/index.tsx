import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useAtom, useSetAtom } from 'jotai';
import * as React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import { dropdownTop } from '../../constants/dropdownTop';
import { activeDropdownTop, isDropdownActive, serviceabilityCheck, suggestionsList } from '../../context/atoms';
import { checkServiceability } from '../../services/checkServiceability';
import type { ServiceabilityPayload } from '../../types/ServiceabilityPayload';
import AreaLocation from '../AreaLocation';
import MajorAreaLocation from '../MajorAreaDropDown';

export default function LocationInput() {
  const [isDropdownOpen, setIsDropdownOpen] = useAtom(isDropdownActive);
  const setServiceData = useSetAtom(serviceabilityCheck);
  const [activeDropdownTopValue, setActiveDropdownTop] = useAtom(activeDropdownTop);
  const setSuggestions = useSetAtom(suggestionsList);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const hoverDropdownRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300
  });

  React.useEffect(() => {
    if (data) setSuggestions(data);
  }, [data]);

  const onInputAreaClick = () => {
    setIsDropdownOpen(true);
  };

  const onInputFocus = () => {
    setActiveDropdownTop(dropdownTop.AREA_LIST);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleInput = (e: any) => {
    setValue(e.target.value);
    setIsDropdownOpen(true);
    setActiveDropdownTop(dropdownTop.AREA_LIST);
  };

  const triggerServiceability = (payload: ServiceabilityPayload) => {
    setIsDropdownOpen(true);
    setIsHovered(false);
    setActiveDropdownTop(dropdownTop.SERVICEABILITY);
    checkServiceability(setServiceData, payload);
  };

  const handleSelect = (name: string, description: string) => () => {
    setValue(description, false);
    clearSuggestions();

    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      triggerServiceability({
        latitude: String(lat),
        longitude: String(lng),
        name,
        formatted_address: description,
        address_id: ''
      });
    });
  };

  const onDetectLocationClick = () => {
    setIsDropdownOpen(true);
    setActiveDropdownTop(dropdownTop.DETECT_LOCATION);
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      className="location-input"
      sx={{
        position: 'relative',
        maxWidth: { ml: '100%', md: 400 },
        width: '100%'
      }}
      ref={dropdownRef}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#F9F0DA',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row'
        }}
        onClick={onInputAreaClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <InputBase
          sx={{
            paddingLeft: 2,
            flex: 1
          }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
          value={value}
          onChange={handleInput}
          onFocus={onInputFocus}
        />
        <IconButton
          color="primary"
          sx={{
            p: '10px',
            borderRadius: '0',
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            backgroundColor: activeDropdownTopValue === dropdownTop.DETECT_LOCATION ? 'rgba(0, 0, 0, 0.06)' : ''
          }}
          aria-label="directions"
          onClick={onDetectLocationClick}
        >
          <GpsFixedIcon />
        </IconButton>
      </Paper>
      {isDropdownOpen && <AreaLocation handleSelect={handleSelect} triggerServiceability={triggerServiceability} />}
      {!isDropdownOpen && isHovered && (
        <Box ref={hoverDropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Box
            sx={{
              position: 'absolute',
              height: '1rem',
              margin: '0',
              width: '100%',
              xIndex: '10'
            }}
          ></Box>
          <MajorAreaLocation handleSelect={handleSelect} />
        </Box>
      )}
    </Box>
  );
}
