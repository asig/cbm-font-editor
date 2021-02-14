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
    static dontShowVersion = "0"

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
        console.log(evt, reason)
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
                        To get you started, you need a 2k Commodore font in binary format, which you can get for example
                        from <a href="http://www.zimmers.net/anonftp/pub/cbm/firmware/characters/" target="_blank">zimmers.net</a>.
                    </p>
                    <p>
                        This is an early version with basic functionality. Most notably, multi-color fonts are not
                        supported yet.
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
