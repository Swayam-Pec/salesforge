const { prisma } = require("../config/postgres");
const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const { recordAudit } = require("../services/auditService");

const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, action, entityType, userId } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = { orgId: req.orgId };
  if (action) where.action = action;
  if (entityType) where.entityType = entityType;
  if (userId) where.userId = Number(userId);
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  return response.paginated(res, items, total, page, limit);
});

module.exports = { list, recordAudit };
