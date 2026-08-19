import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const res = await authService.getMe();
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch user.');
  }
});

export const signupThunk = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
  try {
    const res = await authService.signup(userData);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Signup failed.');
  }
});

export const loginThunk = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await authService.login(credentials);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed.');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(signupThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
