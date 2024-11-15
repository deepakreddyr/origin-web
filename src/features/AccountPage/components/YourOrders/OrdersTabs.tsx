import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

import styles from '../../style.module.css';
import All from './All';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={`tab-content ${styles['tab-content']}`}>{children}</Box>
      )}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const OrdersTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      className={`custom-tabs ${styles['custom-tabs']}`}
      sx={{
        'div[role="tabpanel"]': {
          flexGrow: 1,
        },
        '.tabs-list': {
          '.MuiTabs-indicator': {
            height: 3,
            borderRadius: '4px 4px 0px 0px',
          },
          '.MuiTabs-flexContainer': {
            gap: 1,
          },
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        className={`tabs-list ${styles['tabs-list']}`}
      >
        <Tab label="All" {...a11yProps(0)} />
        <Tab label="Online" {...a11yProps(1)} />
        <Tab label="In Store" {...a11yProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <All />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <All filter="app" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <All filter="store" />
      </CustomTabPanel>
    </Box>
  );
};

export default OrdersTabs;
