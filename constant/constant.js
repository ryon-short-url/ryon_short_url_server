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

var objectExport = {
    hello: hello,
    CHARACTERS: CHARACTERS,
    Rectangle: Rectangle,
}
module.exports = objectExport;