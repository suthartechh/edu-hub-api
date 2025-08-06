import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { log } from 'console';
import User from '../models/User.js';

dotenv.config(); // Needed to load .env variables

const router = express.Router();


const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET,
});

// ROUTE 1 : Create Order Api Using POST Method http://localhost:4000/api/payment/order
router.post('/order', (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
            console.log(order)
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:4000/api/payment/verify
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, courseId } = req.body;

    
  
    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
  
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(sign.toString())
        .digest("hex");
  
      const isAuthentic = expectedSign === razorpay_signature;
  
      if (isAuthentic) {
        // Save Payment if you still want (optional)
        // const payment = new Payment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        // await payment.save();
  
        // ✅ Update the user's purchasedCourses
        await User.findByIdAndUpdate(userId, {
          $addToSet: { purchasedCourses: courseId } // prevents duplicates
        });
  
        return res.status(200).json({ message: "Payment verified and course added!" });
      } else {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

export default router;
