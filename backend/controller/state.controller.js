const User = require("../Model/user.model");



/**
 * The function updates the tic-tac-toe state of a user in a database.
 * @param data - The `data` parameter is an object that contains the necessary information to update
 * the state of the tic-tac-toe game. It should have the following properties:
 */
const update_state_tik_tak = async(data)=>{
    try{
        const user = await User.findOne({username: data.user});
        if(user)
        {
            user.tiktaktoe_state = data.board;
            console.log("After updating state is ",user.tiktaktoe_state);
            await user.save();
        }else{
            console.log("No user found");
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

/**
 * The function `game_over_tiktak` resets the tic-tac-toe game state for a user and updates their score
 * based on the game outcome.
 * @param username - The username of the user whose game state needs to be updated.
 * @param state - The state parameter represents the outcome of the game. It can have one of the
 * following values:
 */
const game_over_tiktak = async(username,state)=>{
    try{
        // if status: 0 User WON
        // if status: 1 AI WON
        // if status: 2 tied

        const user = await User.findOne({ username });
        if(user)
        {
            console.log(user);
            user.tiktaktoe_state = ['','','','','','','','',''];
            // let score = user.tiktaktoe_score;
            // score[state] += 1;
            // user.tiktaktoe_score = score;
            await user.save();
            console.log("Updated Score tiktaktoe is ",user.tiktaktoe_score);
        }else{
            console.log("No user found with this username",username);
        }
    }
    catch(err){
        console.log(err);
        console.log("Something Went Wrong!!");
    }
}


/**
 * The function `get_tik_tak_toe_state` is an asynchronous function that retrieves the tic-tac-toe
 * state and score of a user based on their username.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes properties such as `query` (an object containing the query
 * parameters), `body` (the request body), and more.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending data, and setting headers.
 */
const get_tik_tak_toe_state = async(req,res)=>{
    try{
        const { username } = req.query;
        console.log(req.body);
        const user = await User.findOne({ username });
        console.log(user);
        if(user)
        {
            res.status(200).send({ board: user.tiktaktoe_state , score: user.tiktaktoe_score });
        }else{
            console.log("No User found with this username!");
        }
    }
    catch(err)
    {
        console.log("Something Went Wrong! ",err);
        res.status(500).send({
            message:"Something Went Wrong",
        })
    }
}


/**
 * The function `update_snake_ladder_state` updates the state of a snake and ladder game for a specific
 * user in a database.
 * @param data - The `data` parameter is an object that contains information about the user and their
 * position in the snake and ladder game. It has the following properties:
 * @param username - The username parameter is the username of the user whose snake ladder state needs
 * to be updated.
 */
const update_snake_ladder_state = async(data,username)=>{
    try{
        const user = await User.findOne({ username: username });
        if(user)
        {
            let state = user.snake_ladder_state;
            state[data.user] = data.position;
            if(data.user)
                state[2] = 0;
            else{
                state[2] = 1;
            }
            user.snake_ladder_state = state;
            console.log("Updated snake ladder state is ",user.snake_ladder_state);
            await user.save();
        }else{
            console.log("Unable to Find the user with username ",username);
        }
    }
    catch(err)
    {
        console.log("Something Went Wrong !",err);
    }
}

/**
 * The function `update_snake_ladder_score` updates the snake ladder score of a user in a database.
 * @param data - The `data` parameter is an object that contains information about the user's score in
 * the snake and ladder game. It likely has a property called `user` which represents the user's name
 * or identifier.
 * @param username - The username parameter is the username of the user whose snake and ladder score
 * needs to be updated.
 */
const update_snake_ladder_score = async(data,username)=>{
    try{

        const user = await User.findOne({ username });
        if(user)
        {
            let score = user.snake_ladder_score;
            score[data.user] += 1;
            user.snake_ladder_score = score;
            user.snake_ladder_state = [0,0,0];
            console.log("Updated score of the user is ",user.snake_ladder_score);
            await user.save();
        }else{
            console.log("Could Not find user with username ",username);
        }
    }
    catch(err)
    {
        console.log("Something Went Wrong While saving data",err);
    }
}

/**
 * The function `get_snake_ladder_state` retrieves the state and score of a user in a snake and ladder
 * game based on their username.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made by the client. It includes details such as the request method, headers, query
 * parameters, and body.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending data, and setting headers.
 */
const get_snake_ladder_state = async(req,res)=>{
    try{
        const { username } = req.query;
        const user = await User.findOne({ username });
        if(user)
        {
            res.status(200).send({
                payload:{
                    state: user.snake_ladder_state,
                    score: user.snake_ladder_score,
                }
            })
        }else{
            console.log("No user was found with this username",username);
            res.status(404).send({
                message: "No user found with username '"+username+"'",
            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports = {
    update_state_tik_tak,
    game_over_tiktak,
    get_tik_tak_toe_state,
    get_snake_ladder_state,
    update_snake_ladder_state,
    update_snake_ladder_score,
}