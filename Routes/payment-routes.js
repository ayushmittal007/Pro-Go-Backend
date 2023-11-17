const express = require("express");
const paymentRouter = express.Router();
const { paymentController } = require("../controllers");
const auth = require("../middlewares/auth");

paymentRouter.get("/", (req, res)=>{
    res.render("makePayment")
})

paymentRouter.post("/createOrder" , auth , paymentController.createOrder)

paymentRouter.post("/checkPayment", auth ,paymentController.checkPayment)

module.exports = paymentRouter;