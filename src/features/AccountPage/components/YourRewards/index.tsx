import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import React from "react";

import Coin from "/public/assets/svg/coin.svg";
import RewardsInfo from "/public/assets/svg/rewards-info.svg";
import AccountSidebarLayout from "../../../../components/AccountLayout/AccountSidebarLayout";
import {
  activeAccountsPageAtom,
  isAccountIsOpen,
  transactionListAtom,
  walletAndRewardAtom,
} from "../../context/atoms";
import ActiveSidebar from "../../enums/ActiveSidebar";
import { getTransactionList } from "../../services/transaction";
import { getWalletAndRewards } from "../../services/walletAndRewads";
import RewardsTabs from "./tabs";

const YourRewards = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountIsOpen);
  const [walletAndRewards] = useAtom(walletAndRewardAtom);
  const [, setWalletAndRewards] = useAtom(walletAndRewardAtom);
  const [, setTransactionList] = useAtom(transactionListAtom);
  const [, setActiveAccountsPage] = useAtom(activeAccountsPageAtom);

  React.useEffect(() => {
    getWalletAndRewards(setWalletAndRewards);
    const currentPage = 0;
    const increasePage = true;
    getTransactionList(setTransactionList, currentPage, increasePage);
  }, []);

  return (
    <AccountSidebarLayout
      isOpen={isOpen}
      title="Your Rewards"
      onClose={() => {
        setIsOpen(false);
      }}
      onBack={() => {
        setActiveAccountsPage(ActiveSidebar.ACCOUNT_MAIN);
      }}
    >
      <Box
        className="your-rewards"
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Box
          className="reward-intro"
          sx={{
            borderRadius: "12px",
            padding: "12px 16px",
            background: "linear-gradient(134deg, #349D7D 0%, #3C846E 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: "white" }}>
              Rewards
            </Typography>
            <Box component="figure" sx={{ margin: "2px 0 0" }}>
              <Image src={RewardsInfo} alt="RewardsInfo" />
            </Box>
          </Box>
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "rgba(255, 255, 255, 0.80)", display: "block" }}
          >
            Get rewarded for every purchases made both online&in-store Save by
            using coins on your next purchase.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Image src={Coin} alt="coin" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "white",
                fontFamily: "Roboto Mono",
              }}
            >
              {walletAndRewards?.data?.reward_balance}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: "normal",
                color: "white",
              }}
            >
              Available
            </Typography>
          </Box>
        </Box>
        <Box
          className="reward-transactions"
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Rewards Transactions
          </Typography>
          <Box sx={{}}>
            <RewardsTabs />
          </Box>
        </Box>
      </Box>
    </AccountSidebarLayout>
  );
};

export default YourRewards;
