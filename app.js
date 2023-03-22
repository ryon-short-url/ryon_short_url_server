const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var crypto = require('crypto');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                       **START**                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    _id: generateMd5(request.query.originalUrl),
    originalUrl: request.query.originalUrl,
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
var myCallback = function (data) {
  console.log('got data: ' + data);
};

var usingItNow = function (callback) {
  callback('get it?');
};
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

/////////////////test-end/////////////////

//run server
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`http://192.168.0.103:3005/`)
});