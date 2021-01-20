import React from "react";
import Button from "@material-ui/core/Button";

class DisableableButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = { enabled: this.props.enabled}

        this.render = this.render.bind(this)
        this.setEnabled = this.setEnabled.bind(this)
    }

    setEnabled(e) {
        this.setState({enabled: e})
    }

    render() {
        return <Button
            variant={this.props.variant}
            disabled={!this.state.enabled}
            onClick={this.props.onClick}>
            {this.props.children}
        </Button>
    }
}

export default DisableableButton;
