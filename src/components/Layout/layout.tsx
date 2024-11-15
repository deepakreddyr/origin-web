import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/utilities/createEmotionCache";
import theme from "@/utilities/theme";
import Header from "../Header";
import { FooterDataType, MainMenuType } from "@/utilities/types";
import Footer from "../Footer";

const clientSideEmotionCache = createEmotionCache();

export default function Layout({
  children,
  mainMenuItems,
  footerData,
}: {
  children: React.ReactNode;
  mainMenuItems: MainMenuType[];
  footerData: FooterDataType;
}) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <Header mainMenuItems={mainMenuItems} />
        {children}
        <Footer {...footerData} />
      </ThemeProvider>
    </CacheProvider>
  );
}
