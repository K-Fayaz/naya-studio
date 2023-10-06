const express    = require("express");
const controller = require("../controller/state.controller"); 

const router  = express.Router();

/* `router.get("/tik-tak-toe/state",controller.get_tik_tak_toe_state);` is defining a GET route for the
"/tik-tak-toe/state" endpoint. When a GET request is made to this endpoint, the
`controller.get_tik_tak_toe_state` function will be called to handle the request. */
router.get("/tik-tak-toe/state",controller.get_tik_tak_toe_state);

/* `router.get("/snake-ladder-state",controller.get_snake_ladder_state);` is defining a GET route for
the "/snake-ladder-state" endpoint. When a GET request is made to this endpoint, the
`controller.get_snake_ladder_state` function will be called to handle the request. */
router.get("/snake-ladder-state",controller.get_snake_ladder_state);

module.exports = router;