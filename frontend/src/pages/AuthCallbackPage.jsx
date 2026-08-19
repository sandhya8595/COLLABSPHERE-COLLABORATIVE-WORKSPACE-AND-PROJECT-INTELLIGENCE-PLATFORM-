import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import Loader from '../components/common/Loader';

const AuthCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  }, [dispatch, navigate]);

  return <Loader fullScreen />;
};

export default AuthCallbackPage;
