import express, { urlencoded } from "express";
import { config } from "dotenv";
import UserRouter from "./routes/Userroute.js";
import { connectPassport } from "./utils/Provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware.js";
import OrderRoute from "./routes/Orderroute.js"
import cors from "cors"

const app = express();
config({ path: "./config/config.env" });

//middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie:{
      secure:process.env.NODE_ENV==="Development"? false:true,
      sameSite:process.env.NODE_ENV==="Development"? false:"none",
      httpOnly:process.env.NODE_ENV==="Development"? false:true,
    }
  })
);
app.use(express.json())
app.use(urlencoded({
  extended:true
}))
app.use(cors({
  credentials:true,
  origin:[process.env.FRONTEND_URL],
  methods:["GET","POST","PUT","DELETE"],  
}))
app.use(cookieParser())
app.use(passport.authenticate("session"))
app.use(passport.initialize())
app.use(passport.session())

connectPassport();

app.use("/api/v1", UserRouter);
app.use("/api/v1",OrderRoute)

export default app;

app.use(ErrorMiddleware)
