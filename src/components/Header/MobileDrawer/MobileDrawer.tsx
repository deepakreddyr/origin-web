import React from 'react';
import { Drawer, Container, Typography, Box } from '@mui/material';
import classNames from 'classnames';
import OriginButton from '../../OriginButton';
import { OriginCloseIcon } from '../../../Icons/OriginIcons';
import { useRouter } from 'next/router';

interface MobileDrawerProps {
  drawerOpen: boolean;
  handleMobileMenuOpen: () => void;
  mainMenuItems: any[];
  openSubmenu: string | null;
  handleSubmenuToggle: (label: string) => void;
  isMobile: boolean;
  topBarTransition: boolean;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  drawerOpen,
  handleMobileMenuOpen,
  mainMenuItems,
  openSubmenu,
  handleSubmenuToggle,
  isMobile,
  topBarTransition
}) => {
  const router = useRouter();

  const handleRouteChange = (path: string) => {
    router.push(path);
    handleMobileMenuOpen(); // Close drawer after navigating
  };

  return (
    <Drawer
      anchor="top"
      open={drawerOpen}
      onClose={handleMobileMenuOpen}
      classes={{
        paper: 'rounded-b-3xl shadow-sm border border-primary-200 z-[1300] mt-[0vw]'
      }}
      sx={{ '.MuiModal-backdrop': { marginTop: '40px' } }}
    >
      <Container className="relative pt-[5vw] pb-[6vw]">
        {/* Close Icon */}
        <OriginButton
          variant="iconOnly"
          handleClick={handleMobileMenuOpen}
          classes={{
            iconButton: 'absolute left-[4vw] top-[4vw] p-[2vw] hover:shadow-none'
          }}
        >
          <OriginCloseIcon className="w-[4vw] h-[4vw]" />
        </OriginButton>

        {/* Static Items: Shop All, About Us */}
        <Box className="flex flex-col divide-y divide-oGrey-100 mt-[12vw]">
          {[
            { label: 'Shop All', path: '/shop' },
            { label: 'About Us', path: '/about' }
          ].map((item) => (
            <OriginButton
              key={item.label}
              variant="textOnly"
              handleClick={() => handleRouteChange(item.path)}
              classes={{
                iconButton: 'w-full flex justify-start items-center py-[3.8vw]'
              }}
            >
              <Typography variant="body1" component="span" className="text-[4.4vw] text-black leading-[1.2]">
                {item.label}
              </Typography>
            </OriginButton>
          ))}
        </Box>

        {/* Dynamic main menu items */}
        <Box className="flex flex-col divide-y divide-oGrey-100">
          {mainMenuItems.map((item) => (
            <OriginButton
              key={item.label}
              variant="textOnly"
              handleClick={() => handleRouteChange(item.link)}
              classes={{
                iconButton: 'w-full flex justify-start items-center py-[3.8vw]'
              }}
            >
              <Typography variant="body1" component="span" className="text-[4.4vw] text-black leading-[1.2]">
                {item.label}
              </Typography>
            </OriginButton>
          ))}
        </Box>
      </Container>
    </Drawer>
  );
};

export default MobileDrawer;
