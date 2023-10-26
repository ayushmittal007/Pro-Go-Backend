const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const {errorMiddleware} = require("./middlewares/errorHandling");
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended : true}))
const authRouter =  require("./Routes/routes");
app.use(errorMiddleware);
app.use("/api/auth",authRouter,errorMiddleware);
app.use(cors,({
  origin : '*',
  credentials : true,
  optionsSuccessStatus : 200
}));

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