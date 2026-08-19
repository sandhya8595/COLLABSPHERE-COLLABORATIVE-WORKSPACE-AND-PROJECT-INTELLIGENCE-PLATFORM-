import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, refetchUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    jobTitle: user?.jobTitle || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(form);
      await refetchUser();
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await userService.uploadAvatar(formData);
      await refetchUser();
      toast.success('Avatar updated.');
    } catch (err) {
      toast.error('Failed to upload avatar.');
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-900">Personal Profile</h3>

      <div className="flex items-start gap-6">
        <div className="text-center">
          <Avatar user={user} size="lg" />
          <label className="mt-2 block cursor-pointer text-xs font-medium text-primary-600 hover:underline">
            Upload new photo
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Job Title</label>
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input
              disabled
              value={user?.email || ''}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-400">Email changes require identity verification.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
