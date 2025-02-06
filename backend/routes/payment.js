const express = require("express");
const { LoginAuthenticator } = require("../middlewares/auth");
const { createOrder, verifyPayment } = require("../service/razorpay");
const router = express.Router();

router.post("/create-order",LoginAuthenticator,createOrder);
router.post('/verify-payment',LoginAuthenticator,verifyPayment)


module.exports = router
