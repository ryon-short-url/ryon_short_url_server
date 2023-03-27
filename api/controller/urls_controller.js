'use strict';

var untils = require("../../untils/untils");
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const VerificationCodeRepository = require('./repository/verification_code_repository');
const dao = new AppDAO('./database/vc.sqlite3');
const verificationCodeRepo = new VerificationCodeRepository(dao);

exports.create_url = async function (req, res) {
    var x = {
        _id: untils.generateMd5(req.body.originalUrl),
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

exports.create_vcode = async function (req, res) {
    var vcode = untils.makeRandomId(6);
    verificationCodeRepo.create(vcode).then(() => {
        res.json(vcode);
    });
};
//Create validate code
app.post('/create/vcode', async function (req, res) {

});



///////////////Fuction
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

// exports.read_a_task = function (req, res) {
//     Task.findById(req.params.taskId, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };

// exports.update_a_task = function (req, res) {
//     Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json(task);
//     });
// };
// // Task.remove({}).exec(function(){});
// exports.delete_a_task = function (req, res) {

//     Task.remove({
//         _id: req.params.taskId
//     }, function (err, task) {
//         if (err)
//             res.send(err);
//         res.json({ message: 'Task successfully deleted' });
//     });
// };