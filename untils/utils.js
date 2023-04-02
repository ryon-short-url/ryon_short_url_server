const crypto = require('crypto');
const VerificationCodeRepository = require('../repository/vcode_repository');
const AppDAO = require('../repository/dao');
const dao = new AppDAO('./database/vc.sqlite3');
const verificationCodeRepo = new VerificationCodeRepository(dao);
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Create random ID
makeRandomId = function (length) {
    let result = '';
    let counter = 0;
    while (counter < length) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * 61));
        counter += 1;
    }
    return result;
}
// Create ID with MD5
generateMd5 = function (OriginalUrl) {
    const md5 = crypto.createHash('md5')
        .update(new Date() + OriginalUrl)
        .digest('hex')
    return md5.substring(0, 4 + Math.floor(Math.random() * 4));
}

var objectExport = {
    makeRandomId: makeRandomId,
    CHARACTERS: CHARACTERS,
    generateMd5: generateMd5,
    verificationCodeRepo: verificationCodeRepo
}

module.exports = objectExport;