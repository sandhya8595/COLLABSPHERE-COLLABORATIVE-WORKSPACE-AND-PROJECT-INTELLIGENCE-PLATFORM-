import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trash2, UserPlus } from 'lucide-react';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import { workspaceService } from '../../services/workspace.service';
import { ROLE_LABELS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  workspace_admin: 'bg-purple-100 text-purple-700',
  project_manager: 'bg-blue-100 text-blue-700',
  member: 'bg-gray-100 text-gray-700',
  guest: 'bg-amber-100 text-amber-700',
};

const TeamMembers = ({ onRefresh }) => {
  const { workspaceId } = useParams();
  const { activeWorkspace } = useSelector((state) => state.workspace);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleInvite = async () => {
    try {
      await workspaceService.inviteMember(workspaceId, { email });
      toast.success('Invitation sent.');
      setEmail('');
      setIsModalOpen(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite member.');
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member from the workspace?')) return;
    try {
      await workspaceService.removeMember(workspaceId, userId);
      toast.success('Member removed.');
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const members = activeWorkspace?.members || [];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-500">Manage who has access to this workspace.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <UserPlus size={15} />
          Invite
        </button>
      </div>

      {activeWorkspace?.inviteCode && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50/50 p-3.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-900">
              Workspace Join Code
            </p>
            <p className="text-sm font-mono font-bold text-primary-700">{activeWorkspace.inviteCode}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(activeWorkspace.inviteCode);
              toast.success('Workspace join code copied!');
            }}
            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm hover:bg-primary-50"
          >
            Copy Code
          </button>
        </div>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="pb-2 font-medium">User</th>
            <th className="pb-2 font-medium">Role</th>
            <th className="pb-2 font-medium">Last Active</th>
            <th className="pb-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.user._id} className="border-b border-gray-50 last:border-0">
              <td className="flex items-center gap-2.5 py-3">
                <Avatar user={m.user} size="sm" />
                <div>
                  <p className="font-medium text-gray-800">
                    {m.user.firstName} {m.user.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{m.user.email}</p>
                </div>
              </td>
              <td>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    ROLE_BADGE[m.role] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ROLE_LABELS[m.role] || m.role}
                </span>
              </td>
              <td className="text-gray-500">{formatRelativeTime(m.joinedAt)}</td>
              <td>
                <button
                  onClick={() => handleRemove(m.user._id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Member">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Invite via Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
            />
          </div>
          <button
            onClick={handleInvite}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Send Email Invitation
          </button>

          {activeWorkspace?.inviteCode && (
            <div className="border-t border-gray-100 pt-3">
              <p className="mb-1 text-xs font-medium text-gray-500">Or Share Workspace Join Code</p>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 border border-gray-200">
                <span className="font-mono text-sm font-bold text-gray-800">
                  {activeWorkspace.inviteCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeWorkspace.inviteCode);
                    toast.success('Join code copied!');
                  }}
                  className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-primary-600 shadow-sm border border-gray-200 hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TeamMembers;
