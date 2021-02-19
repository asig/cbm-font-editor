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
import React from "react"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"

import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'

import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Char from "./model/Char"
import Font from "./model/Font"

import Clipboard from "./Clipboard"
import DisableableButton from "./DisableableButton"
import CharEditField from "./CharEditField"
import DirectionTable from "./DirectionTable"
import FontView from "./FontView"

import palette from "./palette"

import './App.css';
import RotationTable from "./RotationTable";
import ColorSelector from "./ColorSelector";

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this)
        this.loadFont = this.loadFont.bind(this)
        this.modifyChar = this.modifyChar.bind(this)
        this.selectChar = this.selectChar.bind(this)
        this.canUndo = this.canUndo.bind(this)
        this.canRedo = this.canRedo.bind(this)
        this.copy = this.copy.bind(this)
        this.paste = this.paste.bind(this)
        this.undo = this.undo.bind(this)
        this.redo = this.redo.bind(this)
        this.addToHistory = this.addToHistory.bind(this)
        this.resetHistory = this.resetHistory.bind(this)
        this.applyHistoryState = this.applyHistoryState.bind(this)
        this.selectColor = this.selectColor.bind(this)
        this.setColor = this.setColor.bind(this)
        this.switchMulticol = this.switchMulticol.bind(this)

        this.charEditFieldRef = React.createRef();
        this.fontViewRef = React.createRef();
        this.fileInputRef = React.createRef()
        this.undoBtnRef = React.createRef()
        this.redoBtnRef = React.createRef()
        this.clipboardRef = React.createRef()

        this.state = {
            selectedColor: 3,
            multicol: false,
            cols: [palette[1], palette[11], palette[13], palette[0]],
        }
        this.font = new Font(null);
        this.selectedChar = 0;

        this.history = [{selected: 0, ch: new Char(null)}];
        this.historyCurPos = 0;
    }

    applyHistoryState(s) {
        if ('selected' in s) {
            this.selectedChar = s.selected
            this.fontViewRef.current.selectChar(this.selectedChar);
            this.charEditFieldRef.current.setChar(this.font.getChar(this.selectedChar))
        }
        if ('ch' in s) {
            this.charEditFieldRef.current.setChar(s.ch)
            const fv = this.fontViewRef.current
            fv.updateChar(this.selectedChar, s.ch);
            this.font.setChar(this.selectedChar, s.ch)
        }
    }

    addToHistory(s) {
        this.history.length = this.historyCurPos + 1
        this.history.push(s)
        this.historyCurPos++;
        this.undoBtnRef.current.setEnabled(this.canUndo())
        this.redoBtnRef.current.setEnabled(this.canRedo())
    }

    resetHistory(curState) {
        this.history = [curState];
        this.historyCurPos = 0;
        this.undoBtnRef.current.setEnabled(this.canUndo())
        this.redoBtnRef.current.setEnabled(this.canRedo())
    }

    canUndo() {
        return this.historyCurPos > 0
    }

    canRedo() {
        return this.historyCurPos < this.history.length - 1
    }

    copy() {
        this.clipboardRef.current.setChar(this.font.getChar(this.selectedChar))
    }

    paste() {
        this.updateChar(this.clipboardRef.current.getChar())
    }

    undo() {
        this.historyCurPos--;
        this.applyHistoryState(this.history[this.historyCurPos])
        this.undoBtnRef.current.setEnabled(this.canUndo())
        this.redoBtnRef.current.setEnabled(this.canRedo())
    }

    redo() {
        this.historyCurPos++;
        this.applyHistoryState(this.history[this.historyCurPos])
        this.undoBtnRef.current.setEnabled(this.canUndo())
        this.redoBtnRef.current.setEnabled(this.canRedo())
    }

    updateChar(newChar) {
        this.font.setChar(this.selectedChar, newChar)
        this.charEditFieldRef.current.setChar(newChar)
        this.fontViewRef.current.updateChar(this.selectedChar, newChar);
        this.addToHistory({selected: this.selectedChar, ch: newChar})
    }

    modifyChar(modifierFunc) {
        this.updateChar(modifierFunc(this.font.getChar(this.selectedChar)))
    }

    selectChar(i) {
        if (this.selectedChar === i) {
            return
        }
        this.selectedChar = i;
        const c = this.font.getChar(i)
        this.charEditFieldRef.current.setState({data: c})
        this.fontViewRef.current.selectChar(i);
        this.addToHistory({selected: i, ch: c})
    }

    loadFont(f) {
        if (f == null) {
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const len = e.target.result.byteLength;
            if (len !== 2048 && len !== 2050) {
                this.props.errorMessageRef.current.showError("Can't load font: invalid file length " + len)
                return
            }
            var data = new Uint8Array(e.target.result)
            if (len === 2050) {
                // binary file with load address at ofs 0
                data = data.slice(2)
            }

            const fv = this.fontViewRef.current
            const cef = this.charEditFieldRef.current

            // Set new font
            const chars = [...Array(256).keys()].map((i) => new Char(data.slice(i * 8, i * 8 + 8)))
            this.font = new Font(chars)
            fv.setFont(this.font)

            // Set selected char
            const ch = this.font.getChar(this.selectedChar)
            cef.setChar(ch)

            this.resetHistory({selected: this.selectedChar, ch: ch})
        };
        reader.onerror = (e) => {
            this.props.errorMessageRef.current.showError("Error while loading file: " + e)
        }
        reader.readAsArrayBuffer(f);
    }

    selectColor(idx) {
        this.setState({selectedColor: idx})
    }

    setColor(idx, col) {
        console.log("setting color: ", idx, col)
        this.setState((prevState) => {
            const cols = prevState.cols
            cols[idx] = col
            return { cols: cols}
        })
    }

    switchMulticol(mc) {
        var selectedColor = this.state.selectedColor
        if (!mc) {
            // Make sure the selected color is in singlo color range
            if (selectedColor > 0) {
                selectedColor = 3
            }
        }
        this.setState({
            multicol: mc,
            selectedColor: selectedColor
        })
    }

    render() {
        return (
            <Grid container justify="center" alignItems="stretch" spacing={3} style={{flexGrow: 1}}>
                <Grid item xs={3} style={{height: "100%"}}>
                    <Card elevation={0}>
                        <CardHeader title={"Character"}/>
                        <CardContent>
                            <CharEditField
                                zoom={25}
                                ref={this.charEditFieldRef}
                                cols={this.state.cols}
                                selectedColor={this.state.selectedColor}
                                bordercol="darkgray"
                                setPixel={(x, y, val) => this.modifyChar((c) => c.set(x, y, val))}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={9} style={{height: "100%"}}>
                    <Card elevation={0} style={{height: "100%"}}>
                        <CardHeader title={"Font"}/>
                        <CardContent>
                            <Box display="flex" flexDirection="row">
                                <Box>
                                    <FontView ref={this.fontViewRef}
                                              zoom={3}
                                              cols={this.state.cols}
                                              onSelectChar={this.selectChar}
                                    />
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Box>
                                        {/* See https://stackoverflow.com/questions/8350927/file-upload-button-without-input-field for details */}
                                        <input
                                            ref={this.fileInputRef}
                                            type="file"
                                            style={{display: "none"}}
                                            value="" // Need to set to empty string so that onchange triggers even if the same file is selected again
                                            onChange={(e) => this.loadFont(e.target.files.item(0))}
                                        />
                                        <DisableableButton
                                            style={{marginBottom: "1rem", marginLeft: "1rem"}}
                                            variant="contained"
                                            onClick={() => this.fileInputRef.current.click()}>
                                            Load
                                        </DisableableButton>
                                    </Box>
                                    <DisableableButton
                                        style={{marginBottom: "1rem", marginLeft: "1rem"}}
                                        variant="contained"
                                        onClick={() => this.props.saveDialogRef.current.showDialog(this.font)}>
                                        Save
                                    </DisableableButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card elevation={0}>
                        <CardHeader title={"Colors"}/>
                        <CardContent style={{paddingTop: 0}}>
                            <Box display="flex" flexDirection="column">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.multicol}
                                            onChange={(evt) => this.switchMulticol(evt.target.checked)}
                                        />
                                    }
                                    label="Multi-Color"
                                />
                                <Box>
                                    <ColorSelector
                                        color={this.state.cols[0]}
                                        selected={this.state.selectedColor === 0}
                                        onClick={() => this.selectColor(0)}
                                        onColorSelected={(col) => this.setColor(0, col)}
                                    >
                                        BG
                                    </ColorSelector>
                                    <ColorSelector
                                        color={this.state.cols[3]}
                                        selected={this.state.selectedColor === 3}
                                        onClick={() => this.selectColor(3)}
                                        onColorSelected={(col) => this.setColor(3, col)}
                                    >
                                        FG
                                    </ColorSelector>
                                </Box>
                                {this.state.multicol &&
                                <Box>
                                    <ColorSelector
                                        color={this.state.cols[1]}
                                        selected={this.state.selectedColor === 1}
                                        onClick={() => this.selectColor(1)}
                                        onColorSelected={(col) => this.setColor(1, col)}
                                    >
                                        C1
                                    </ColorSelector>
                                    <ColorSelector
                                        color={this.state.cols[2]}
                                        selected={this.state.selectedColor === 2}
                                        onClick={() => this.selectColor(2)}
                                        onColorSelected={(col) => this.setColor(2, col)}
                                    >
                                        C2
                                    </ColorSelector>
                                </Box>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={1}>
                    <Card elevation={0}>
                        <CardHeader title={"Roll"}/>
                        <CardContent>
                            <DirectionTable
                                style={{height: "100%"}}
                                title=""
                                onUp={() => this.modifyChar((c) => c.rollUp())}
                                onDown={() => this.modifyChar((c) => c.rollDown())}
                                onLeft={() => this.modifyChar((c) => c.rollLeft())}
                                onRight={() => this.modifyChar((c) => c.rollRight())}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={1}>
                    <Card elevation={0}>
                        <CardHeader title={"Shift"}/>
                        <CardContent>
                            <DirectionTable
                                style={{height: "100%"}}
                                title=""
                                onUp={() => this.modifyChar((c) => c.shiftUp())}
                                onDown={() => this.modifyChar((c) => c.shiftDown())}
                                onLeft={() => this.modifyChar((c) => c.shiftLeft())}
                                onRight={() => this.modifyChar((c) => c.shiftRight())}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card elevation={0}>
                        <CardHeader title={"Rotate/Flip"}/>
                        <CardContent>
                            <RotationTable
                                style={{height: "100%"}}
                                onFlipHorizontally={() => this.modifyChar((c) => c.flipHorizontally())}
                                onFlipVertically={() => this.modifyChar((c) => c.flipVertically())}
                                onRotateCcw={() => this.modifyChar((c) => c.rotateCcw())}
                                onRotateCw={() => this.modifyChar((c) => c.rotateCw())}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card elevation={0}>
                        <CardHeader title={"Clipboard"}/>
                        <CardContent>
                            <Clipboard
                                style={{height: "100%"}}
                                ref={this.clipboardRef}
                                cols={this.state.cols}
                                onCopy={this.copy}
                                onPaste={this.paste}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardHeader title={"Other"}/>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" flex={1}>
                                <Box flex={1}>
                                    <DisableableButton
                                        style={{width: "90%"}}
                                        variant="contained"
                                        onClick={() => this.modifyChar((c) => c.invert())}>
                                        Invert
                                    </DisableableButton>
                                </Box>
                                <Box flex={1}>
                                    <DisableableButton
                                        style={{width: "90%"}}
                                        variant="contained"
                                        onClick={() => this.modifyChar((c) => c.clear())}>
                                        Clear
                                    </DisableableButton>
                                </Box>
                                <Box flex={1}>
                                    <DisableableButton
                                        style={{width: "90%"}}
                                        variant="contained"
                                        onClick={() => this.modifyChar((c) => c.fill())}>
                                        Fill
                                    </DisableableButton>
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Box>
                                        <DisableableButton
                                            style={{width: "90%", marginBottom:"0.5rem"}}
                                            startIcon={<UndoIcon/>}
                                            enabled={this.canUndo()}
                                            variant="contained"
                                            ref={this.undoBtnRef}
                                            onClick={this.undo}>
                                            Undo
                                        </DisableableButton>
                                    </Box>
                                    <Box>
                                        <DisableableButton
                                            style={{width: "90%"}}
                                            enabled={this.canRedo()}
                                            variant="contained"
                                            ref={this.redoBtnRef}
                                            startIcon={<RedoIcon/>}
                                            onClick={this.redo}>
                                            Redo
                                        </DisableableButton>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}


export default Content;

