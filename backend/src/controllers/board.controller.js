const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { Board, Column, Task } = require('../models');

// GET /api/v1/boards/:boardId  (full board with columns + tasks, ordered)
const getBoardWithTasks = catchAsync(async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) throw new ApiError(404, 'Board not found.');

  const columns = await Column.find({ board: board._id }).sort('order');

  const columnsWithTasks = await Promise.all(
    columns.map(async (column) => {
      const tasks = await Task.find({ column: column._id, isArchived: false })
        .populate('assignees', 'firstName lastName avatar')
        .lean();

      // Preserve manual drag-and-drop order defined in column.taskOrder
      const orderedTasks = column.taskOrder
        .map((taskId) => tasks.find((t) => t._id.toString() === taskId.toString()))
        .filter(Boolean);

      // Include any tasks not yet present in taskOrder (safety net)
      const missing = tasks.filter(
        (t) => !column.taskOrder.some((id) => id.toString() === t._id.toString())
      );

      return { ...column.toObject(), tasks: [...orderedTasks, ...missing] };
    })
  );

  res.status(200).json(new ApiResponse(200, { board, columns: columnsWithTasks }));
});

// POST /api/v1/boards/:boardId/columns
const createColumn = catchAsync(async (req, res) => {
  const { name, color } = req.body;
  const board = await Board.findById(req.params.boardId);
  if (!board) throw new ApiError(404, 'Board not found.');

  const column = await Column.create({
    name,
    board: board._id,
    order: board.columnOrder.length,
    color,
  });

  board.columnOrder.push(column._id);
  await board.save();

  res.status(201).json(new ApiResponse(201, { column }, 'Column created.'));
});

// PATCH /api/v1/boards/columns/:columnId
const updateColumn = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'color', 'order'];
  const updates = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const column = await Column.findByIdAndUpdate(req.params.columnId, updates, { new: true });
  if (!column) throw new ApiError(404, 'Column not found.');

  res.status(200).json(new ApiResponse(200, { column }, 'Column updated.'));
});

// DELETE /api/v1/boards/columns/:columnId
const deleteColumn = catchAsync(async (req, res) => {
  const column = await Column.findById(req.params.columnId);
  if (!column) throw new ApiError(404, 'Column not found.');

  const taskCount = await Task.countDocuments({ column: column._id, isArchived: false });
  if (taskCount > 0) {
    throw new ApiError(400, 'Cannot delete a column that still has tasks. Move or delete tasks first.');
  }

  await Board.findByIdAndUpdate(column.board, { $pull: { columnOrder: column._id } });
  await column.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Column deleted.'));
});

module.exports = { getBoardWithTasks, createColumn, updateColumn, deleteColumn };
