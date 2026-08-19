const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { searchAll } = require('../services/search.service');

// GET /api/v1/search?q=...&workspaceId=...&types=tasks,documents&dateFrom=&dateTo=
const globalSearch = catchAsync(async (req, res) => {
  const { q, workspaceId, types, dateFrom, dateTo } = req.query;

  if (!q || q.trim().length < 2) {
    throw new ApiError(400, 'Search query must be at least 2 characters.');
  }

  const results = await searchAll({
    query: q.trim(),
    workspaceId,
    userId: req.user._id,
    filters: {
      dateFrom,
      dateTo,
      types: types ? types.split(',') : null,
    },
  });

  res.status(200).json(new ApiResponse(200, { query: q, results }));
});

module.exports = { globalSearch };
