import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null, // 'student', 'teacher', 'admin'
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
// export const selectUser = (state) => state.auth.user;
// export const selectRole = (state) => state.auth.role;