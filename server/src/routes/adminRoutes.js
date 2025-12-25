const express = require("express");
const authJwt = require("../middleware/authJwt");
const roleCheck = require("../middleware/roleCheck");
const {
  getAllTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  addAdminComment,
} = require("../controllers/adminController");
const { getUsersForAdmin } = require("../controllers/userController");

const router = express.Router();

router.use(authJwt);
router.use(roleCheck('admin'));

router.get("/tickets", getAllTickets);
// Admin: get a specific ticket by id
router.get("/tickets/:id", getTicketById);
router.patch("/tickets/:id/assign", assignTicket);
router.patch("/tickets/:id/status", updateTicketStatus);
router.post("/tickets/:id/comments", addAdminComment);

router.get('/users', getUsersForAdmin);

module.exports = router;

