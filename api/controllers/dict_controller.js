'use strict';
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDBContant = require('..//../constant/constant');


exports.create_dict = async function (req, res) {
    var obj = {
        _id: req.body._id,
        content: req.body.content,
    }
    await insertOneDict(obj, async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.update_dict = async function (req, res) {
    var obj = {
        content: req.body.content,
    }
    await updateDict(req.body._id, obj, async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.delete_dict = async function (req, res) {

    await deleteDict(req.body._id, async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.get_dict = async function (req, res) {
    await getDict(req.body._id, async (v) => {
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

const insertOneDict = async (obj, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.dictjpvn);
    collection.insertOne(obj, function (err, res) {
        if (err) {
            callback(0);
        } else {

        }
    });

}

const updateDict = async (id, obj, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.dictjpvn);
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

const deleteDict = async (id, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.dictjpvn);
    const filter = { _id: id };
    await collection.deleteOne(filter).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });

}


const getDict = async (obj, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.dictjpvn);
    const filter = { _id: obj };
    await collection.findOne(filter).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });

}
