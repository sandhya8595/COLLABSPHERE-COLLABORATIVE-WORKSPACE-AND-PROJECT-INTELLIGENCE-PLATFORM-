const { Task, Document, Message, File, User, Workspace, TaskComment } = require('../models');

const searchAll = async ({ query, workspaceId, userId, filters = {} }) => {
  const regex = new RegExp(query, 'i');
  const { dateFrom, dateTo, types } = filters;

  const dateFilter = {};
  if (dateFrom) dateFilter.$gte = new Date(dateFrom);
  if (dateTo) dateFilter.$lte = new Date(dateTo);

  const shouldSearch = (type) => !types || types.includes(type);

  const results = {};

  if (shouldSearch('tasks')) {
    const taskQuery = { title: regex, board: { $exists: true } };
    if (Object.keys(dateFilter).length) taskQuery.createdAt = dateFilter;
    results.tasks = await Task.find(taskQuery).limit(10).select('title priority dueDate column');
  }

  if (shouldSearch('documents')) {
    const docQuery = { workspace: workspaceId, title: regex, isArchived: false };
    if (Object.keys(dateFilter).length) docQuery.createdAt = dateFilter;
    results.documents = await Document.find(docQuery).limit(10).select('title updatedAt tags');
  }

  if (shouldSearch('files')) {
    const fileQuery = { workspace: workspaceId, originalName: regex };
    if (Object.keys(dateFilter).length) fileQuery.createdAt = dateFilter;
    results.files = await File.find(fileQuery).limit(10).select('originalName mimeType size');
  }

  if (shouldSearch('chats')) {
    results.messages = await Message.find({ content: { $regex: regex }, isDeleted: false })
      .limit(10)
      .select('content chat createdAt sender')
      .populate('sender', 'firstName lastName avatar');
  }

  if (shouldSearch('users')) {
    results.users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    })
      .limit(10)
      .select('firstName lastName email avatar');
  }

  if (shouldSearch('workspaces')) {
    results.workspaces = await Workspace.find({ name: regex, isActive: true })
      .limit(10)
      .select('name slug description');
  }

  if (shouldSearch('comments')) {
    results.comments = await TaskComment.find({ content: regex })
      .limit(10)
      .select('content task author')
      .populate('author', 'firstName lastName avatar');
  }

  return results;
};

module.exports = { searchAll };
