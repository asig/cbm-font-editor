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
import React from 'react';
import Char from './model/Char'

import palette from "./palette"

class CharEditField extends React.Component {

    static defaultProps = {
        multicol: false,
        zoom: 30,
        cols: [ palette[1], palette[6], palette[14], palette[0]],
        bordercol:"black",
    }

    constructor(props) {
        super(props)

        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseMove = this.mouseMove.bind(this)
        this.drawCanvas = this.drawCanvas.bind(this)
        this.setChar = this.setChar.bind(this)
        this.getPixelCoords = this.getPixelCoords.bind(this)

        this._draw = this._draw.bind(this)
        this._setPixel = this._setPixel.bind(this)
        this._getPixel = this._getPixel.bind(this)

        this.state = {
            data: new Char(null),
        };

        this.pressed = false;

        this.canvasRef = React.createRef();
    }

    setChar(c) {
        this.setState({data: c})
    }

    _setPixel(x,y,val) {
        if (this.props.multicol) {
            this.props.setPixel(x, y, this.props.selectedColor)
        } else {
            this.props.setPixel(x, y, this.props.selectedColor === 0 ? 0 : 1)
        }
    }

    _getPixel(x,y) {
        if (this.props.multicol) {
            return this.state.data.getMC(x, y) * 3
        } else {
            return this.state.data.get(x, y) * 3
        }
    }

    _draw(w) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const ew = canvas.width/w;
        const eh = canvas.height/8;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.props.bordercol
        ctx.lineWidth = 1
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < w; x++) {
                const v = this._getPixel(x,y)
                ctx.fillStyle = this.props.cols[v]
                ctx.fillRect(x*ew, y*eh, ew, eh);
                ctx.strokeRect(x*ew, y*eh, ew, eh)
            }
        }
        ctx.restore();
    }

    drawCanvas() {
        if (this.props.multicol) {
            this._draw(4)
        } else {
            this._draw(8)
        }
    }

    componentDidMount() {
        this.drawCanvas()
    }

    componentDidUpdate() {
        this.drawCanvas()
    }

    getPixelCoords(evt) {
        const canvas = this.canvasRef.current;
        const rect = canvas.getBoundingClientRect()
        const cx = evt.clientX - rect.left
        const cy = evt.clientY - rect.top

        // Get pixel under cursor
        const pixelw = this.state.multicol ? 16 : 8;
        const ew = canvas.width/pixelw;
        const eh = canvas.height/8;
        return [Math.floor(cx/ew), Math.floor(cy/eh)]
    }

    mouseDown(e) {
        if (e.button !== 0) {
            return
        }

        this.pressed = true

        const [x,y] = this.getPixelCoords(e)
        this.px = x
        this.py = y

        // var pix = this.state.data.get(x,y)
        // if (pix) {
        //     this.pixelVal = 0
        // } else {
        //     this.pixelVal = 1
        // }
        // this.props.setPixel(x, y, this.pixelVal)

        this._setPixel(x, y, this.props.selectedColor)
    }

    mouseUp() {
        this.pressed = false
    }

    mouseMove(e) {
        if (!this.pressed) return

        const [x, y] = this.getPixelCoords(e)
        if (this.px === x && this.py === y) return;
        this.px = x;
        this.py = y;

        // this.props.setPixel(x, y, this.pixelVal)
        this._setPixel(x, y, this.props.selectedColor)
    }

    render() {
        return <canvas
            ref={this.canvasRef}
            width={8*this.props.zoom + "px"}
            height={8*this.props.zoom + "px"}
            style={{border: "1px solid " + this.props.bordercol}}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
        ></canvas>
    }
}

export default CharEditField;
