import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { taskService } from '../services/task.service';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Loader from '../components/common/Loader';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [boardId, setBoardId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService
      .getProjectById(projectId)
      .then((res) => {
        const boards = res.data.boards;
        if (boards?.length) setBoardId(boards[0]._id);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <Loader />;
  if (!boardId) return <p className="py-12 text-center text-gray-400">No board found for this project.</p>;

  return <KanbanBoard boardId={boardId} />;
};

export default ProjectDetailPage;
