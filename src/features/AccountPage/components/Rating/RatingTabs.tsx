import type { SxProps, Theme } from "@mui/material";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useAtom } from "jotai";
import * as React from "react";
import Lottie from "react-lottie";

import { activeAccountsPageAtom, rateOrderAtom } from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import { rateOrderApi } from "../../services/rateOrder";
import styles from "../../style.module.css";
import type { RateOrderPayload } from "../../types/RateOrderPayload";
import HappyAnimation from "./assets/Starstuck.json";
import SadAnimation from "./assets/Straightface.json";
import RatingHappy from "./RatingHappy";
import RatingSad from "./RatingSad";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number | null;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className={`rating-tab-panel ${styles["rating-tab-panel"]}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="tab-content">{children}</Box>}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const RatingTabs = () => {
  const [value, setValue] = React.useState<number | null>(null);

  const [message, setMessage] = React.useState<string>("");
  const [selectedText, setSelectedText] = React.useState<string[]>([]);
  const [rateOrder, setRateOrder] = useAtom(rateOrderAtom);

  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  const handleMessageChange = (typedMessage: string) => {
    setMessage(typedMessage);
  };

  const onSubmit = async () => {
    try {
      let feedback = "";
      selectedText.forEach((item, index) => {
        if (index === 0) {
          feedback += item;
        } else {
          feedback += `, ${item}`;
        }
      });

      if (message.length > 0) {
        feedback += `, ${message}`;
      }

      if (rateOrder?.order_id) {
        const payload: RateOrderPayload = {
          feedback,
          is_liked_products: value === 0,
          is_liked_services: value === 0,
          is_liked_delivery: value === 0,
          order_id: rateOrder?.order_id,
        };

        const res = await rateOrderApi(payload);

        if (res) {
          setActiveAccountsPage(ActiveSidebar.YOUR_ORDERS);
          setRateOrder(null);
        }
      }
    } catch (err) {
      //
    }
  };

  const handleSelectedTextChange = (selectedString: string) => {
    if (selectedText.includes(selectedString)) {
      const tempText = selectedText.filter((m) => m !== selectedString);
      setSelectedText(tempText);
    } else {
      setSelectedText([...selectedText, selectedString]);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleMessageChange("");
    setSelectedText([]);
  };

  const buttonCss = React.useMemo((): SxProps<Theme> | undefined => {
    const css: SxProps<Theme> = {
      width: "100%",
      textTransform: "uppercase",
      fontSize: 14,
      marginTop: "0.5rem",
    };

    if (value === null) {
      css.position = "absolute";
      css.bottom = "0";
    }

    return css;
  }, [value]);

  const HappyTabAnimation = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: HappyAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return <Lottie options={defaultOptions} height={60} width={60} />;
  };

  const SadTabAnimation = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: SadAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return <Lottie options={defaultOptions} height={60} width={60} />;
  };

  <Tabs
    value={value}
    onChange={handleChange}
    aria-label="basic tabs example"
    className={`rating-tabs-list ${styles["rating-tabs-list"]}`}
  >
    <Tab icon={<HappyTabAnimation />} {...a11yProps(0)} />
    <Tab icon={<SadTabAnimation />} {...a11yProps(1)} />
  </Tabs>;

  return (
    <Box
      className="rating-happy"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <Box
        className="rating-intro-text"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500, lineHeight: 1.1 }}>
          Rate your
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            lineHeight: 1.1,
            color: "#00855B",
          }}
        >
          Order Experience!
        </Typography>
      </Box>
      <Box
        className={`rating-tabs ${styles["rating-tabs"]}`}
        sx={{
          position: !value ? "relative" : "none",
          ".rating-tabs-list": {
            ".Mui-selected": {
              backgroundColor: "#F2EAD4",
            },
            ".MuiTabs-indicator": {
              display: "none",
            },
            ".MuiTabs-flexContainer": {},
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          className={`rating-tabs-list ${styles["rating-tabs-list"]}`}
        >
          <Tab icon={<HappyTabAnimation />} {...a11yProps(0)} />
          <Tab icon={<SadTabAnimation />} {...a11yProps(1)} />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <RatingHappy
            selectedText={selectedText}
            handleMessageChange={handleMessageChange}
            handleSelectedTextChange={handleSelectedTextChange}
            message={message}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <RatingSad
            selectedText={selectedText}
            handleMessageChange={handleMessageChange}
            handleSelectedTextChange={handleSelectedTextChange}
            message={message}
          />
        </CustomTabPanel>
        <Button
          sx={buttonCss}
          onClick={onSubmit}
          variant="contained"
          color="success"
        >
          Submit Feedback
        </Button>
      </Box>
    </Box>
  );
};

export default RatingTabs;
