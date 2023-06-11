
const key = require("../../untils/key");
var jwt = require("jsonwebtoken");

const passport = require('passport');
const cookieSession = require('cookie-session');
require('../../untils/passport');
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const mongoClient = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDBContant = require('..//../constant/constant');

// dao.js
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(key.googleClientID);

class Auth {

    signinWithGoogle = async (req, res) => {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: key.googleClientID,
            });
            console.log(ticket);

            const payload = ticket.getPayload();
            const userId = payload.sub;
            const email = payload.email;
            // ... Xử lý thông tin người dùng thành công
            req.userId = userId;

            await mongoClient.connect();
            const collection = mongoClient.
                db(mongoDBContant.mongoDBContant.databaseName).
                collection(mongoDBContant.mongoDBContant.userColection);
            var obj = {
                _id: email,
                iss: payload.iss,
                locale: payload.locale,
                name: payload.name,
                picture: payload.picture,
                permission: ['user'],
            }
            collection.insertOne(obj, function (err, result) {
                if (err) {
                    res.json(result);
                } else {
                    res.json(result);

                }
            });

        } catch (error) {
            console.log(error);
            return res.status(401).send({ message: "Unauthorized!" });
            // ... Xử lý lỗi
        }

    };

    loginWithGoogle = (req, res) => {

        res.json(req.userInfo);
    };
}
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = Auth











