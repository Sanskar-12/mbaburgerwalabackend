import express from "express"
import passport from "passport"
import { Adminusers, adminStats, logout, profile } from "../controllers/User.js"
import { adminAuth, isAuthenticated } from "../middlewares/auth.js"


const router=express.Router()

router.get("/googlelogin",passport.authenticate("google",{scope:["profile"]}))

router.get("/login",passport.authenticate("google"),(req,res)=>{
    res.send("Logged In")
})

router.get("/me",isAuthenticated,profile)

router.get("/logout",logout)

//admin
router.get("/admin/users",isAuthenticated,adminAuth,Adminusers)

router.get("/admin/stats",isAuthenticated,adminAuth,adminStats)

export default router