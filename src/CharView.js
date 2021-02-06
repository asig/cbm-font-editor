import './CharView.css';

import React from 'react';
import Char from './model/Char'

class CharView extends React.Component {

    static defaultProps = {
        fgcol: "black",
        fillcol: "black",
        bgcol: "white",
        fillcolSelected: "#880000",
        bgcolSelected: "#FFCCCC",
    }

    constructor(props) {
        super(props);

        this.state = {
            char: new Char(null)
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
