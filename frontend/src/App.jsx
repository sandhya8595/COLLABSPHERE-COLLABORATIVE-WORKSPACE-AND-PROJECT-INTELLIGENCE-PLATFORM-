import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchCurrentUser } from './store/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to restore session on app load (httpOnly cookie based)
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
