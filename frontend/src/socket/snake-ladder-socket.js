import { io } from "socket.io-client";


/* defining two variables `url` and `url2` which store the URLs for two different socket
connections. */
const url = "http://localhost:4000/snake-ladder";
const url2 = "http://localhost:4000/tik-tak-toe";

/* creating a socket connection using the `io` function from the `socket.io-client`
library. */
const socket = io(url,{
    autoConnect: false,
    auth:{
        user:sessionStorage.getItem("user"),
    }
});

const tiktaktoeSocket = io(url2,{
    autoConnect: false,
    auth:{
        user: sessionStorage.getItem("user"),
    }
})


export {
    socket,
    tiktaktoeSocket,
};