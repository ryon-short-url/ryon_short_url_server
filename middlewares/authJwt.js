const jwt = require("jsonwebtoken");
const config = require("../untils/key");
const { OAuth2Client } = require('google-auth-library');
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const mongoclient = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDBContant = require('../constant/constant');
const client = new OAuth2Client(config.googleClientID);

verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    // if (!token) {
    //     return res.status(403).send({ message: "No token provided!" });
    // }

    // try {
    //     const ticket = await client.verifyIdToken({
    //         idToken: token,
    //         audience: config.googleClientID,
    //     });
    //     console.log(ticket);

    //     const payload = ticket.getPayload();
    //     const userId = payload.sub;
    //     const email = payload.email;
    //     // ... Xử lý thông tin người dùng thành công
    //     req.userId = userId;
    //     next();
    //     // return { userId, email };
    // } catch (error) {
    //     console.log(error);
    //     return res.status(401).send({ message: "Unauthorized!" });
    //     // ... Xử lý lỗi
    // }

    // jwt.verify(token, config.googleClientSecret, (err, decoded) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(401).send({ message: "Unauthorized!" });
    //     }
    //     const userId = decoded.sub;
    //     const email = decoded.email;
    //     next();
    // });
    const oauth2Client = new OAuth2Client();

    // Nhận AccessToken từ nguồn nào đó.
    // let accessToken = 'your-access-token';

    // Đặt AccessToken cho OAuth2Client.
    // oauth2Client.setCredentials({
    //     access_token: token
    // });

    oauth2Client.getTokenInfo(token)
        .then(async (info) => {

            await mongoclient.connect();
            const collection = mongoclient.
                db(mongoDBContant.mongoDBContant.databaseName).
                collection(mongoDBContant.mongoDBContant.userColection);
            const filter = { _id: info.email };
            await collection.findOne(filter).then((result) => {
                if (result == null) {

                } else {
                    req.userInfo = result;
                    next();
                    return;
                }
            });
            next();
        })
        .catch((error) => {
            console.error('Error: ', error);
        });

    // oauth2Client.getTokenInfo(token)
    //     .then((info) => {
    //         console.log('User ID: ' + info);
    //         console.log('User ID: ' + info.sub);
    //         console.log('Email: ' + info.email);
    //     })
    //     .catch((error) => {
    //         console.error('Error: ', error);
    //     });

};



isAdmin = async (req, res, next) => {

    await mongoclient.connect();
    const collection = mongoclient.
        db(mongoDBContant.mongoDBContant.databaseName).
        collection(mongoDBContant.mongoDBContant.userColection);
    const filter = { _id: req.email };
    await collection.findOne(filter).then((result) => {
        if (result == null) {
            callback(0);
        } else {
            if (result.permission[0] === "admin") {
                next();
                return;
            }
        }
    });

    res.status(403).send({ message: "Require Admin Role!" });
    return;
};

isModerator = (req, res, next) => {
    if ("Moderator" === "Moderator") {
        next();
        return;
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;