import { formatRelativeTime } from '../../utils/formatDate';

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
        🕐 Activity Feed
      </h3>

      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">No recent activity.</p>
        )}
        {activities.map((activity, idx) => (
          <div key={activity._id || idx} className="flex gap-3">
            <span
              className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                activity.color || 'bg-primary-500'
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{activity.actor}</span>{' '}
                {activity.action}{' '}
                {activity.target && (
                  <span className="font-medium text-primary-600">{activity.target}</span>
                )}
              </p>
              {activity.quote && (
                <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-xs italic text-gray-500">
                  &quot;{activity.quote}&quot;
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
