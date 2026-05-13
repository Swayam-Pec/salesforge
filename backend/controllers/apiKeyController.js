const { prisma } = require("../config/postgres");
const { AppError } = require("../middleware/errorHandler");
const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const apiKeyService = require("../services/apiKeyService");
const { incrementUsage } = require("../services/usageService");

const list = asyncHandler(async (req, res) => {
  const items = await apiKeyService.listApiKeys(req.orgId);
  return response.success(res, items);
});

const create = asyncHandler(async (req, res) => {
  const { name, scopes, expiresAt } = req.body;
  if (!name) throw new AppError("A name is required for the API key.", 400);
  const apiKey = await apiKeyService.createApiKey({
    name,
    scopes: scopes || "read,write",
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    userId: req.user.id,
    orgId: req.orgId,
  });
  await incrementUsage({ userId: req.user.id, orgId: req.orgId, resource: "apiKeys" });
  // Only the raw key is returned once - the client must store it securely.
  return response.created(res, apiKey);
});

const revoke = asyncHandler(async (req, res) => {
  await apiKeyService.revokeApiKey(req.orgId, req.params.id);
  return response.success(res, { message: "API key revoked." });
});

module.exports = { list, create, revoke };
