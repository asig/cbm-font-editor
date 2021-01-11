class Char {

    constructor(data) {
        if (data == null) {
            data = Array(8).fill(0).map(x => Array(8).fill(0))
        }
        this.data = data;
        this.get = this.get.bind(this)
        this.set = this.set.bind(this)
        this.invert = this.invert.bind(this)
    }

    get(x, y) {
        return this.data[y][x]
    }

    set(x, y, val) {
        var res = this.data.map(row => row.map(col => col))
        res[y][x] = val
        return new Char(res)
    }

    invert() {
        return new Char(this.data.map(row => row.map(col => col === 0 ? 1 : 0)))
    }
}

export default Char;
