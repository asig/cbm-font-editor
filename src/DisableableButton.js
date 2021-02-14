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
import Button from "@material-ui/core/Button";

class DisableableButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = { enabled: props.enabled !== undefined ? props.enabled : true}

        this.render = this.render.bind(this)
        this.setEnabled = this.setEnabled.bind(this)
    }

    setEnabled(e) {
        this.setState({enabled: e})
    }

    render() {
        return <Button
            style={this.props.style}
            size={this.props.size}
            startIcon={this.props.startIcon}
            variant={this.props.variant}
            disabled={!this.state.enabled}
            onClick={this.props.onClick}>
            {this.props.children}
        </Button>
    }
}

export default DisableableButton;
