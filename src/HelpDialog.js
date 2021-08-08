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
import DialogActions from "@material-ui/core/DialogActions";
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Utils from "./Utils";

import './HelpDialog.css';

class HelpDialog extends React.Component {

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
            <DialogTitle>Help</DialogTitle>
            <DialogContent>
                    <table className="HelpDialog">
                        <thead>
                            <tr>
                                <th colSpan={2}>Keyboard shortcuts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={"section"}><td className={"section"} colSpan={2}>Character editing</td></tr>
                            <tr><td>i</td><td>Invert the character</td></tr>
                            <tr><td>f</td><td>Fill the character</td></tr>
                            <tr><td>c</td><td>Clear the character</td></tr>

                            <tr><td>{"<Shift> + <Crsr-Up>"}</td><td>Shift the character up</td></tr>
                            <tr><td>{"<Shift> + <Crsr-Down>"}</td><td>Shift the character down</td></tr>
                            <tr><td>{"<Shift> + <Crsr-Left>"}</td><td>Shift the character left</td></tr>
                            <tr><td>{"<Shift> + <Crsr-Right>"}</td><td>Shift the character right</td></tr>

                            <tr><td>{"<Crsr-Up>"}</td><td>Roll the character up</td></tr>
                            <tr><td>{"<Crsr-Down>"}</td><td>Roll the character down</td></tr>
                            <tr><td>{"<Crsr-Left>"}</td><td>Roll the character left</td></tr>
                            <tr><td>{"<Crsr-Right>"}</td><td>Roll the character right</td></tr>

                            <tr className={"section"}><td className={"section"} colSpan={2}>Load and save</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + o"}</td><td>Load a font</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + s"}</td><td>Save the font</td></tr>

                            <tr className={"section"}><td className={"section"} colSpan={2}>Clipboard</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + c"}</td><td>Copy</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + v"}</td><td>Paste</td></tr>

                            <tr className={"section"}><td className={"section"} colSpan={2}>History</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + z"}</td><td>Undo</td></tr>
                            <tr><td>{(Utils.isMac() ? "<Command>" : "<Ctrl>") + " + <Shift> + z"}</td><td>Redo</td></tr>

                            <tr className={"section"}><td className={"section"} colSpan={2}>Misc</td></tr>
                            <tr><td>{"<F1> or ?"}</td><td>Show this dialog</td></tr>

                        </tbody>
                    </table>
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

export default HelpDialog;
