import { catchAsyncError } from "../middlewares/auth.js";
import { Contact } from "../models/Contact.js";

export const contact=catchAsyncError(async(req,res,next)=>{
    const {name,email,message}=req.body

    await Contact.create({
        name,email,message
    })

    res.status(200).json({
        success:true,
        message:"Your Feedback has been sent"
    })

})