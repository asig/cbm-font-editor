import React from "react";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {ThemeProvider} from "@material-ui/styles";

import Logo from "./logo.svg"

import globals from "./globals"

import './App.css';

import Content from "./Content";

const theme = createMuiTheme({
    overrides: {
        MuiContainer: {
            root: {
                backgroundColor: globals.colors.bg,
            },
        },
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this)
    }


    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container  >
                    <Grid container justify="center" alignItems="flex-end" spacing={3}>
                        <Grid item xs={12}>
                            <img src={Logo} width={"100%"} alt={"CBM Font Editor"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Content/>
                        </Grid>
                    </Grid>
                </Container>
                <footer>
                    © 2021 Andreas Signer
                </footer>
            </ThemeProvider>
        );
    }
}


export default App;

