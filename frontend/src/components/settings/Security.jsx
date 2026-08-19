import { useState } from 'react';
import { userService } from '../../services/user.service';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition-colors ${
      checked ? 'bg-primary-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const Security = () => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [notifications, setNotifications] = useState({
    emailSummaries: true,
    mentions: true,
    securityAlerts: true,
  });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async () => {
    setSaving(true);
    try {
      await userService.changePassword(passwords);
      toast.success('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-900">Change Password</h3>
        <div className="max-w-sm space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
          />
          <button
            onClick={handlePasswordChange}
            disabled={saving}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-900">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Summaries</p>
              <p className="text-xs text-gray-400">Daily digest of workspace activity</p>
            </div>
            <Toggle
              checked={notifications.emailSummaries}
              onChange={(v) => setNotifications((p) => ({ ...p, emailSummaries: v }))}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Mentions</p>
              <p className="text-xs text-gray-400">Push notifications when @mentioned</p>
            </div>
            <Toggle
              checked={notifications.mentions}
              onChange={(v) => setNotifications((p) => ({ ...p, mentions: v }))}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Security Alerts</p>
              <p className="text-xs text-gray-400">Critical login & permission changes</p>
            </div>
            <Toggle
              checked={notifications.securityAlerts}
              onChange={(v) => setNotifications((p) => ({ ...p, securityAlerts: v }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
