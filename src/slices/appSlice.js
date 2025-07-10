import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  editedPost: {
    id: '',
    category: '',
    title: '',
    description: '',
    recommend1: '',
    recommend2: '',
    recommend3: '',
  },
  csrfTokenExp: false,
  isAuthenticated: false,
  user: null, //ログイン中のユーザーの情報
  isAuthLoading: true, //falseだと必ずログイン画面に遷移していまうので注意
  error: null,
};
// ログイン中のユーザー情報を取得するAPIを叩く関数
// ログインしていてJWTがあればユーザー情報が取れる
export const fetchAuthUser = createAsyncThunk('auth/fetchAuthUser', async () => {
  const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/user`, {
    withCredentials: true, // ← Cookieを送信
  });
  console.log(res.data);
  return res.data;
});
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleCsrfState: (state) => {
      console.log(state.csrfTokenExp);
      state.csrfTokenExp = !state.csrfTokenExp;
      console.log(state.csrfTokenExp);
    },
    // ログイン成功時
    setLoggedInUser: (state, action) => {
      // console.log(action.payload);
      state.isAuthenticated = true;
      state.user = action.payload; // payload にユーザーデータが渡される想定
    },
    // ログアウト時
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        // console.log('pending');
        state.isAuthLoading = true;
        state.error = undefined;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        // console.log('fulfilled'); // 通信に成功していること自体がログイン状態の証明
        state.isAuthLoading = false;
        state.isAuthenticated = true; // fetchAuthUserが実行され、返り値がstateに入る
        console.log(action.payload.username);
        state.user = action.payload.username;
        state.error = undefined;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        // console.log('rejected');
        state.isAuthLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
      });
  },
});
export const { setLoggedInUser, logoutUser, toggleCsrfState } = appSlice.actions;

// 状態をただ返す関数、参照するための関数
export const selectCsrfState = (state) => state.app.csrfTokenExp;
export const currentUser = (state) => state.app.user;
export const isAuthenticated = (state) => state.app.isAuthenticated;
export const selectPost = (state) => state.app.editedPost;
export const isAuthLoading = (state) => state.app.isAuthLoading;
export default appSlice.reducer;
