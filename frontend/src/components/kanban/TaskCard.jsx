import { useDrag } from 'react-dnd';
import { MessageSquare, Paperclip } from 'lucide-react';
import { formatDueDate, isOverdue } from '../../utils/formatDate';
import { PRIORITY_COLORS } from '../../utils/constants';
import Avatar from '../common/Avatar';

export const TASK_ITEM_TYPE = 'TASK';

const TaskCard = ({ task, columnId, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: TASK_ITEM_TYPE,
    item: { taskId: task._id, sourceColumnId: columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const checklistDone = task.checklist?.filter((c) => c.isDone).length || 0;
  const checklistTotal = task.checklist?.length || 0;
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      ref={dragRef}
      onClick={() => onClick(task)}
      className={`cursor-pointer rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {task.priority && (
        <span
          className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {task.priority}
        </span>
      )}

      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{task.description}</p>
      )}

      {(task.dueDate || checklistTotal > 0) && (
        <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-400">
          {task.dueDate && (
            <span className={overdue ? 'font-semibold text-red-500' : ''}>
              {overdue ? '⚠ ' : ''}
              {formatDueDate(task.dueDate)}
            </span>
          )}
          {checklistTotal > 0 && (
            <span>
              {checklistDone}/{checklistTotal}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {(task.assignees || []).slice(0, 3).map((user) => (
            <Avatar key={user._id} user={user} size="xs" />
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-0.5 text-xs">
              <Paperclip size={12} />
              {task.attachments.length}
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs">
              <MessageSquare size={12} />
              {task.commentCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
