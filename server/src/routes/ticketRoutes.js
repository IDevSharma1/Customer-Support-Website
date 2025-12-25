const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  createTicket,
  getMyTickets,
  getMyTicketById,
} = require('../controllers/ticketController');

const router = express.Router();

router.use(authJwt);

router.post('/', createTicket);
router.get('/', getMyTickets);
router.get('/:id', getMyTicketById);

module.exports = router;
