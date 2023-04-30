'use strict';

var utils = require("../../untils/utils");
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//get validate code
exports.get_mapping_blog = async function (req, res) {
    var originalUrl = await getMappingBlog(req.body.urlId);
    if (originalUrl == null) {
        res.json("error");
    }
    else {
        res.send(originalUrl.blogId);
    }
};

exports.create_mapping_blog = async function (req, res) {
    var x = {
        _id: req.body.urlId,
        blogId: req.body.blogId,
    }
    await createMappingBlog(x, async (status) => {
        if (status == 0) {
            res.json(x);
        }
        else {
            res.json("error");
        }
    });
};

//delete
exports.delete_mapping_blog = async function (req, res) {
    var originalUrl = await deleteMappingBlog(req.body.urlId);
    res.send(originalUrl);
};


///////////////Fuction///////////////////////////////////////
// create url
const createMappingBlog = async (obj, callback) => {
    await client.connect();
    const collection = client.db("ryon01").collection("blog");
    collection.insertOne(obj, function (err, res) {
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

const getMappingBlog = async (urlId) => {
    await client.connect();
    const collection = client.db("ryon01").collection("blog");
    var url = collection.findOne({ "_id": urlId });
    return url
}

const deleteMappingBlog = async (urlId) => {
    await client.connect();
    const collection = client.db("ryon01").collection("blog");
    var url = collection.deleteOne({ "_id": urlId });
    return url
}