class Char {

    constructor(data) {
        if (data == null) {
            data = [0,0,0,0,0,0,0,0]
        }
        this.data = data;
        this.get = this.get.bind(this)
        // this.set = this.set.bind(this)
    }

    get(x, y) {
        const b = this.data[y]
        return (b & (1<<x)) > 0
    }

    // set(x, y, val) {
    //     var res = this.data.map(b => b)
    //     if (val > 0) {
    //         res[y] = res[y] | (1<<x)
    //     } else {
    //         res[y] = res[y] & ~(1<<x)
    //     }
    //     return new Char(res)
    // }
}

export default Char;
