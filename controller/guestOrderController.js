require("dotenv").config();
const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work

const {  addOrder } = require("./customerOrderController");

const addGuestOrder = async (req, res) => {
  addOrder(req, res)
};

module.exports = {
  addGuestOrder,
};
