import ErrorHandler from "../utils/ErrorClass.js"

export const isAuthenticated=(req,res,next)=>{
    const token=req.cookies["connect.sid"]

    if(!token)
    {
        return next(new ErrorHandler("Not Logged In",401))
    }


    next()
}

export const adminAuth=(req,res,next)=>{
    if(req.user.role==="user")
    {
        return next(new ErrorHandler("User cannot access this Resource",400))
    }

    next()
}

export const catchAsyncError=(passedFunction)=>(req,res,next)=>{
    Promise.resolve(passedFunction(req,res,next)).catch(next)
}