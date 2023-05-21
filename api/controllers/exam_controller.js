'use strict';

var utils = require("../../untils/utils");
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { google } = require('googleapis');
const key = require("../../untils/key");
const CONSTANT = require("../../constant/constant");
const blogger = google.blogger({
    version: 'v3',
    params: {
        key: key.apiKey
    }
});



exports.create_exam = async function (req, res) {
    var obj = {
        _id: req.body.type,
        content: req.body.content,
        anwser: req.body.anwser,
        explanation: req.body.explanation,
        comments: null,
        createTime: new Date(),
        updateTime: null,

    }
    await createExam(obj, async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.get_exam = async function (req, res) {
    var obj = {
        collection: req.body.collection,
        ids: req.body.ids
    }

    await getExam(obj, async (v) => {
        if (v != 0) {
            res.json(v);
        }
        else {
            res.json("error");
        }
    });
};

///////////////Fuction///////////////////////////////////////
// create url
const createExam = async (obj, callback) => {

    await client.connect();
    const counter_collection = client.db("ryon01").collection("countersid");
    counter_collection.findOne({ _id: obj._id }, function (err, res) {
        const exam_collection = client.db("ryon01").collection(obj._id.slice(0, 2));
        obj._id = obj._id + formatNumber(res.counter)
        exam_collection.insertOne(obj, function (err, res) {
            if (err) {
                callback(0);
            } else {
                console.log(obj._id)
                counter_collection.findOneAndUpdate({ _id: obj._id.slice(0, 6) }, { $inc: { counter: 1 } }, function (err, status) {
                    if (err) {
                        callback(0);
                    } else {
                        callback(res);
                    }
                });

            }
        });
    })
}

const getExam = async (obj, callback) => {
    await client.connect();
    const collection = client.db("ryon01").collection(obj.collection);
    const filter = { _id: { $in: obj.ids } };
    await collection.find(filter).toArray().then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });

}

function formatNumber(number) {
    const formattedNumber = String(number); // Chuyển đổi số thành chuỗi

    if (formattedNumber.length < 5) {
        const zerosToAdd = 5 - formattedNumber.length; // Số lượng số 0 cần thêm vào
        const paddedNumber = '0'.repeat(zerosToAdd) + formattedNumber; // Thêm số 0 vào phía trước

        return paddedNumber;
    }

    return formattedNumber;
}