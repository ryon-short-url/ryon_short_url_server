const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//////////////////////////////////////////////////////
//                   **Start**                      //
//////////////////////////////////////////////////////

//Run Cron Job Start
require("./cron/cronjob")();
//Init router
var routes = require('./api/router');
routes(app);

//Run server
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`http://172.17.160.1:3005/`)
});

//////////////////////////////////////////////////////
//                   **End**                        //
//////////////////////////////////////////////////////