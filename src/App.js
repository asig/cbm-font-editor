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
import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {ThemeProvider} from "@material-ui/styles";

import Logo from "./logo.svg"

import theme from "./theme"

import './App.css';

import Content from "./Content";
import WelcomeDialog from "./WelcomeDialog";
import ErrorMsg from "./ErrorMsg";
import SaveDialog from "./SaveDialog";
import AboutDialog from "./AboutDialog";
import HelpDialog from "./HelpDialog";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this)

        this.errorMessageRef = React.createRef()
        this.saveDialogRef = React.createRef()
        this.aboutDialogRef = React.createRef()
        this.helpDialogRef = React.createRef()
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container>
                    <Grid container justify="center" alignItems="flex-end" spacing={3}>
                        <Grid item xs={12}>
                            <img src={Logo} width={"100%"} alt={"CBM Font Editor"}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Content
                                errorMessageRef={this.errorMessageRef}
                                saveDialogRef={this.saveDialogRef}
                                aboutDialogRef={this.aboutDialogRef}
                                helpDialogRef={this.helpDialogRef}
                            />
                        </Grid>
                    </Grid>
                </Container>
                <footer>
                    © 2022 Andreas Signer
                </footer>
                <ErrorMsg ref={this.errorMessageRef}/>
                <WelcomeDialog open={true}/>
                <SaveDialog ref={this.saveDialogRef} />
                <AboutDialog ref={this.aboutDialogRef} />
                <HelpDialog ref={this.helpDialogRef} />
            </ThemeProvider>
        );
    }
}

export default App;

