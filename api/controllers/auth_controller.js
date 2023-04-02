
const key = require("../../untils/key");
var jwt = require("jsonwebtoken");
const passport = require('passport');
const cookieSession = require('cookie-session');
require('../../untils/passport');

// exports.signin = (req, res) => {

//     var token = jwt.sign({ id: 'tiennv2' }, key.secret, {
//         expiresIn: 86400 // 24 hours
//     });

//     res.status(200).send({
//         accessToken: token
//     });
// };

// dao.js


class Auth {

    googleSignin = (isLoggedIn, (req, res) => {

        var token = jwt.sign({ id: req.user.email }, key.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            accessToken: token,
            email: req.user.email
        });
    });

    signin = (req, res) => {

        var token = jwt.sign({ id: 'tiennv2' }, key.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            accessToken: token
        });
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











