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
            this.setState({msg:""});
        };

        const open = this.state.msg !== ""
        return <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} elevation={6} variant="filled" severity="error">
                {this.state.msg}
            </MuiAlert>
        </Snackbar>
    }
}

export default ErrorMsg;
