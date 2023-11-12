const Razorpay = require('razorpay');
require("dotenv").config();
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;
var crypto = require("crypto");
const {ErrorHandler} = require("../middlewares/errorHandling");

const createOrder = async (req, res, next) => {
    try {
        console.log(`inside createOrder`);
        const razorpayInstance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET_KEY
        });

        const options = {
            amount: 500 * 100,
            currency: "INR",
            partial_payment: false,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);
        console.log(`The order is created`)
        return res.status(200).json({ 
            success:true,
            message :'Order Created',
            order_id:order.id,
            key_id:RAZORPAY_KEY_ID,                
            createdAt : Date.now(),
            order: order
        });   

     } catch (error) {
        console.log(error);
        next(error);
    }
};

async function checkPayment(req, res) {
    console.log("inside checkPayment")
    // console.log(`req.body.order_id is ${req.body.order_id}`)
    // console.log(`req.body.payment_id is ${req.body.payment_id}`)

    body = req.body.order_id + "|" + req.body.payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest("hex");

    console.log("sig" + req.body.signature);
    console.log("sig" + expectedSignature);

    if (expectedSignature === req.body.signature) {
        console.log("Payment successful");
        return res.status(200).json({ status: "success" });
    } else {
        console.log("Payment failed");
        return next(new ErrorHandler(400, 'Payment failed'));
    }   
}

module.exports = { createOrder, checkPayment };