const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
//////////////////////////////////////////////////////
//                   **Start**                      //
//////////////////////////////////////////////////////

//Run Cron Job Start
//require("./cron/cronjob")();// tạm thời tắt
//Init router
var routes = require('./api/router');
routes(app);

//Run server
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`http://1127.0.0.1:3005/`)
});

//////////////////////////////////////////////////////
//                   **End**                        //
//////////////////////////////////////////////////////