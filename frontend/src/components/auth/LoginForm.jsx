import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Work Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
            {...register('email', { required: 'Email is required' })}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
            {...register('password', { required: 'Password is required' })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {isLoading ? 'Logging in...' : 'Log in to Workspace'}
      </button>
    </form>
  );
};

export default LoginForm;
