const express = require("express");
const router = express.Router();
const {
  addGuestOrder,
} = require("../controller/guestOrderController");

//add a order
router.post("/add", addGuestOrder);

module.exports = router;
