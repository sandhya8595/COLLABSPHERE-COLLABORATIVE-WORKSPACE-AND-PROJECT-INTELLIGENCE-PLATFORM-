import Avatar from '../common/Avatar';
import { formatRelativeTime } from '../../utils/formatDate';

const CommentsPanel = ({ comments = [] }) => {
  return (
    <div className="w-72 flex-shrink-0 border-l border-gray-100 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Comments</p>
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400">Select text and add a comment to start a discussion.</p>
        )}
        {comments.map((c) => (
          <div key={c._id} className="rounded-lg border border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <Avatar user={c.author} size="xs" />
              <span className="text-xs font-semibold text-gray-900">
                {c.author?.firstName} {c.author?.lastName}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-gray-700">{c.content}</p>
            <p className="mt-1 text-[11px] text-gray-400">{formatRelativeTime(c.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPanel;
