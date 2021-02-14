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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import globals from "./globals";

class SaveDialog extends React.Component {

    static defaultState = {
        open: false,
        filename: "font.bin",
        format: "binaryPlain",
        binAddress: "$3000",
        binAddressError: "",
        basicPlatform: "c128",
        basicLine: "10000",
        basicLineError: "",
        basicStep: "10",
        basicStepError: "",
    }

    static basicStarts = {
        "c128": 0x1c01,
        "c64": 0x801,
        "c16": 0x1001,
        "plus4": 0x1001,
        "vic": 0x1001,
    }

    constructor(props) {
        super(props);

        this.state = SaveDialog.defaultState

        this.filenameModified = false

        this.render = this.render.bind(this)
        this.showDialog = this.showDialog.bind(this)
        this.handleFilenameChange = this.handleFilenameChange.bind(this)
        this.handleFormatChange = this.handleFormatChange.bind(this)
        this.updateFilenameFormat = this.updateFilenameFormat.bind(this)
        this.generateBinPlainData = this.generateBinPlainData.bind(this)
        this.generateBinPrgData = this.generateBinPrgData.bind(this)
        this.generateBasicData = this.generateBasicData.bind(this)
        this.generateCbmasmData = this.generateCbmasmData.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.updateAndValidate = this.updateAndValidate.bind(this)
        this.validateState = this.validateState.bind(this)
        this.validateNumber = this.validateNumber.bind(this)
        this.aton = this.aton.bind(this)
        this.hasErrors = this.hasErrors.bind(this)

        this.downloadLinkRef = React.createRef()
    }

    showDialog(font) {
        this.font = font
        this.filenameModified = false
        this.setState({open: true})
    }

    updateFilenameFormat(filename, format) {
        // if (this.filenameModified) {
        //     return filename
        // }
        var suffix
        switch (format) {
            case "binaryPlain":
                suffix = "bin";
                break
            case "binaryPrg":
            case "basic":
                suffix = "prg";
                break
            case "cbmasm":
                suffix = "asm";
                break
        }
        const i = filename.lastIndexOf('.')
        if (i > -1) {
            filename = filename.substring(0, i)
        }
        return filename + "." + suffix
    }

    handleFormatChange(evt) {
        const format = evt.target.value
        this.setState((prevState) => {
            const update = {format: format, filename: this.updateFilenameFormat(prevState.filename, format)}
            return this.validateState({...prevState, ...update})
        })
    }

    handleFilenameChange(evt) {
        this.filenameModified = true
        this.setState({filename: evt.target.value});
    }

    handleClose(evt, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState(SaveDialog.defaultState);
    }

    updateAndValidate(update) {
        this.setState((prevState) => {
            return this.validateState({...prevState, ...update})
        })
    }

    aton(s) {
        s = s.trim().toLowerCase()
        if (s.substr(0, 1) === "$") {
            s = "0x" + s.substr(1)
        }
        return new Number(s)
    }

    validateNumber(s) {
        const n = this.aton(s)
        if (isNaN(n)) {
            return "Not a valid number"
        }
        if (n < 0 || n > 65535) {
            return "Number out of range"
        }
        if (parseInt(n) != n) {
            return "Number is not an integer"
        }
        return ""
    }

    validateState(state) {
        var newState = {...state}
        newState.basicLineError = ""
        newState.basicStepError = ""
        newState.binAddressError = ""
        switch (newState.format) {
            case "binaryPrg":
                newState.binAddressError = this.validateNumber(newState.binAddress)
                break;
            case "basic":
                newState.basicLineError = this.validateNumber(newState.basicLine)
                newState.basicStepError = this.validateNumber(newState.basicStep)
                if (newState.basicLineError === "" && newState.basicStepError === "") {
                    // Check that *all* lines will be in range
                    const lastLine = this.aton(newState.basicLine) + 255 * this.aton(newState.basicStep)
                    if (lastLine >= 65535) {
                        newState.basicStepError = "Step size is too large."
                    }
                }
                break;
        }
        return newState
    }

