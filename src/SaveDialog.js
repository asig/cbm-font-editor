import React from 'react';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

class SaveDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {open: false};

        this.render = this.render.bind(this)
        this.showDialog = this.showDialog.bind(this)
    }

    showDialog() {
        this.setState({open: true})
    }

    render() {
        const handleClose = (event, reason) => {
            console.log("******************************************* CLOSE!!!")
            if (reason === 'clickaway') {
                return;
            }
            this.setState({open:false});
        };

        return <Dialog open={this.state.open} onClose={handleClose}>
            <DialogTitle>FOOBAR</DialogTitle>
            <DialogContent>CONTENT</DialogContent>
        </Dialog>
    }
}

export default SaveDialog;
