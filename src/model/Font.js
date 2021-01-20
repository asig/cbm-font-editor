import Char from "./Char"

class Font {

    constructor(chars) {
        if (chars == null) {
            this.chars = [...Array(256).keys()].map( (i) => new Char(null) )
        } else {
            this.chars = chars
        }

        this.getChar = this.getChar.bind(this)
        this.setChar = this.setChar.bind(this)
    }

    getChar(i) {
        return this.chars[i]
    }

    setChar(i, c) {
        this.chars[i] = c
    }
}

export default Font;
