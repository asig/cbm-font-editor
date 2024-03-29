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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import globals from "./globals";

class WelcomeDialog extends React.Component {

    static defaultState = {
        open: false,
        dontShow: false,
    }

    static dontShowKey = "dontShowWelcomeVersion"
    static dontShowVersion = "3"

    constructor(props) {
        super(props);

        // Only show the dialog if the user did not opt out.
        var v = localStorage.getItem(WelcomeDialog.dontShowKey)
        const dontShow = v === WelcomeDialog.dontShowVersion
        this.state = {
            open: !dontShow,
            dontShow: dontShow,
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleDontShow = this.handleDontShow.bind(this)
        this.render = this.render.bind(this)
    }

    showDialog() {
    }

    handleClose(evt, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({open: false});
    }

    handleDontShow(evt) {
        const checked = evt.target.checked
        if (checked) {
            localStorage.setItem(WelcomeDialog.dontShowKey, WelcomeDialog.dontShowVersion)
        } else {
            localStorage.removeItem(WelcomeDialog.dontShowKey)
        }
        this.setState({dontShow: checked});
    }

    render() {
        return <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>Welcome to {globals.product.name} v{globals.product.version}!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p>
                        With this little tool, you can modify fonts for a wide range of Commodore home computers, and
                        download your creations as binary files (in plain and 'prg' format), as BASIC programs or
                        as source code for the <code>cbmasm</code> cross-assembler.
                    </p>
                    <p>
                        As of version 0.2, both monochrome and multicolor fonts are supported. Version 0.3 added
                        keyboard shortcuts, and version 0.4 contains now some Commodore ROM fonts to get you started.
                    </p>
                    <p>
                        And last but not least, this app completely runs in your browser. All your data is kept on your
                        own machine, nothing is sent over the internets!
                    </p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <FormGroup row>
                    <FormControlLabel
                        control={<Checkbox checked={this.state.dontShow} onChange={this.handleDontShow} name={"dontShow"}/>}
                        label="Don't show this again"
                    />
                    <Button variant="contained" onClick={this.handleClose}>
                        Close
                    </Button>
                </FormGroup>
            </DialogActions>
        </Dialog>
    }
}

export default WelcomeDialog;
