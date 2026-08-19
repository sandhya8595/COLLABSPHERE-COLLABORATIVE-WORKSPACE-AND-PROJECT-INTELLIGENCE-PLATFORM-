const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { Project, Board, Column } = require('../models');

// POST /api/v1/projects
const createProject = catchAsync(async (req, res) => {
  const { name, description, workspaceId, dueDate } = req.body;

  const project = await Project.create({
    name,
    description,
    workspace: workspaceId,
    dueDate,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  // Auto-create a default board with standard columns
  const board = await Board.create({ name: `${name} Board`, project: project._id });

  const defaultColumns = ['To Do', 'In Progress', 'Review', 'Done'];
  const columns = await Column.insertMany(
    defaultColumns.map((colName, idx) => ({
      name: colName,
      board: board._id,
      order: idx,
    }))
  );

  board.columnOrder = columns.map((c) => c._id);
  await board.save();

  await req.audit('project_create', 'Project', project._id);

  res.status(201).json(new ApiResponse(201, { project, board }, 'Project created.'));
});

// GET /api/v1/projects?workspaceId=...
const getProjects = catchAsync(async (req, res) => {
  const { workspaceId } = req.query;
  if (!workspaceId) throw new ApiError(400, 'workspaceId query param is required.');

  const projects = await Project.find({ workspace: workspaceId }).sort('-updatedAt');
  res.status(200).json(new ApiResponse(200, { projects }));
});

// GET /api/v1/projects/:id
const getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'members.user',
    'firstName lastName avatar'
  );
  if (!project) throw new ApiError(404, 'Project not found.');

  const boards = await Board.find({ project: project._id });

  res.status(200).json(new ApiResponse(200, { project, boards }));
});

// PATCH /api/v1/projects/:id
const updateProject = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'description', 'status', 'dueDate', 'progress'];
  const updates = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!project) throw new ApiError(404, 'Project not found.');

  await req.audit('project_update', 'Project', project._id);

  res.status(200).json(new ApiResponse(200, { project }, 'Project updated.'));
});

// DELETE /api/v1/projects/:id
const archiveProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status: 'archived' },
    { new: true }
  );
  if (!project) throw new ApiError(404, 'Project not found.');

  await req.audit('project_archive', 'Project', project._id);

  res.status(200).json(new ApiResponse(200, { project }, 'Project archived.'));
});

module.exports = { createProject, getProjects, getProjectById, updateProject, archiveProject };
