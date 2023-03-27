var crypto = require('crypto');

//constant
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// A function
makeRandomId = function (length) {
    let result = '';
    let counter = 0;
    while (counter < length) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * 61));
        counter += 1;
    }
    return result;
}

generateMd5 = function (OriginalUrl) {
    const md5 = crypto.createHash('md5')
        .update(new Date() + OriginalUrl)
        .digest('hex')
    return md5.substring(0, 4 + Math.floor(Math.random() * 4));
}

var objectExport = {
    makeRandomId: makeRandomId,
    CHARACTERS: CHARACTERS,
    generateMd5: generateMd5
}
module.exports = objectExport;