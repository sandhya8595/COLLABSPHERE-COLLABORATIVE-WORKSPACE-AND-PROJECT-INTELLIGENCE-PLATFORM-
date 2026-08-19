const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const analyticsService = require('../services/analytics.service');

// GET /api/v1/analytics/:workspaceId/overview?range=7days|30days|year
const getOverview = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const { range = '7days' } = req.query;

  const overview = await analyticsService.getWorkspaceOverview(workspaceId, range);
  res.status(200).json(new ApiResponse(200, overview));
});

// GET /api/v1/analytics/:workspaceId/task-completion?range=7days
const getTaskCompletionTrend = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const { range = '7days' } = req.query;

  const trend = await analyticsService.getTaskCompletionTrend(workspaceId, range);
  res.status(200).json(new ApiResponse(200, { trend }));
});

// GET /api/v1/analytics/:workspaceId/team-workload
const getTeamWorkload = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const workload = await analyticsService.getTeamWorkload(workspaceId);
  res.status(200).json(new ApiResponse(200, { workload }));
});

module.exports = { getOverview, getTaskCompletionTrend, getTeamWorkload };
