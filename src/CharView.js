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

import globals from "./globals";

class CharView extends React.Component {

    static defaultProps = {
        fgcol: globals.colors.fg,
        fillcol: globals.colors.fg,
        bgcol: "white",
        fillcolSelected: "#880000",
        bgcolSelected: "#FFCCCC",
        zoom: 2,
        char: null
    }

    constructor(props) {
        super(props);

        this.state = {
            char: props.char == null ? new Char(null) : props.char
        };

        this.render = this.render.bind(this)
        this.drawCanvas = this.drawCanvas.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.setChar = this.setChar.bind(this)
        this.setSelected = this.setSelected.bind(this)

        this.canvasRef = React.createRef()
    }

    drawCanvas(i) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const ew = canvas.width/8;
        const eh = canvas.height/8;
        ctx.save();
        ctx.beginPath();
        const ch = this.state.char
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                const v = ch.get(x,y)
                if (v) {
                    ctx.fillStyle = this.state.selected ? this.props.fillcolSelected : this.props.fillcol
                } else {
                    ctx.fillStyle = this.state.selected ? this.props.bgcolSelected : this.props.bgcol
                }
                ctx.fillRect(x*ew, y*eh, ew, eh);
            }
        }
        ctx.restore();
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
