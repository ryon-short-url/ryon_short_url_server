const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//////////////////////////////////////////////////////
//                   **Start**                      //
//////////////////////////////////////////////////////

<<<<<<< HEAD
//////////////////////////////////////////////////////
//                   **Start**                      //
//////////////////////////////////////////////////////

=======
>>>>>>> d71e3847edf3b32ad5637e785842617514c87927
//Run Cron Job Start
require("./cron/cronjob")();
//Init router
var routes = require('./api/router');
routes(app);

//Run server
const port = process.env.PORT || 3005;
app.listen(port, () => {
<<<<<<< HEAD
  console.log(`http://172.17.160.1:3005/`)
=======
  console.log(`http://192.168.0.103:3005/`)
>>>>>>> d71e3847edf3b32ad5637e785842617514c87927
});

//////////////////////////////////////////////////////
//                   **End**                        //
//////////////////////////////////////////////////////