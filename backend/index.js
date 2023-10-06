require("dotenv").config();

require("./Model/");       // Database connection
const cors             = require("cors");
const express          = require("express"); 
const { app , server } = require("./socket/");
const cookieParser     = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

/* The `app.use(cors(...))` function is setting up Cross-Origin Resource Sharing (CORS) for the
application. */
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));


/* These lines of code are importing and using the routes defined in the files `auth.routes.js` and
`state.routes.js`. */
const authRoutes  = require("./Routes/auth.routes");
const stateRoutes = require("./Routes/state.routes"); 
app.use("/auth/",authRoutes);
app.use("/fetch/",stateRoutes);


const PORT = process.env.PORT;
server.listen(8080,()=>{
    console.log(`Listening to PORT ${PORT}`);
})