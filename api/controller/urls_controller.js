'use strict';

var utils = require("../../untils/utils");
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const VerificationCodeRepository = require('../../repository/verification_code_repository');
// const AppDAO = require('../../repository/dao');
// const dao = new AppDAO('./database/vc.sqlite3');
// const verificationCodeRepo = new VerificationCodeRepository(dao);


//Create validate code
exports.get_url = async function (req, res) {
    var originalUrl = await getShortUrl(req.body.shortId);
    console.log(originalUrl);
    res.send(originalUrl.originalUrl);
};

exports.create_url = async function (req, res) {
    var x = {
        _id: utils.generateMd5(req.body.originalUrl),
        originalUrl: req.body.originalUrl,
        userID: req.body.userID,
    };
    await createShortUrl(x, async (status) => {
        if (status == 0) {
            res.json(x._id);
        } else if (status == 11000) {// trường hợp trùng ID sẽ tiến hành việc tạo lại
            let triesCounter = 0;
            while (triesCounter < 5) {
                try {
                    x._id = untils.generateMd5(crypto.randomUUID() + x._id);
                    await createShortUrl(x, (status) => {
                        var shortId = {
                            shortId: x._id
                        }
                        res.json(shortId);
                    });
                    break;  // 'return' would work here as well
                } catch (err) {
                    console.log(err);
                }
                triesCounter++;
            }
        } else {
            res.json("error");
        }
    });
};

//Create validate code
exports.create_vcode = async function (req, res) {
    var vcode = utils.makeRandomId(6);
    utils.verificationCodeRepo.create(vcode).then(() => {
        res.json(vcode);
    });
};

//Create validate code
exports.validate_vcode = async function (req, res) {
    utils.verificationCodeRepo.getById(req.body.vcode).then((result) => {
        if (result.count != 1) {
            res.json('false');//return 1 where true
        } else {
            utils.verificationCodeRepo.delete(req.body.vcode);
            res.json('true');//return 1 where true
        }
    });
};

///////////////Fuction///////////////////////////////////////
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

const getShortUrl = async (shortId) => {
    await client.connect();
    const collection = client.db("ryon01").collection("urls");
    var url = collection.findOne({ "_id": shortId });
    return url
}