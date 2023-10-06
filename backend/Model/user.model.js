const mongoose = require("mongoose");
const {Schema}   = mongoose;


/* The code snippet is defining a Mongoose schema for a user in a database. The schema includes the
following fields: */
const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    tiktaktoe_state:{
        type:[],
        default:['','','','','','','','',''],   // An array that depicts the sttate of the board 
                                                // when the user quits before completing the game
    },
    tiktaktoe_score:{
        type:[],                // This Array store three values i: Number of times user won
        default:[0,0,0],        //                              ii: Number of times AI Won 
    },                          //                             iii: Number of times Game Tied
    snake_ladder_state:{
        type:[],                // This has Two values the positoin of AI and user when the game was exit
        default:[0,0,0]         // and the value at the end will state whose turn it was last time ?
    },
    snake_ladder_score:{
        type:[],                // 0th index : Number of times AI won the game
        default:[0,0]           // 1st index : Number of times user won the game
    }
});


const User = mongoose.model("User",userSchema);
module.exports = User;

