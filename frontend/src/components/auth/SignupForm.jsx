import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const result = await signup(data);
    setIsSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome to CollabSphere.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Alex"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
              {...register('firstName', { required: 'Required' })}
            />
          </div>
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            placeholder="Mercer"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
            {...register('lastName')}
          />
        </div>
      </div>

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
        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' },
            })}
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
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
