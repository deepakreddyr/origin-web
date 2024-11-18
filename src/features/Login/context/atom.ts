import { atom } from 'jotai';

import { TabTypeConstant } from '../constants/tabTypeContent';
import type { LoginAtom } from '../types/LoginAtom';

export const login = atom<LoginAtom>({
  isLoginSidebarOpen: false,
  isLogin: false,
  tabType: TabTypeConstant.ENTER_MOBILE_NUMBER,
  user: null
});
