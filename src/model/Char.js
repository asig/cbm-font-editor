/*
 * Copyright (c) 2021 Andreas Signer <asigner@gmail.com>
 *
 * This file is part of cbm-font-editor.
 *
 * cbm-font-editor is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * cbm-font-editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cbm-font-editor.  If not, see <http://www.gnu.org/licenses/>.
 */
class Char {

    constructor(data) {
        if (data == null) {
            data = [0,0,0,0,0,0,0,0]
        }
        this.data = data;
        this.get = this.get.bind(this)
        this.getData = this.getData.bind(this)
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
        this.clear = this.clear.bind(this)
        this.fill = this.fill.bind(this)
        this.isEqual = this.isEqual.bind(this)
        this.flipVertically = this.flipVertically.bind(this)
        this.flipHorizontally = this.flipHorizontally.bind(this)
        this.rotateCcw = this.rotateCcw.bind(this)
        this.rotateCw = this.rotateCw.bind(this)
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

    getData() {
        return this.data.map(x => x)
    }

    get(x, y, multicol) {
        const b = this.data[y]
        if (multicol) {
            const shift = 6-2*x
            return (b & (3 << shift)) >>> shift
        } else {
            return (b & (1 << (7 - x))) > 0 ? 1 : 0
        }
    }

    set(x, y, val, multicol) {
        const b = this.data
        var res = b.map(v => v)
        if (multicol) {
            const clearMask = ~(3 << (6 - 2*x)) & 0xff
            const setMask = val << (6 - 2*x)
            res[y] = res[y] & clearMask | setMask
        } else {
            const clearMask = ~(1 << (7 - x)) & 0xff
            const setMask = val << (7 - x)
            res[y] = res[y] & clearMask | setMask
        }
        return new Char(res);
    }

    flipHorizontally(multicol) {
        const shift = multicol ? 2 : 1
        const mask = multicol ? 3 : 1
        const b = Array(8)
        for (var i = 0; i < 8 ; i++) {
            var oldb = this.data[i]
            var newb = 0
            for (var j = 0; j < 8/shift; j++) {
                newb = (newb << shift) | (oldb & mask)
                oldb = oldb >>> shift
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

    rollLeft(multicol) {
        const b = this.data
        const mod = multicol ? v => ((v << 2) | (v >> 6)) & 0xff : v => ((v << 1) | (v >> 7)) & 0xff;
        return new Char(b.map(mod));
    }

    rollRight(multicol) {
        const b = this.data
        const mod = multicol ? v => ((v >> 2) | ((v&3) << 6)) & 0xff : v => ((v >> 1) | ((v&1) << 7)) & 0xff;
        return new Char(b.map(mod));
    }

    rollUp() {
        const b = this.data
        return new Char([b[1],b[2], b[3], b[4], b[5], b[6], b[7], b[0]]);
    }

    rollDown() {
        const b = this.data
        return new Char([b[7], b[0], b[1],b[2], b[3], b[4], b[5], b[6]]);

    }

    shiftLeft(multicol) {
        const b = this.data
        const shift = multicol ? 2 : 1
        return new Char(b.map(v => (v << shift) & 0xff ));
    }

    shiftRight(multicol) {
        const b = this.data
        const shift = multicol ? 2 : 1
        return new Char(b.map(v => (v >> shift) ));
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

    clear() {
        return new Char(Array(8).fill(0));
    }

    fill() {
        return new Char(Array(8).fill(0xff));
    }
}



export default Char;
