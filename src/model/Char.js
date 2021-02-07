class Char {

    constructor(data) {
        if (data == null) {
            data = [0,0,0,0,0,0,0,0]
        }
        this.data = data;
        this.get = this.get.bind(this)
        this.set = this.set.bind(this)
        this.rollLeft = this.rollLeft.bind(this)
        this.rollRight = this.rollRight.bind(this)
        this.rollUp = this.rollUp.bind(this)
        this.rollDown = this.rollDown.bind(this)
        this.shiftLeft = this.shiftLeft.bind(this)
        this.shiftRight = this.shiftRight.bind(this)
        this.shiftUp = this.shiftUp.bind(this)
        this.shiftDown = this.shiftDown.bind(this)
        this.invert = this.invert.bind(this)
        this.isEqual = this.isEqual.bind(this)
        this.flipVertically = this.flipVertically.bind(this)
        this.flipHorizontally = this.flipHorizontally.bind(this)
        this.rotateCcw = this.rotateCcw.bind(this)
        this.rotateCcw = this.rotateCcw.bind(this)
    }

    isEqual(other) {
        if (this.data.length !== other.data.length) {
            return false
        }
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i] !== other.data[i]) {
                return false
            }
        }
        return true
    }

    get(x, y) {
        const b = this.data[y]
        return (b & (1<<(7-x))) > 0
    }

    set(x, y, val) {
        const b = this.data
        var res = b.map(v => v)
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (val > 0) {
                res[y] = res[y] | (1 << (7 - x))
            } else {
                res[y] = res[y] & ~(1 << (7 - x))
            }
        }
        return new Char(res);
    }

    flipHorizontally() {
        const b = Array(8)
        for (var i = 0; i < 8 ; i++) {
            var oldb = this.data[i]
            var newb = 0
            for (var j = 0; j < 8; j++) {
                newb = newb << 1
                if (oldb & 1) {
                    newb = newb + 1
                }
                oldb = oldb >>> 1
            }
            b[i] = newb
        }
        return new Char(b);
    }

    flipVertically() {
        const b = Array(8)
        for (var i = 0; i < 8 ; i++) {
            b[i] = this.data[7-i]
        }
        return new Char(b);
    }

    rotateCcw() {
        const b = Array(8).fill(0)
        for (var i = 0; i < 8 ; i++) {
            for (var j = 0; j < 8; j++) {
                var p = this.data[i] & (1<<j)
                if (p) {
                    b[j] |= (1<<(7-i))
                }
            }
        }
        return new Char(b);
    }

    rotateCw() {
        const b = Array(8).fill(0)
        for (var i = 0; i < 8 ; i++) {
            for (var j = 0; j < 8; j++) {
                var p = this.data[i] & (1<<j)
                if (p) {
                    b[7-j] |= (1<<i)
                }
            }
        }
        return new Char(b);
    }

    rollLeft() {
        const b = this.data
        return new Char(b.map(v => ( (v << 1) | (v >> 7) ) & 0xff));
    }

    rollRight() {
        const b = this.data
        return new Char(b.map(v => ((v >> 1) | ((v&1) << 7)) & 0xff));
    }

    rollUp() {
        const b = this.data
        return new Char([b[1],b[2], b[3], b[4], b[5], b[6], b[7], b[0]]);
    }

    rollDown() {
        const b = this.data
        return new Char([b[7], b[0], b[1],b[2], b[3], b[4], b[5], b[6]]);

    }

    shiftLeft() {
        const b = this.data
        return new Char(b.map(v => (v << 1) & 0xff ));
    }

    shiftRight() {
        const b = this.data
        return new Char(b.map(v => (v >> 1) ));
    }

    shiftUp() {
        const b = this.data
        return new Char([b[1], b[2], b[3], b[4], b[5], b[6], b[7], 0]);
    }

    shiftDown() {
        const b = this.data
        return new Char([0, b[0], b[1],b[2], b[3], b[4], b[5], b[6]]);
    }

    invert() {
        const b = this.data
        return new Char(b.map(v => (~v) & 0xff));
    }
}



export default Char;
