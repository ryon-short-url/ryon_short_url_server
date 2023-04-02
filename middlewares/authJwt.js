const jwt = require("jsonwebtoken");
const config = require("../untils/key");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    if ("admin" === "admin") {
        next();
        return;
    }
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