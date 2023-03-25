const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');
var DumbMap = require('./untils/DumbMap.js');
const Promise = require('bluebird')
const AppDAO = require('./repository/dao')
const VerificationCodeRepository = require('./repository/verification_code_repository')

const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                       **START**                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const dao = new AppDAO('./database/vc.sqlite3');
const verificationCodeRepo = new VerificationCodeRepository(dao);

let m = new DumbMap();


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

//gen md5 code
const generateMd5 = (OriginalUrl) => {
  const md5 = crypto.createHash('md5')
    .update(new Date() + OriginalUrl)
    .digest('hex')
  return md5.substring(0, 4 + Math.floor(Math.random() * 4));
}
function makeRandomId(length) {
  let result = '';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * 61));
    counter += 1;
  }
  return result;
}

//create short URL
app.post('/create', async (request, response) => {
  var x = {
    _id: generateMd5(request.body.originalUrl),
    originalUrl: request.body.originalUrl,
    userID: request.body.userID,
  };
  await createShortUrl(x, async (status) => {
    if (status == 0) {
      response.json(x._id);
    } else if (status == 11000) {// trường hợp trùng ID sẽ tiến hành việc tạo lại
      let triesCounter = 0;
      while (triesCounter < 5) {
        try {
          x._id = generateMd5(crypto.randomUUID() + x._id);
          await createShortUrl(x, (status) => {
            var shortId = {
              shortId: x._id
            }
            response.json(shortId);
          });
          break;  // 'return' would work here as well
        } catch (err) {
          console.log(err);
        }
        triesCounter++;
      }
    } else {
      response.json("error");
    }
  });
});

app.post('/get', async function (req, res) {
  var originalUrl = await getShortUrl(req.body.shortId);
  console.log(originalUrl);
  res.send(originalUrl.originalUrl);
});

//dynamic get url
app.get('/:shortId', async function (req, res) {
  // res.send(req.params.shortId);
  var originalUrl = await getShortUrl(req.params.shortId);
  console.log(originalUrl);
  res.send(originalUrl.originalUrl);
});

//get
app.get('/', function (req, res) {
  res.send('Hello World');
  console.log('ddd');
});


/////////////////test-start/////////////
//create short URL
var counter = 0;
app.post('/create/test', async (request, response) => {
  var x = {
    _id: generateMd5("https://www.dynatrace.com/monitoring/technologies/golang-monitoring/?utm_source=google&utm_medium=cpc&utm_term=golang%20performance&utm_campaign=th-vn-apm-application-performance-management&utm_content=none&gclsrc=aw.ds&gclid=CjwKCAjwiOCgBhAgEiwAjv5whITdxjVMQNsvzbKVQ5LNRU4Rn2oSnXUox_VZHZudqxqJZL324S3IeBoC9_MQAvD_BwE"),
    originalUrl: "https://www.dynatrace.com/monitoring/technologies/golang-monitoring/?utm_source=google&utm_medium=cpc&utm_term=golang%20performance&utm_campaign=th-vn-apm-application-performance-management&utm_content=none&gclsrc=aw.ds&gclid=CjwKCAjwiOCgBhAgEiwAjv5whITdxjVMQNsvzbKVQ5LNRU4Rn2oSnXUox_VZHZudqxqJZL324S3IeBoC9_MQAvD_BwE",
    userID: "tiennv",
  };

  await createShortUrl(x, async (status) => {
    if (status == 0) {
      response.json(x);
    } else if (status == 11000) {
      let triesCounter = 0;
      while (triesCounter < 5) {
        console.log(`try #${triesCounter}`)
        try {
          x._id = generateMd5(crypto.randomUUID() + x._id);
          await createShortUrl(x, (status) => {
            response.json(x);
          });
          break;  // 'return' would work here as well
        } catch (err) {
          console.log(err);
        }
        triesCounter++;
      }
    } else {
      console.log("error");
      response.json("error");
    }
  });
});

app.post('/create/vcode', async function (req, res) {
  var vcode = makeRandomId(6);
  console.time('get time')
  verificationCodeRepo.create(vcode).then(() => {
    res.json(vcode);
  });
  console.timeEnd('get time');

});

app.post('/validate/vcode', async function (req, res) {
  verificationCodeRepo.getById(req.body.vcode).then((result) => {
    res.json(result.count);//return 1 where true
  });
});

/////////////////test-end/////////////////
//run server
const port = process.env.PORT || 3005;
app.listen(port, () => {
  // create table
  // verificationCodeRepo.createTable().then(() => {
  //   console.log('thanh cong')
  // });
  console.log(`http://192.168.0.103:3005/`)
});