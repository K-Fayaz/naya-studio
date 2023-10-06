const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
    .then((data)=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log(err)
    })