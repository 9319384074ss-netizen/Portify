const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/portify")
.then(()=>console.log("DB Connected"));

/* MODELS */
const User = mongoose.model("User", {
  username:String,
  password:String
});

const Portfolio = mongoose.model("Portfolio", {
  username:String,
  name:String,
  about:String,
  skills:String,
  projects:[String]
});

/* SIGNUP */
app.post("/signup", async(req,res)=>{
  await User.create(req.body);
  res.send("User created");
});

/* LOGIN */
app.post("/login", async(req,res)=>{
  const user = await User.findOne(req.body);
  if(!user) return res.status(400).send("Invalid");
  res.send("Login success");
});

/* SAVE PORTFOLIO */
app.post("/save", async(req,res)=>{
  await Portfolio.findOneAndUpdate(
    { username:req.body.username },
    req.body,
    { upsert:true }
  );
  res.send("Saved");
});

/* GET PUBLIC PORTFOLIO */
app.get("/u/:username", async(req,res)=>{
  const data = await Portfolio.findOne({username:req.params.username});
  res.json(data);
});

app.listen(3000,()=>console.log("Server running"));
