import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginThunk, signupThunk, logoutThunk, fetchCurrentUser } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, error } = useSelector((state) => state.auth);

  const signup = useCallback((userData) => dispatch(signupThunk(userData)), [dispatch]);
  const login = useCallback((credentials) => dispatch(loginThunk(credentials)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);
  const refetchUser = useCallback(() => dispatch(fetchCurrentUser()), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    error,
    signup,
    login,
    logout,
    refetchUser,
  };
};
