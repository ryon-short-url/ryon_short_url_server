// A function
hello = function () {
    console.log('hello world!')
}
// A variable
const PI = 3.14;
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';



// A class!!
var Rectangle = class {
    constructor(length, width) {
        this.length = length;
        this.width = width;
    }
    showInfo() {
        console.log(`Rectangle ${this.width} x ${this.length} :`)
    }
    showArea() {
        console.log("Area: " + (this.length * this.width))
    }
    showCircuit() {
        console.log("Circuit: " + (2 * (this.length + this.width)))
    }
};
// type
var typelist = {
    technology: 'technology',
    culture: 'culture',
    fashion: 'fashion',
    lifestyle: 'lifestyle',
    art: 'art',
    cuisine: 'cuisine',
    newlist: 'newlist'
}

//mongodb collection

var mongoDBContant = {
    databaseName: 'ryon01',
    dictjpvn: 'dictjpvn',
}


var objectExport = {
    hello: hello,
    CHARACTERS: CHARACTERS,
    Rectangle: Rectangle,
    technology: 'technology',
    culture: 'culture',
    fashion: 'fashion',
    lifestyle: 'lifestyle',
    art: 'art',
    cuisine: 'cuisine',
    newlist: 'newlist',
    typelist: typelist,
    mongoDBContant: mongoDBContant
}
module.exports = objectExport;