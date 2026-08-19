import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
