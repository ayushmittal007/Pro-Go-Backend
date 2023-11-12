const express = require("express");
const mongoose = require("mongoose");
const {errorMiddleware} = require("./middlewares/errorHandling");
require('dotenv').config();

const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended : true}))

const path = require("path");
const staticPath = path.join(__dirname, "./views");
app.use(express.static(staticPath));
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const {authRouter , userRouter , boardRouter, listRouter, cardRouter , paymentRouter , searchRouter } =  require("./Routes");

app.use(errorMiddleware);
app.use("/api/auth",authRouter,errorMiddleware);
app.use("/api", userRouter , errorMiddleware);
app.use("/api/board" , boardRouter , errorMiddleware);
app.use("/api/list" , listRouter , errorMiddleware);
app.use("/api/card" , cardRouter , errorMiddleware);
app.use("/payment" , paymentRouter);
app.use("/api" ,searchRouter);

const PORT=process.env.PORT || 5000

//connecting with Database
const DB = process.env.MONGODB_URI
const dbConnect = async function (){
  await mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
    console.log("success , database connected")
})
.catch((e)=>{
    console.log(e)
})
}
dbConnect();

app.listen(PORT, () => {
  console.log(`Connection is at port ${PORT}`);
});