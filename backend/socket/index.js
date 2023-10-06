const http    = require("http");
const express = require("express");
const controller = require("../controller/state.controller");

const app = express();
const server = http.createServer(app);
/* The line `const { Server } = require("socket.io");` is importing the `Server` class from the
`socket.io` module. This class is used to create a socket.io server instance. */
const { Server } = require("socket.io");

/* This code is creating a socket.io server instance and configuring it with the specified port and
CORS settings. */
const PORT = process.env.SOCKET_PORT;
const io = new Server(PORT,{
    cors:{
        origin:'http://localhost:3000',
        credentials: true
    }
});


// We need a data-structure to handle all the players who wants to play snake-ladder

// This array will store all the players who want to play snake-ladder
// As users connect to "/snake-ladder" namespace they will be pushed to this array
let snake_ladder_waiting = [];


// Another DS to store paired clients playing snake-ladder
let snake_ladder_paired = [];

// Creating a namespace to handle socket connection of Snake and Ladder game
/* `io.of("/snake-ladder")` is creating a namespace for the socket.io server instance. Namespaces allow
you to separate socket connections into different groups or categories. In this case, the namespace
"/snake-ladder" is created specifically for handling socket connections related to the Snake and
Ladder game. */
io.of("/snake-ladder").on("connection",(socket)=>{
    console.log("User " + socket.handshake.auth.user + " connected to /snake-ladder");

    /* The `socket.on("find-opponent", (data) => { ... })` function is an event listener that listens
    for the "find-opponent" event emitted by a client. */
    socket.on("find-opponent",(data)=>{
        console.log(data);
        snake_ladder_waiting.push(data);


        while(snake_ladder_waiting.length >= 2)
        {
            let first = snake_ladder_waiting[0];
            let second = snake_ladder_waiting[1];

            console.log(first.id);
            console.log(second.id);

            io.of('/snake-ladder').to(first.id).emit("opponent-found",{
                opponent: second.id,
                toss: first.user,
            });

            io.of('/snake-ladder').to(second.id).emit("opponent-found",{
                opponent: first.id,
                toss: first.user
            });

            snake_ladder_paired.push({
                playerOne:first.id,
                playerTwo:second.id,
            });

            console.log("Paired clients are ",snake_ladder_paired);

            let pairedClient = snake_ladder_waiting.shift();
            console.log(pairedClient + " is emmitted");
            pairedClient = snake_ladder_waiting.shift();
            console.log(pairedClient + " is emmitted");
        }

    })

    /* The `socket.on("disconnect",()=>{ ... })` function is an event listener that listens for the
    "disconnect" event emitted by a client. This event is triggered when a client disconnects from
    the socket.io server. */
    socket.on("disconnect",()=>{

        console.log("User "+ socket.handshake.auth.user+" with socket id "+socket.id+" got disconnected!");
        
        // On disconnect 
            // 1. Check if the disconnected socket is present in the waiting list array

            let i = 0 , found = false;
            for(let client of snake_ladder_waiting)   // iterate through the array to find the disconnected socket
            {
                if(client.id === socket.id)
                {
                    found = true;
                    break;
                }
                i++;
            }


            // Remove the disconnected socket from the waiting list
            if(found)
                snake_ladder_waiting.splice(i,1);

            // 2 if the user present in paired array than we need to notify the other player
            //   that his opponent has left the game

            if(!found)
            {
                console.log(snake_ladder_paired);
                i = 0;
                for(let pair of snake_ladder_paired)
                {
                    if(pair.playerOne == socket.id)
                    {
                        found = true;
                        io.of("/snake-ladder").to(pair.playerTwo).emit("opponent-left");
                        break;
                    }
                    else if(pair.playerTwo == socket.id)
                    {
                        found = true;
                        io.of("/snake-ladder").to(pair.playerOne).emit("opponent-left");
                        break;
                    }
                    i++;
                }
            }

            if(found)
            {
                snake_ladder_paired.splice(i,1);
            }
    })

    /* The code `socket.on("move-opponent",(data)=>{
    io.of("/snake-ladder").to(data.to).emit("move-opponent",data.number); })` is an event listener
    that listens for the "move-opponent" event emitted by a client in the "/snake-ladder" namespace. */
    socket.on("move-opponent",(data)=>{
        io.of("/snake-ladder").to(data.to).emit("move-opponent",data.number);
    })

    /* The code `socket.on("opponent-number",(data)=>{
    io.of("/snake-ladder").to(data.to).emit("opponent-number",data.number); })` is an event listener
    that listens for the "opponent-number" event emitted by a client in the "/snake-ladder"
    namespace. */
    socket.on("opponent-number",(data)=>{
        io.of("/snake-ladder").to(data.to).emit("opponent-number",data.number);
    });

    /* The code `socket.on("your-move",(data)=>{ io.of("/snake-ladder").to(data).emit("your-move"); })`
    is an event listener that listens for the "your-move" event emitted by a client in the
    "/snake-ladder" namespace. */
    socket.on("your-move",(data)=>{
        io.of("/snake-ladder").to(data).emit("your-move");
    })

    /* The code `socket.on("opponent-state",(data)=>{
    io.of("/snake-ladder").to(data.to).emit("opponent-state",data.number); })` is an event listener
    that listens for the "opponent-state" event emitted by a client in the "/snake-ladder"
    namespace. */
    socket.on("opponent-state",(data)=>{
        io.of("/snake-ladder").to(data.to).emit("opponent-state",data.number);
    })

    /* The code `socket.on("update-state",async(data)=>{ await
    controller.update_snake_ladder_state(data,socket.handshake.auth.user) });` is an event listener that
    listens for the "update-state" event emitted by a client in the "/snake-ladder" namespace. */
    socket.on("update-state",async(data)=>{ await controller.update_snake_ladder_state(data,socket.handshake.auth.user) });

    /* The code `socket.on("ai-won",(data)=>{
    controller.update_snake_ladder_score(data,socket.handshake.auth.user) })` is an event listener that
    listens for the "ai-won" event emitted by a client in the "/snake-ladder" namespace. */
    socket.on("ai-won",(data)=>{ controller.update_snake_ladder_score(data,socket.handshake.auth.user) })

});


