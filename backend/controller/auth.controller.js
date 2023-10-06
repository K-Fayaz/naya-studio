const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../Model/user.model");

/**
 * The Login function is an asynchronous function that handles user login and registration, creating a
 * new user if the username doesn't exist and verifying the password if the username exists.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is used to
 * retrieve data sent by the client and to send a response back to the client.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, headers, and sending the response body.
 */
const Login = async(req,res)=>{
    try{

        let { username , password } = req.body;

        // find if there is already a user with this username
        const user = await User.findOne({username});
        if(!user)
        {
            // create New User
            const new_user = new User;
            new_user.username = username;
            password = await bcrypt.hash(password,8);
            new_user.password = password;
            await new_user.save();

            let payload = {
                username,
                password,
            };

            let options = {
                expiresIn:"24h",
            };

            const token = jwt.sign(payload,process.env.SECRET_PHRASE,options);

            console.log(token + " is generated token");
            console.log(new_user);

            res.status(201).cookie('auth',token,{
                httpOnly:true,
                maxAge:1000*60*60*24,
                sameSite:'lax',
            }).send({
                message:"User Account Created",
                user: new_user,
            })

        }else{
            const truthy = await bcrypt.compare(password,user.password);
            console.log(truthy);
            if(truthy)
            {
                // Crate Cookie on front end 
                let payload = {
                    username: username,
                    password: user.password,
                };

                const token = jwt.sign(payload,process.env.SECRET_PHRASE,{
                    expiresIn:"24h"
                });

                res.status(201).cookie('auth',token,{
                    httpOnly: true,
                    maxAge:1000*60*60*24,
                    sameSite:'lax',
                }).send({
                    message:"User Logged in successfully",
                    user:user
                })
            }else{
                console.log("Wrong Password");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message: "Something Went Wrong !!",
        })
    }
}

module.exports = {
    Login,
}