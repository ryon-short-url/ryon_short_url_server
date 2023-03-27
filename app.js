const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var crypto = require('crypto');
const AppDAO = require('./repository/dao');
const VerificationCodeRepository = require('./repository/verification_code_repository');
const cron = require("node-cron");
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const dao = new AppDAO('./database/vc.sqlite3');
const untils = require("./untils/untils");
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const verificationCodeRepo = new VerificationCodeRepository(dao);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       **APIs**                                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var routes = require('./api/router');
routes(app);

app.post('/get', async function (req, res) {
  var originalUrl = await getShortUrl(req.body.shortId);
  console.log(originalUrl);
  res.send(originalUrl.originalUrl);
});


//dynamic get url
app.get('/:shortId', async function (req, res) {
  var originalUrl = await getShortUrl(req.params.shortId);
  console.log(originalUrl);
  res.send(originalUrl.originalUrl);
});

//Create validate code
app.post('/create/vcode', async function (req, res) {
  var vcode = untils.makeRandomId(6);
  verificationCodeRepo.create(vcode).then(() => {
    res.json(vcode);
  });
});


//Validate code
app.post('/validate/vcode', async function (req, res) {
  verificationCodeRepo.getById(req.body.vcode).then((result) => {
    if (result.count != 1) {
      res.json('false');//return 1 where true
    } else {
      verificationCodeRepo.delete(req.body.vcode);
      res.json('true');//return 1 where true
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       **Function**                                                               //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create url
const createShortUrl = async (url, callback) => {
  await client.connect();
  const collection = client.db("ryon01").collection("urls");
  collection.insertOne(url, function (err, res) {
    if (err) {
      //  console.log('Error occurred while inserting');
      callback(err.code);
      // return 
    } else {
      //  console.log('inserted record');
      callback(0);
      // return 
    }
  });
}
// get url
const getShortUrl = async (shortId) => {
  await client.connect();
  const collection = client.db("ryon01").collection("urls");
  var url = collection.findOne({ "_id": shortId });
  return url
}

/////////////////////////////////////////////////////////////////////////
//                         Cron Job
/////////////////////////////////////////////////////////////////////////
//┌────────────── second (0 - 59) (optional)
//│ ┌──────────── minute (0 - 59) 
//│ │ ┌────────── hour (0 - 23)
//│ │ │ ┌──────── day of the month (1 - 31)
//│ │ │ │ ┌────── month (1 - 12)
//│ │ │ │ │ ┌──── day of the week (0 - 6) (0 and 7 both represent Sunday)
//│ │ │ │ │ │
//│ │ │ │ │ │
//* * * * * * 
/////////////////////////////////////////////////////////////////////////
//clear vcode in SQLite
cron.schedule("*/1 * * * *", function () {
  console.log("---------------------");
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
  var hours = ("0" + date_ob.getHours()).slice(-2);
  var minutes = ("0" + (date_ob.getMinutes() - 1)).slice(-2);
  var seconds = ("0" + date_ob.getSeconds()).slice(-2);
  if (minutes == "-1") {
    minutes = "59";
    hours = hours - 1;
  }
  var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  verificationCodeRepo.deleteByDateTime(dateTime).then((result) => {
    console.log(dateTime);
    console.log(result);
  });
});
//rebuilds database each 12 hour
cron.schedule("0 */12 * * *", function () {
  verificationCodeRepo.rebuilds().then((result) => {
    console.log(result.id);
  });
});
///////////////////////////////////////////////////////////////////////////
//                        Run server
///////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`http://172.17.160.1:3005/`)
});