// Creating similar data structures for tik-tak-toe
/* The code `let tik_tak_toe_waiting = [];` is declaring an empty array called `tik_tak_toe_waiting`.
This array will be used to store the players who want to play the Tik Tak Toe game. */
let tik_tak_toe_waiting = [];
let tik_tak_toe_paired =  [];


/* `io.of("/tik-tak-toe")` is creating a namespace for the socket.io server instance specifically for
handling socket connections related to the Tik Tak Toe game. Namespaces allow you to separate socket
connections into different groups or categories. By creating a namespace, you can organize and
manage socket connections for different games or functionalities separately. */
io.of("/tik-tak-toe").on("connection",(socket)=>{
    console.log("User with Id "+socket.id+" and username "+socket.handshake.auth.user+" got connected to Tik tak toe!!!");

    /* The `socket.on("find-opponent", (data) => { ... })` function is an event listener that listens
    for the "find-opponent" event emitted by a client in the "/tik-tak-toe" namespace. */
    socket.on("find-opponent",(data)=>{
        console.log(data);
        tik_tak_toe_waiting.push(data);

        while(tik_tak_toe_waiting.length >= 2)
        {
            let first = tik_tak_toe_waiting[0];
            let second = tik_tak_toe_waiting[1];

            io.of("/tik-tak-toe").to(first.id).emit("opponent-found",{toss:first.user,opponent: second.id});
            io.of("/tik-tak-toe").to(second.id).emit("opponent-found",{toss:first.user,opponent: first.id});

            tik_tak_toe_paired.push({
                firstPlayer: first.id,
                secondPlayer: second.id,
            });

            console.log(first.user+" got paired with "+second.user);
            tik_tak_toe_waiting.shift();
            tik_tak_toe_waiting.shift();
        }

    });

    /* The code `socket.on("opponent-move",(data)=>{
    io.of("/tik-tak-toe").to(data.opponent).emit("opponent-move",{ block: data.block }) });` is an
    event listener that listens for the "opponent-move" event emitted by a client in the
    "/tik-tak-toe" namespace. */
    socket.on("opponent-move",(data)=>{
        io.of("/tik-tak-toe").to(data.opponent).emit("opponent-move",{ block: data.block })
    });

    /* The code `socket.on("game-over",(data)=>{
    io.of("/tik-tak-toe").to(data.opponent).emit("game-over"); });` is an event listener that
    listens for the "game-over" event emitted by a client in the "/tik-tak-toe" namespace. */
    socket.on("game-over",(data)=>{
        io.of("/tik-tak-toe").to(data.opponent).emit("game-over");
    });

    /* The code `socket.on("game-tie",(data)=>{ io.of("/tik-tak-toe").to(data).emit("game-tie"); });`
    is an event listener that listens for the "game-tie" event emitted by a client in the
    "/tik-tak-toe" namespace. */
    socket.on("game-tie",(data)=>{
        io.of("/tik-tak-toe").to(data).emit("game-tie");
    });

    /* The above code is listening for a "update-board" event on a socket connection. When the event is
    triggered, it logs the received data to the console and then calls the "update_state_tik_tak"
    function on the "controller" object, passing the received data as an argument. The
    "update_state_tik_tak" function is likely responsible for updating the state of a tic-tac-toe
    game board. */
    socket.on("update-board",async(data)=>{
        console.log(data);
        await controller.update_state_tik_tak(data)
    });

    /* The above code is an event listener in JavaScript that listens for the "ai-won" event on a
    socket connection. When this event is triggered, it logs the data received from the event and
    also logs the username of the user who won the game. It then calls the "game_over_tiktak"
    function from the "controller" object, passing the username and data as arguments. The function
    is awaited, indicating that it is an asynchronous operation. */
    socket.on("ai-won",async(data)=>{ 
        console.log(data);
        console.log(socket.handshake.auth.user + " user wonnn!!!!!!!!!!!1");
        await controller.game_over_tiktak(socket.handshake.auth.user,data);
    });


    /* The above code is handling the "disconnect" event for a socket connection. */
    socket.on("disconnect",()=>{
        // check if the user is present in the waiting list
        let i  = 0;
        let found = false;
        for(let user of tik_tak_toe_waiting)
        {
            if(user.id == socket.id)
            {
                found = true;
                break;
            }
            i++;
        }

        if(found)
        {
            tik_tak_toe_waiting.splice(i,1);
        }

        if(!found)
        {
            // than the user is paired with another user
            // so we need to notify the player that his opponet has left
            i = 0;
            for(let pair of tik_tak_toe_paired)
            {
                if(pair.firstPlayer == socket.id)
                {
                    io.of("/tik-tak-toe").to(pair.secondPlayer).emit("opponent-left");
                    found = true;
                    break;
                }
                else if(pair.secondPlayer == socket.id)
                {
                    io.of("/tik-tak-toe").to(pair.firstPlayer).emit("opponent-left");
                    found = true;
                    break;
                }
            }
        }

        if(found)
        {
            tik_tak_toe_paired.splice(i,1);
        }

        console.log(tik_tak_toe_waiting)
        console.log(tik_tak_toe_paired)

    })

})

module.exports = {
    app,
    server
}