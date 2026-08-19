import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/auth.service';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, data.password);
      setIsResetDone(true);
      toast.success('Password reset successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or has expired.">
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-500">
            Please request a new password reset link.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
          >
            <ArrowLeft size={14} />
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your new password below.">
      <div className="space-y-4">
        {isResetDone ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Password reset successful</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your password has been updated. You can now log in with your new password.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
