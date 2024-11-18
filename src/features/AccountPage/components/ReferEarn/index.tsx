import { Box, Divider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  referEarnAtom,
} from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import { getReferEarn } from "../../services/referEarn";
import Copy from "./assets/copy.svg";
import DownIcon from "./assets/down.svg";
import Refer from "./assets/refer.svg";
import UpIcon from "./assets/UpIcon.svg";
import styles from "./style.module.css";

const ReferEarn = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [, setReferEarn] = useAtom(referEarnAtom);
  const [referCode, setReferCode] = React.useState("");
  const [refer] = useAtom(referEarnAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  React.useEffect(() => {
    getReferEarn(setReferEarn);
  }, []);

  React.useEffect(() => {
    if (refer.data?.referral_code) setReferCode(refer.data?.referral_code);
  }, [refer]);
  const [expandedFaq, setExpandedFaq] = React.useState(null);
  const [icon, setIcon] = React.useState(DownIcon);

  const toggleFaq = (faqId: any) => {
    if (expandedFaq === faqId) {
      setExpandedFaq(null);
      setIcon(DownIcon); // Set to down icon when collapsed
    } else {
      setExpandedFaq(faqId);
      setIcon(UpIcon); // Set to up icon when expanded
    }
  };

  const renderFaqs = () => {
    return (
      <Box className={styles["question-container"]}>
        <Typography className={styles["question-heading"]}>
          Frequently Asked Questions
        </Typography>
        {refer.data?.faqs?.map((faq) => (
          <Box className={styles["questions-box"]} key={faq.id}>
            <Box className={styles.question}>
              <Typography>{faq.title}</Typography>
              <Image
                className={styles["icon-img"]}
                src={icon}
                alt={expandedFaq === faq.id ? "up" : "down"}
                onClick={() => toggleFaq(faq.id)} // Toggle FAQ visibility and icon
              />
            </Box>
            {expandedFaq === faq.id && (
              <Box className={styles["faq-description"]}>
                <Typography className={styles["description-text"]}>
                  {faq.description}
                </Typography>
              </Box>
            )}
            <Divider className={styles.divider} />
          </Box>
        ))}
      </Box>
    );
  };
  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Refer & Earn"
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={() => {
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      <Typography className={styles.heading}>
        Invite your friends to
        <span className={styles.span}> Origin </span>
        get 500 Reward coins
      </Typography>
      <Box className={styles["copy-refer-button"]}>
        <Box className={styles["copy-button"]}>
          <Typography className={styles["copy-code"]}>
            {refer?.data?.referral_code}
          </Typography>
          <Image
            src={Copy}
            alt="Copy"
            className={styles["copy-img"]}
            onClick={() => {
              navigator.clipboard.writeText(referCode);
            }}
          />
        </Box>

        <button className={styles["refer-button"]}>
          <Image src={Refer} alt="Refer" />

          <Typography className={styles["refer-code"]}> Refer Now</Typography>
        </button>
      </Box>
      {renderFaqs()}
    </AccountSidebarLayout>
  );
};

export default ReferEarn;
