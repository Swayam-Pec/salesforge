// Search controller - full-text search across all entities.
const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const { searchEntities } = require("../utils/search");

const search = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;
  if (!q || q.length < 2) return response.success(res, { results: [], total: 0, query: q });
  const result = await searchEntities(req.orgId, q, { limit: Number(limit) });
  return response.success(res, { ...result, query: q });
});

const suggest = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 1) return response.success(res, { suggestions: [] });
  // Return quick suggestions based on common patterns
  const suggestions = [
    `${q} deals`,
    `${q} leads`,
    `${q} contacts`,
    `${q} accounts`,
  ];
  return response.success(res, { suggestions });
});

module.exports = { search, suggest };
