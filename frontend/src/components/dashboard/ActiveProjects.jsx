import { useNavigate, useParams } from 'react-router-dom';
import { formatDueDate } from '../../utils/formatDate';
import Avatar from '../common/Avatar';

const ActiveProjects = ({ projects = [] }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          🚀 Active Projects
        </h3>
        <button
          onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-5">
        {projects.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">No active projects yet.</p>
        )}
        {projects.map((project) => (
          <div
            key={project._id}
            className="cursor-pointer border-l-2 border-primary-500 pl-4"
            onClick={() => navigate(`/workspaces/${workspaceId}/projects/${project._id}`)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{project.name}</p>
                <p className="text-sm text-gray-500">
                  {project.dueDate ? `Due ${formatDueDate(project.dueDate)}` : 'No due date'}
                </p>
              </div>
              <div className="flex -space-x-2">
                {(project.members || []).slice(0, 3).map((m) => (
                  <Avatar key={m.user?._id || m.user} user={m.user} size="xs" />
                ))}
              </div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-600 transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs font-medium text-gray-500">
              {project.progress || 0}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjects;
