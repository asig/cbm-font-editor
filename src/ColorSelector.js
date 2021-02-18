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

import theme from "./theme"

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PalettePicker from "./PalettePicker";

class ColorSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            color: props.color,
            selected: props.selected,
            anchorEl: null,
            popperOpen: false,
        };
    }

    handleToggle = (evt) => {
        this.setState((prevState) => {
            return {
                anchorEl: prevState.anchorEl ? null : evt.target,
                popperOpen: prevState.anchorEl ? false : true
            }
        })

    }

    onPopperCancelled = (evt) => {
        this.setState({
            anchorEl: null,
            popperOpen: false
        })
    }

    onColorSelected = (col) => {
        this.setState({
            color: col,
            anchorEl: null,
            popperOpen: false
        })
        this.props.onColorSelected(col)
    }

    render() {
        var style = {margin: "2px" }
        if (this.props.selected) {
            style = {border: "2px solid " + theme.palette.secondary.main}
        }

        var textCol = this.state.color === "#000000" ? "#ffffff" : "#000000"

        return <ButtonGroup style={style}>
            <Button style={{backgroundColor: this.state.color, color: textCol, padding:0, margin:0}} onClick={this.props.onClick}>
                {this.props.children}
            </Button>
            <Button
                style={{backgroundColor: this.state.color, color: textCol, padding:0, margin:0, minWidth:0}}
                size="small"
                onClick={this.handleToggle}
            >
                <ArrowDropDownIcon />
            </Button>
            <Popper open={this.state.popperOpen} anchorEl={this.state.anchorEl}>
                <PalettePicker
                    MYASS = "Foorbar"
                    onCancel={this.onPopperCancelled}
                    onColorSelected={this.onColorSelected}
                />
            </Popper>
        </ButtonGroup>
    }
}

export default ColorSelector;
