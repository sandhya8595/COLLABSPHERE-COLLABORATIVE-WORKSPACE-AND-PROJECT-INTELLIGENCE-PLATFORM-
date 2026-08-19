import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/auth.service';

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      setIsEmailSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="No worries, we'll send you a reset link.">
      <div className="space-y-4">
        {isEmailSent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
              <p className="mt-1 text-sm text-gray-500">
                We sent a password reset link to your email. Please check your inbox (and spam folder).
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:bg-white focus:ring-1 focus:ring-primary-500"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
