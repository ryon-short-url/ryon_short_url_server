'use strict';
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


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

exports.update_exam = async function (req, res) {
    var obj = {
        content: req.body.content,
        anwser: req.body.anwser,
        explanation: req.body.explanation,
        updateTime: new Date(),

    }
    await updateExam(req.body.id, obj, async (v) => {
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

exports.get_counter_exam = async function (req, res) {
    await getCounterExam(async (v) => {
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


    counter_collection.findOne({ _id: obj._id }, async function (err, res) {
        console.log(err)
        console.log(res)
        console.log(obj._id)

        if (res == null) {
            counter_collection.insertOne({ _id: obj._id, counter: 1 }, function (err, res) {
                if (err) {
                    callback(0);
                }

                obj._id = obj._id + formatNumber(1)
                insertOneExam(obj, function (err, res) {
                    if (err) {
                        callback(0);
                    }
                    callback(res);
                })
            });
        } else {
            obj._id = obj._id + formatNumber(res.counter)
            insertOneExam(obj, function (err, res) {
                if (err) {
                    callback(0);
                }
                callback(res);
            })
        }
    })
}

const insertOneExam = async (obj, callback) => {
    await client.connect();
    const exam_collection = client.db("ryon01").collection(obj._id.slice(0, 2));
    const counter_collection = client.db("ryon01").collection("countersid");
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

}

const updateExam = async (id, obj, callback) => {
    await client.connect();
    const collection = client.db("ryon01").collection(id.slice(0, 2));
    const filter = { _id: id };
    const update = {
        $set: obj

    };
    await collection.updateOne(filter, update).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });

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


const getCounterExam = async (callback) => {
    await client.connect();
    const counter_collection = client.db("ryon01").collection("countersid");
    await counter_collection.find().toArray().then((result) => {
        console.log(result)
        if (result == null) {
            callback(0);
        } else {
            // const resultMap = result.reduce((map, obj) => {
            //     map.set(obj._id, obj);
            //     return map;
            // }, new Map());

            // const jsonObject = JSON.stringify(Object.fromEntries(resultMap));
            // console.log(jsonObject)
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