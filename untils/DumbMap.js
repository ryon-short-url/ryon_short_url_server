let hash = require('string-hash')

class DumbMap {
    constructor() {
        this.list = []
    }

    get(x) {
        return this.list[hash(x)]
    }

    set(x, y) {
        this.list[hash(x)] = y
    }
}
module.exports = DumbMap;