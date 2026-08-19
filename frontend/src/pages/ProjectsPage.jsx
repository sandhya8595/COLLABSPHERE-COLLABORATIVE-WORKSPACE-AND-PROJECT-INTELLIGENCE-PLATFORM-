import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { taskService } from '../services/task.service';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  planning: 'bg-gray-100 text-gray-700',
  active: 'bg-emerald-100 text-emerald-700',
  on_hold: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-400',
};

const ProjectsPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const loadProjects = () => {
    setLoading(true);
    taskService
      .getProjects(workspaceId)
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (workspaceId) loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleCreate = async () => {
    if (!newProject.name.trim()) return;
    try {
      await taskService.createProject({ ...newProject, workspaceId });
      toast.success('Project created!');
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 && (
          <p className="col-span-full py-12 text-center text-gray-400">
            No projects yet. Create your first one to get started.
          </p>
        )}
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`${project._id}`)}
            className="cursor-pointer rounded-xl border border-gray-100 bg-white p-5 hover:border-primary-200 hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  STATUS_COLORS[project.status]
                }`}
              >
                {project.status?.replace('_', ' ')}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-gray-500">{project.description}</p>
            {project.dueDate && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={12} />
                Due {new Date(project.dueDate).toLocaleDateString()}
              </p>
            )}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary-600"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Project">
        <div className="space-y-4">
          <input
            value={newProject.name}
            onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
            placeholder="Project name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
          />
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description (optional)"
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500"
          />
          <button
            onClick={handleCreate}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Create Project
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
