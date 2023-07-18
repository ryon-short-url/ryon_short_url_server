'use strict';
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDBContant = require('..//../constant/constant');


exports.create_blog = async function (req, res) {
    await insertOneDict(JSON.parse(req.body.blog), async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.update_blog = async function (req, res) {

    await updateBlog(JSON.parse(req.body.blog), async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.delete_blog = async function (req, res) {

    await deleteBlog(req.body._id, async (v) => {
        if (v != 0) {
            res.json(JSON.stringify(v));
        }
        else {
            res.json("error");
        }
    });
};

exports.get_blog_by_id = async function (req, res) {
    await getBlogById(req.body._id, async (v) => {
        if (v != 0) {
            res.json(v);
        }
        else {
            res.json("error");
        }
    });
};

exports.get_blog_all = async function (req, res) {
    await getBlogAll(async (v) => {
        if (v != 0) {
            res.json(v);
        }
        else {
            res.json("error");
        }
    });
};

exports.get_blog_with_full_search = async function (req, res) {
    await getDictWithFullTextSearch(req.body._id, req.body.limit, async (v) => {
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
        collection(mongoDBContant.mongoDBContant.blogColection);
    collection.insertOne(obj, function (err, res) {
        if (err) {
            callback(0);
        } else {

        }
    });

}

const updateBlog = async (obj, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.blogColection);
    const filter = { _id: obj._id };
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

const deleteBlog = async (id, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.blogColection);
    const filter = { _id: id };
    await collection.deleteOne(filter).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });

}




const getBlogById = async (obj, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.blogColection);
    const filter = { _id: obj };
    await collection.findOne(filter).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            callback(result);
        }
    });



}
const getDictWithFullTextSearch = async (obj, limit, callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.dictjpvn);

    const agg = [
        {
            $search: {
                text: {
                    query: obj,
                    path: '_id'
                },
            },
        },
        {
            $limit: parseInt(limit),
        },

    ];

    collection.aggregate(agg).toArray()
        .then((results) => {
            // console.log(results);
            callback(results);
        })
        .catch((error) => {
            console.error(error);
            callback(0);
        });



}


const getBlogAll = async (callback) => {
    await client.connect();
    const collection = client.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.blogColection);

    collection.find({}, {
        projection: {
            _id: 1,
            title: 1,
            content: 1,
            imageUrl: 1,
            subContent: 1,
            tags: 1,
            createDate: 1,
            updateDate: 1,
            author: 1
        }
    }).toArray()
        .then((results) => {
            callback(results);
        })
        .catch((error) => {
            console.error(error);
            callback(0);
        });



}