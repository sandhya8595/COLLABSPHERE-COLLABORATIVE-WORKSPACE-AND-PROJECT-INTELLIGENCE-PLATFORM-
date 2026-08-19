const { Task, Board, Project, Document, Message, Chat, Workspace } = require('../models');

const getDateRangeStart = (range) => {
  const now = new Date();
  if (range === '30days') return new Date(now.setDate(now.getDate() - 30));
  if (range === 'year') return new Date(now.setFullYear(now.getFullYear() - 1));
  return new Date(now.setDate(now.getDate() - 7)); // default: last 7 days
};

const getWorkspaceBoardIds = async (workspaceId) => {
  const projectIds = await Project.find({ workspace: workspaceId }).distinct('_id');
  return Board.find({ project: { $in: projectIds } }).distinct('_id');
};

const getTaskCompletionTrend = async (workspaceId, range) => {
  const boardIds = await getWorkspaceBoardIds(workspaceId);
  const startDate = getDateRangeStart(range);

  // "Done" completion inferred by column name; a real system might use a `isDoneColumn` flag
  const trend = await Task.aggregate([
    { $match: { board: { $in: boardIds }, updatedAt: { $gte: startDate }, isArchived: false } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return trend.map((t) => ({ date: t._id, count: t.count }));
};

const getTeamWorkload = async (workspaceId) => {
  const boardIds = await getWorkspaceBoardIds(workspaceId);

  const workload = await Task.aggregate([
    { $match: { board: { $in: boardIds }, isArchived: false } },
    { $unwind: '$assignees' },
    { $group: { _id: '$assignees', taskCount: { $sum: 1 } } },
    { $sort: { taskCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: { $concat: ['$user.firstName', ' ', { $ifNull: ['$user.lastName', ''] }] },
        avatar: '$user.avatar',
        taskCount: 1,
      },
    },
  ]);

  return workload;
};

const getWorkspaceOverview = async (workspaceId, range = '7days') => {
  const workspace = await Workspace.findById(workspaceId);
  const boardIds = await getWorkspaceBoardIds(workspaceId);
  const startDate = getDateRangeStart(range);

  const [totalTasks, completedThisPeriod, totalDocuments, chatCount, messageCount] = await Promise.all([
    Task.countDocuments({ board: { $in: boardIds }, isArchived: false }),
    Task.countDocuments({
      board: { $in: boardIds },
      isArchived: false,
      updatedAt: { $gte: startDate },
    }),
    Document.countDocuments({ workspace: workspaceId, isArchived: false }),
    Chat.countDocuments({ workspace: workspaceId }),
    Message.countDocuments({ chat: { $in: await Chat.find({ workspace: workspaceId }).distinct('_id') } }),
  ]);

  const activeMembers = workspace ? workspace.members.length : 0;

  // Simple heuristic productivity score
  const productivityScore =
    totalTasks > 0 ? Math.min(100, Math.round((completedThisPeriod / totalTasks) * 100)) : 0;

  return {
    productivityScore,
    activeMembers,
    totalTasks,
    completedThisPeriod,
    totalDocuments,
    chatCount,
    messageCount,
    storageUsedMB: workspace ? workspace.storageUsedMB : 0,
    storageQuotaMB: workspace ? workspace.storageQuotaMB : 0,
  };
};

module.exports = { getTaskCompletionTrend, getTeamWorkload, getWorkspaceOverview };
