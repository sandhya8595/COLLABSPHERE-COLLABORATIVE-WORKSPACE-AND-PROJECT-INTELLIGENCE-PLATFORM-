import { useDrop } from 'react-dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard, { TASK_ITEM_TYPE } from './TaskCard';

const KanbanColumn = ({ column, onDropTask, onTaskClick, onAddTask }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: TASK_ITEM_TYPE,
    drop: (item) => {
      if (item.sourceColumnId !== column._id) {
        onDropTask({
          taskId: item.taskId,
          sourceColumnId: item.sourceColumnId,
          destColumnId: column._id,
          destIndex: column.tasks.length,
        });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={dropRef}
      className={`flex w-72 flex-shrink-0 flex-col rounded-xl border p-3 transition-colors ${
        isOver ? 'border-primary-300 bg-primary-50/50' : 'border-gray-100 bg-gray-50'
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: column.color || '#6366f1' }}
          />
          <h3 className="text-sm font-semibold text-gray-900">{column.name}</h3>
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600">
            {column.tasks?.length || 0}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto">
        {(column.tasks || []).map((task) => (
          <TaskCard key={task._id} task={task} columnId={column._id} onClick={onTaskClick} />
        ))}
      </div>

      <button
        onClick={() => onAddTask(column._id)}
        className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100"
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
};

export default KanbanColumn;
