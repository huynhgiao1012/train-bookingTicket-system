const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { jwtAuth } = require("../middleware/jwtAuth");
const { basicAuth } = require("../middleware/basicAuth");
router.post("/bookTicket", jwtAuth, ticketController.bookTicket);
router.post(
  "/searchTicketByMail",
  jwtAuth,
  ticketController.searchTicketByMail
);
router.get("/getTicket", jwtAuth, ticketController.getTicket);
router.get("/getUnpaidTicket", jwtAuth, ticketController.getUnpaidTicket);
router.get("/getPaidTicket", jwtAuth, ticketController.getPaidTicket);
router.delete("/:id", jwtAuth, ticketController.deleteTicket);
router.post("/checkBalance/:id", jwtAuth, ticketController.checkBalance);
router.post("/payTicket/:id", jwtAuth, ticketController.payTicket);
module.exports = router;
