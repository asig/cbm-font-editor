import React from 'react';
import Char from './model/Char'

class CharEditField extends React.Component {

    constructor(props) {
        super(props);

        console.log(props)

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        this.setChar = this.setChar.bind(this);

        this.state = {
            data: new Char(null)
        };

        this.pressed = false;
        this.pixelVal = 0

        this.canvasRef = React.createRef();
    }

    setChar(c) {
        if (c === undefined) {
            console.log("NOT GOOD")
        }
        this.setState({data: c})
    }

    drawCanvas() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const ew = canvas.width/8;
        const eh = canvas.height/8;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.props.bordercol
        ctx.lineWidth = 1
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                const v = this.state.data.get(x,y)
                if (v) {
                    ctx.fillStyle = this.props.fgcol
                } else {
                    ctx.fillStyle = this.props.bgcol
                }
                ctx.fillRect(x*ew, y*eh, ew, eh);
                ctx.strokeRect(x*ew, y*eh, ew, eh)
            }
        }
        ctx.restore();
    }

    componentDidMount() {
        this.drawCanvas()
    }

    componentDidUpdate() {
        this.drawCanvas()
    }

    mouseDown(e) {
        this.pressed = true

        // Get pixel under cursor
        const canvas = this.canvasRef.current;
        const ew = canvas.width/8;
        const eh = canvas.height/8;
        const x = Math.floor(e.pageX/ew)
        const y = Math.floor(e.pageY/eh)
        if (x < 0 || x > 7 || y < 0 || y > 7) return;
        this.px = x;
        this.py = y;

        var pix = this.state.data.get(x,y)
        if (pix) {
            this.pixelVal = 0
        } else {
            this.pixelVal = 1
        }
        this.props.setPixel(x, y, this.pixelVal)
    }

    mouseUp() {
        this.pressed = false
    }

    mouseMove(e) {
        if (this.pressed) {
            const canvas = this.canvasRef.current;
            const ew = canvas.width/8;
            const eh = canvas.height/8;

            const x = Math.floor(e.pageX/ew)
            const y = Math.floor(e.pageY/eh)
            if (x < 0 || x > 7 || y < 0 || y > 7) return;
            if (this.px === x && this.py === y) return;
            this.px = x;
            this.py = y;

            this.props.setPixel(x, y, this.pixelVal)
        }
    }

    render() {
        return <canvas
            ref={this.canvasRef}
            width={8*40 + "px"}
            height={8*40 + "px"}
            style={{border: "1px solid " + this.props.bordercol}}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
        ></canvas>
    }

}

export default CharEditField;
