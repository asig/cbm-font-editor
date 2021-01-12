import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { withStyles } from "@material-ui/core/styles";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretUp, faCaretDown, faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons"

import Char from "./Char";
import CharEditField from "./CharEditField";
import DirectionTable from "./DirectionTable";

import './App.css';

const styles = theme => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});


class App extends React.Component {


    constructor(props) {
        super(props);

        this.invert = this.invert.bind(this)
        this.render = this.render.bind(this)
        this.setPixel = this.setPixel.bind(this)
        this.rotateUp = this.rotateUp.bind(this)
        this.rotateDown = this.rotateDown.bind(this)
        this.rotateLeft = this.rotateLeft.bind(this)
        this.rotateRight = this.rotateRight.bind(this)
        this.shiftUp = this.shiftUp.bind(this)
        this.shiftDown = this.shiftDown.bind(this)
        this.shiftLeft = this.shiftLeft.bind(this)
        this.shiftRight = this.shiftRight.bind(this)

        this.charEditFieldRef = React.createRef();

    }

    setPixel(x, y, val) {
        if (x < 0 || x > 7 || y < 0 || y > 7) return;
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
                const b = state.data.data
                var res = b.map(v => v)
                if (val > 0) {
                    res[y] = res[y] | (1<<x)
                } else {
                    res[y] = res[y] & ~(1<<x)
                }
                return {data:new Char(res)}
            }
        );
    }

    rotateUp() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
            const b = state.data.data
            return {data:new Char([b[1],b[2], b[3], b[4], b[5], b[6], b[7], b[0]])};
        });
    }

    rotateDown() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
            const b = state.data.data
            return {data:new Char([b[7], b[0], b[1],b[2], b[3], b[4], b[5], b[6]])};
        });
    }

    rotateLeft() {
        console.log("**** ROTATE LEFT ****")
    }

    rotateRight() {
        console.log("**** ROTATE RIGHT ****")
    }

    shiftUp() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
            const b = state.data.data
            return {data:new Char([b[1], b[2], b[3], b[4], b[5], b[6], b[7], 0])};
        });
    }

    shiftDown() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
            const b = state.data.data
            return {data:new Char([0, b[0], b[1], b[2], b[3], b[4], b[5], b[6]])};
        });
    }

    shiftLeft() {
        console.log("**** SHIFT LEFT ****")
    }

    shiftRight() {
        console.log("**** SHIFT RIGHT ****")
    }

    invert() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => {
            const b = state.data.data
            return {data:new Char(b.map(v => (~v) & 0xff))};
        });
    }

    render() {
        return (
            <Grid container justify="center" alignItems="flex-start" spacing={3}>
                <Grid item xs={4}>
                    <CharEditField
                        ref={this.charEditFieldRef}
                        fgcol = "black"
                        bgcol="white"
                        bordercol="darkgray"
                        setPixel={this.setPixel}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Paper>FullXXX Font</Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>

                        Commands

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={this.invert}>
                            Invert
                        </Button>

                        <DirectionTable
                            title="Rotate"
                            onUp={this.rotateUp}
                            onDown={this.rotateDown}
                            onLeft={this.rotateLeft}
                            onRight={this.rotateRight}
                        />

                        <DirectionTable
                            title="Shift"
                            onUp={this.shiftUp}
                            onDown={this.shiftDown}
                            onLeft={this.shiftLeft}
                            onRight={this.shiftRight}
                        />

                    </Paper>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles, { withTheme: true })(App);

