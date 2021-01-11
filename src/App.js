import logo from './logo.svg';
import './App.css';

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import CharEditField from "./CharEditField.js";
import React from "react";

import { withStyles } from "@material-ui/core/styles";

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

        this.charEditFieldRef = React.createRef();

    }

    setPixel(x, y, val) {
        if (x < 0 || x > 7 || y < 0 || y > 7) return;
        const ef = this.charEditFieldRef.current
        ef.setState((state) => { return {data:state.data.set(x, y, val)}; });
    }

    invert() {
        const ef = this.charEditFieldRef.current
        ef.setState((state) => { return {data:state.data.invert()}; });
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
                        <Grid container justify="center" alignItems="flex-start" spacing={3}>
                            <Grid item xs={1}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.invert}>
                                    Invert
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles, { withTheme: true })(App);