    generateBinPlainData() {
        var data = new Array(0)
        for (var i = 0; i < 256; i++) {
            const c = this.font.getChar(i)
            data = data.concat(...c.getData())
        }
        return data
    }

    generateBinPrgData() {
        const addr = this.aton(this.state.binAddress)
        var data = [addr % 256, Math.floor(addr / 256)]
        return data.concat(...this.generateBinPlainData())
    }

    generateBasicData() {
        var data = new Array(0)
        var curAddr = SaveDialog.basicStarts[this.state.basicPlatform]
        var curLine = this.aton(this.state.basicLine)
        var lineInc = this.aton(this.state.basicStep)

        // load address
        data.push(curAddr % 256)
        data.push(Math.floor(curAddr / 256))

        for (var i = 0; i < 256; i++) {
            const c = this.font.getChar(i)
            var line = " " + c.getData().join(",")
            const nextAddr = curAddr + 2 /* lineNr */ + 1 /* token */ + line.length + 1 /* 0x00 */

            // Link to next line
            data.push(nextAddr % 256)
            data.push(Math.floor(nextAddr / 256))

            // Line number
            data.push(curLine % 256)
            data.push(Math.floor(curLine / 256))

            // DATA token
            data.push(0x83)

            for (var j = 0; j < line.length; j++) {
                data.push(line.charCodeAt(j))
            }

            data.push(0)

            curLine = curLine + lineInc
            curAddr = nextAddr
        }
        // null link at the end of the code
        data.push(0)
        data.push(0)

        return data
    }

    generateCbmasmData() {
        var lines = new Array(0)
        const now = new Date()
        lines.push("\t; generated by " + globals.product.name + " v" + globals.product.version + " on " + now.toISOString() + "\n")
        const charsPerLine = 2
        for (var i = 0; i < 256 / charsPerLine; i++) {
            var bytes = new Array(8 * charsPerLine)
            for (var j = 0; j < charsPerLine; j++) {
                const c = this.font.getChar(i * charsPerLine + j)
                for (var k = 0; k < 8; k++) {
                    var s = c.getData()[k].toString(16)
                    if (s.length < 2) {
                        s = "0" + s
                    }
                    bytes[j * 8 + k] = "$" + s
                }
            }
            const line = "\t.byte " + bytes.join(", ") + "\n"
            lines.push(line)
        }

        var data = new Array(0)
        for (var i = 0; i < lines.length; i++) {
            const line = lines[i]
            for (var j = 0; j < line.length; j++) {
                data.push(line.charCodeAt(j))
            }
        }
        return data
    }

    handleSave(evt) {
        var data;
        var mimeType = "application/octet-stream"
        switch (this.state.format) {
            case "binaryPlain":
                data = this.generateBinPlainData();
                break
            case "binaryPrg":
                data = this.generateBinPrgData();
                break
            case "basic":
                data = this.generateBasicData();
                break
            case "cbmasm":
                data = this.generateCbmasmData();
                mimeType = "text/plain"
                break
            default:
                console.log("Unsupported format '" + this.state.format + "'")
        }

        const dataUrl = "data:" + mimeType + ";base64," + btoa(data.reduce((data, byte) => data + String.fromCharCode(byte), ''))
        var link = this.downloadLinkRef.current
        link.setAttribute("href", dataUrl)
        link.setAttribute("download", this.state.filename)
        this.downloadLinkRef.current.click()

        this.setState(SaveDialog.defaultState);
    }

    hasErrors() {
        return this.state.binAddressError !== "" || this.state.basicLineError !== "" || this.state.basicStepError !== ""
    }

