import { formatFullDate } from '../../utils/formatDate';
import Avatar from '../common/Avatar';

const VersionHistory = ({ versions = [], onRestore, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 border-l border-gray-100 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Version History</h3>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
          Close
        </button>
      </div>

      <div className="space-y-3">
        {versions.length === 0 && (
          <p className="text-sm text-gray-400">No saved versions yet.</p>
        )}
        {versions.map((v) => (
          <div key={v._id} className="rounded-lg border border-gray-100 p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar user={v.editedBy} size="xs" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{v.versionLabel}</p>
                  <p className="text-xs text-gray-400">{formatFullDate(v.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => onRestore(v._id)}
                className="text-xs font-semibold text-primary-600 hover:underline"
              >
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;
