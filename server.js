import app from "./app.js";
import { connectDB } from "./config/database.js";
import Razorpay from "razorpay"

connectDB()

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

app.get("/",(req,res)=>{
    res.send("Working")
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is Listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})