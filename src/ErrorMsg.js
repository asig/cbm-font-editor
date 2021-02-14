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
import './FontView.css';

import React from 'react';

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

class ErrorMsg extends React.Component {

    constructor(props) {
        super(props);

        this.state = {msg: ""};

        this.render = this.render.bind(this)
        this.showError = this.showError.bind(this)
    }

    showError(msg) {
        this.setState({msg: msg})
    }

    render() {
        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            this.setState({msg: ""});
        };

        const open = this.state.msg !== ""
        return <Snackbar open={open} autoHideDuration={15000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                {this.state.msg}
            </MuiAlert>
        </Snackbar>
    }
}

export default ErrorMsg;
