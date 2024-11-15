import type { TabTypeConstant } from "../constants/tabTypeContent";

export interface LoginAtom {
  isLoginSidebarOpen: boolean;
  isLogin: boolean;
  tabType: TabTypeConstant;
  user: any;
}