    render() {
        return <Dialog open={this.state.open} onClose={this.handleClose} disableBackdropClick>
            <DialogTitle>Save font</DialogTitle>
            <DialogContent>
                <FormControl variant="outlined" margin="dense">
                    <InputLabel htmlFor="filename">Filename</InputLabel>
                    <OutlinedInput label="Filename" id="filename" value={this.state.filename}
                                   onChange={this.handleFilenameChange}/>
                </FormControl>

                <Divider variant="fullWidth" style={{margin: "0.5rem"}}/>

                <RadioGroup value={this.state.format} onChange={this.handleFormatChange}>

                    {/* ================ plain binary section ================== */}
                    <FormControlLabel value="binaryPlain" control={<Radio/>} label="Save as binary (plain)"/>
                    <FormControl variant="outlined"
                                 disabled={this.state.format !== "binaryPlain"}
                                 margin="dense">
                    </FormControl>

                    <Divider variant="fullWidth" style={{margin: "0.5rem"}}/>

                    {/* ================ prg binary section ================== */}
                    <FormControlLabel value="binaryPrg" control={<Radio/>} label="Save as binary (PRG)"/>
                    <FormControl variant="outlined"
                                 error={this.state.binAddressError !== ""}
                                 disabled={this.state.format !== "binaryPrg"}
                                 margin="dense">
                        <InputLabel htmlFor="binSAddress">Address</InputLabel>
                        <OutlinedInput label="Address" id="binAddress" value={this.state.binAddress}
                                       onChange={(evt) => this.updateAndValidate({binAddress: evt.target.value})}/>
                        <FormHelperText id="binAddress">{this.state.binAddressError}</FormHelperText>
                    </FormControl>

                    <Divider variant="fullWidth" style={{margin: "0.5rem"}}/>

                    {/* ================ BASIC section ================== */}
                    <FormControlLabel value="basic" control={<Radio/>} label="Save as BASIC program"/>

                    <FormControl variant="outlined" disabled={this.state.format !== "basic"} margin="dense">
                        <InputLabel id="basicPlatformLabel">Machine</InputLabel>
                        <Select
                            labelId="basicPlatformLabel"
                            id="basicPlatform"
                            label="Machine"
                            value={this.state.basicPlatform}
                            onChange={(evt) => this.updateAndValidate({basicPlatform: evt.target.value})}
                        >
                            <MenuItem value="c128">C-128</MenuItem>
                            <MenuItem value="c64">C-64</MenuItem>
                            <MenuItem value="c16">C-16</MenuItem>
                            <MenuItem value="plus4">Plus/4</MenuItem>
                            <MenuItem value="vic">VIC-20</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" error={this.state.basicLineError !== ""}
                                 disabled={this.state.format !== "basic"} margin="dense">
                        <InputLabel htmlFor="basicLine">First line</InputLabel>
                        <OutlinedInput label="First line" id="basicLine" value={this.state.basicLine}
                                       onChange={(evt) => this.updateAndValidate({basicLine: evt.target.value})}/>
                        <FormHelperText id="basicLine">{this.state.basicLineError}</FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" error={this.state.basicStepError !== ""}
                                 disabled={this.state.format !== "basic"} margin="dense">
                        <InputLabel htmlFor="basicStep">Step</InputLabel>
                        <OutlinedInput label="Step" id="basicStep" value={this.state.basicStep}
                                       onChange={(evt) => this.updateAndValidate({basicStep: evt.target.value})}/>
                        <FormHelperText id="basicStep">{this.state.basicStepError}</FormHelperText>
                    </FormControl>

                    <Divider variant="fullWidth" style={{margin: "0.5rem"}}/>

                    {/* ================ cbmasm section ================== */}
                    <FormControlLabel value="cbmasm" control={<Radio/>} label="Save in cbmasm format"/>

                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={this.handleSave} disabled={this.hasErrors()}>
                    Save
                </Button>
            </DialogActions>
            <a style={{display: "none"}} ref={this.downloadLinkRef}/>
        </Dialog>
    }
}

export default SaveDialog;
