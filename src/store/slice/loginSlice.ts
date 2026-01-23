import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false,
  isLogin: false,
  tabType: '',
  user: null,
  isHeaderVisible: true,
  isFreshLogin: false
};

export const loginSlice = createSlice({
  name: 'loginDetails',
  initialState,
  reducers: {
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setTabType: (state, action) => {
      state.tabType = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsHeaderVisible: (state, action) => {
      state.isHeaderVisible = action.payload;
    },
    setIsFreshLogin: (state, action) => {
      state.isFreshLogin = action.payload;
    },
    setLoginDetails: (state, action) => {
      // Ensure the action payload contains the correct keys to prevent unintended state changes
      const { isSidebarOpen, isLogin, tabType, user } = action.payload;
      if (isSidebarOpen !== undefined) state.isSidebarOpen = isSidebarOpen;
      if (isLogin !== undefined) state.isLogin = isLogin;
      if (tabType !== undefined) state.tabType = tabType;
      if (user !== undefined) state.user = user;
    }
  }
});

export const { setIsSidebarOpen, setIsLogin, setTabType, setUser, setLoginDetails, setIsHeaderVisible, setIsFreshLogin } =
  loginSlice.actions;
export default loginSlice.reducer;
