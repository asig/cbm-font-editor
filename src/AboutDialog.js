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

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import globals from "./globals";

class AboutDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }

        this.handleClose = this.handleClose.bind(this)
        this.render = this.render.bind(this)
    }

    showDialog() {
        this.setState({open:true})
    }

    handleClose(evt, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({open: false});
    }

    render() {
        return <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>About</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <b>{globals.product.name} v{globals.product.version}</b>
                    <p>
                        © 2021 Andreas Signer
                    </p>
                    <p>
                        <a href="https://github.com/asig/cbm-font-editor">github.com/asig/cbm-font-editor</a>
                    </p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <FormGroup row>
                    <Button variant="contained" onClick={this.handleClose}>
                        Close
                    </Button>
                </FormGroup>
            </DialogActions>
        </Dialog>
    }
}

export default AboutDialog;
