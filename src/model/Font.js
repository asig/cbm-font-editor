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
