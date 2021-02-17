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

import palette from "./palette";

class CharView extends React.Component {

    static defaultProps = {
        multicol: false,
        cols: [ palette[1], palette[6], palette[14], palette[0]],
        colsSelected: [ "#FFCCCC", palette[6], palette[14], "#880000"],
        zoom: 2,
        char: null
    }

    constructor(props) {
        super(props);

        this.state = {
            char: props.char == null ? new Char(null) : props.char
        };

        this.render = this.render.bind(this)
        this._draw = this._draw.bind(this)
        this.drawCanvas = this.drawCanvas.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.setChar = this.setChar.bind(this)
        this.setSelected = this.setSelected.bind(this)

        this.canvasRef = React.createRef()
    }

    _draw(w , getPixel) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const ew = canvas.width/w;
        const eh = canvas.height/8;
        ctx.save();
        ctx.beginPath();
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < w; x++) {
                const v = getPixel(x,y)
                ctx.fillStyle = this.state.selected ? this.props.colsSelected[v] : this.props.cols[v]
                ctx.fillRect(x*ew, y*eh, ew, eh);
            }
        }
        ctx.restore();
    }

    drawCanvas() {
        if (this.props.multicol) {
            this._draw(4, this.state.char.getMC)
        } else {
            this._draw(8, (x,y) => this.state.char.get(x,y)*3)
        }
    }

    setSelected(s) {
        this.setState({selected: s})
    }

    setChar(c) {
        if (c === null) {
            c = new Char(null)
        }
        this.setState({char: c})
    }

    componentDidMount() {
        this.drawCanvas()
    }

    componentDidUpdate() {
        this.drawCanvas()
    }

    render() {
        return <canvas
            className={"CharView" + (this.state.selected ? " selected" : "")}
            ref={this.canvasRef}
            width={8*this.props.zoom}
            height={8*this.props.zoom}
        />
    }
}

export default CharView;
