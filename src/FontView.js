import './FontView.css';

import React from 'react';
import CharView from "./CharView";

class FontView extends React.Component {

    constructor(props) {
        super(props);

        this.selected = 0;

        this.render = this.render.bind(this)
        this.renderRow = this.renderRow.bind(this)
        this.renderCol = this.renderCol.bind(this)
        this.setFont = this.setFont.bind(this)
        this.updateSelectedChar = this.updateSelectedChar.bind(this)
        this.selectChar = this.selectChar.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

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

    updateSelectedChar(c) {
        this.charRefs[this.selected].current.setChar(c)
    }

    selectChar(i) {
        this.charRefs[this.selected].current.setSelected(false)
        this.selected = i
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
        return <table>
            <tbody>
            {rows}
            </tbody>
        </table>
    }

}

export default FontView;
