const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/teamController");
const { protect } = require("../middleware/authMiddleware");
const tenantScope = require("../middleware/tenant");
const { permit } = require("../middleware/rbac");

router.use(protect, tenantScope);

// Organization settings
router.get("/org", ctrl.getOrg);
router.patch("/org", permit("OWNER", "ADMIN"), ctrl.updateOrg);

// Members
router.get("/members", ctrl.listMembers);
router.patch("/members/:id", permit("OWNER", "ADMIN"), ctrl.updateMemberRole);
router.delete("/members/:id", permit("OWNER", "ADMIN"), ctrl.removeMember);

// Invites
router.get("/invites", ctrl.listInvites);
router.post("/invites", permit("OWNER", "ADMIN"), ctrl.sendInvite);
router.delete("/invites/:id", permit("OWNER", "ADMIN"), ctrl.revokeInvite);
router.post("/invites/accept", ctrl.acceptInvite);
router.get("/invites/preview/:token", ctrl.previewInvite);

module.exports = router;
