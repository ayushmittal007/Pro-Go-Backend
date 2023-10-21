const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const notesRouter = require("./Routes/routes");

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use("/api/auth", require("./Routes/routes"))
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