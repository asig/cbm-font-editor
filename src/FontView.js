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
import './FontView.css';

import React from 'react';
import CharView from "./CharView";

class FontView extends React.Component {

    constructor(props) {
        super(props);

        this.render = this.render.bind(this)
        this.renderRow = this.renderRow.bind(this)
        this.renderCol = this.renderCol.bind(this)
        this.setFont = this.setFont.bind(this)
        this.updateChar = this.updateChar.bind(this)
        this.selectChar = this.selectChar.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

        this.selected = 0;
        this.charRefs = [...Array(256).keys()].map(i => React.createRef() )
    }

    componentDidMount() {
        this.charRefs[this.selected].current.setSelected(true)
    }

    setFont(f) {
        for (var i = 0; i < 256; i++) {
            this.charRefs[i].current.setChar(f.getChar(i))
        }
    }

    updateChar(i, c) {
        this.charRefs[i].current.setChar(c)
    }

    selectChar(sel) {
        this.charRefs[this.selected].current.setSelected(false)
        this.selected = sel
        this.charRefs[this.selected].current.setSelected(true)
    }

    renderCol(i) {
        return <td key={"c"+i}
                   onClick={() => this.props.onSelectChar(i)}>
            <CharView fgcol={this.props.fgcol} bgcol={this.props.bgcol} zoom={this.props.zoom} ref={this.charRefs[i]}/>
        </td>
    }

    renderRow(i) {
        const cols = [...Array(32).keys()].map(j => this.renderCol(i*32+j))
        return <tr key={"r"+i}>{cols}</tr>
    }

    render() {
        const rows = [...Array(8).keys()].map(i => this.renderRow(i))
        return <table className="FontView">
            <tbody>
            {rows}
            </tbody>
        </table>
    }

}

export default FontView;
