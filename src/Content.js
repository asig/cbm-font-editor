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

import UndoIcon from '@material-ui/icons/Undo'
import RedoIcon from '@material-ui/icons/Redo'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'

import Char from "./model/Char"
import Font from "./model/Font"

import Clipboard from "./Clipboard"
import DisableableButton from "./DisableableButton"
import CharEditField from "./CharEditField"
import DirectionTable from "./DirectionTable"
import FontView from "./FontView"
import RotationTable from "./RotationTable"
import ColorSelector from "./ColorSelector"
import Utils from "./Utils"

import palette from "./palette"

import './App.css'
import EmbeddedFonts from "./EmbeddedFonts"

import './FontMenuItem.css'

function FontMenuItem(props) {
    if (props.isSeparator) {
        return <hr class={"FontMenuItem"}/>
    }
    return (
        <MenuItem className={["FontMenuItem", props.classNames]} onClick={props.onClick}>{props.children}</MenuItem>
    );
}


class Content extends React.Component {

    constructor(props) {
        super(props);

        this.render = this.render.bind(this)
        this.loadFontFromData = this.loadFontFromData.bind(this)
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
        this.handleKeyEvent = this.handleKeyEvent.bind(this)

        this.shiftUp = this.shiftUp.bind(this)
        this.shiftDown = this.shiftDown.bind(this)
        this.shiftLeft = this.shiftLeft.bind(this)
        this.shiftRight = this.shiftRight.bind(this)
        this.rollUp = this.rollUp.bind(this)
        this.rollDown = this.rollDown.bind(this)
        this.rollLeft = this.rollLeft.bind(this)
        this.rollRight = this.rollRight.bind(this)

        this.invertChar = this.invertChar.bind(this)
        this.clearChar = this.clearChar.bind(this)
        this.fillChar = this.fillChar.bind(this)

        this.showLoadFontDlg = this.showLoadFontDlg.bind(this)
        this.showSaveFontDlg = this.showSaveFontDlg.bind(this)
        this.showHelp = this.showHelp.bind(this)
        this.showAbout = this.showAbout.bind(this)

        this.showLoadMenu = this.showLoadMenu.bind(this)
        this.closeLoadMenu = this.closeLoadMenu.bind(this)

        this.charEditFieldRef = React.createRef();
        this.fontViewRef = React.createRef();
        this.fileInputRef = React.createRef()
        this.undoBtnRef = React.createRef()
        this.redoBtnRef = React.createRef()
        this.clipboardRef = React.createRef()

        this.state = {
            selectedChar: 0,
            selectedColor: 3,
            multicol: false,
            cols: [palette[1], palette[11], palette[13], palette[0]],
            loadMenuAnchor: null,
        }
        this.font = new Font(null);

        this.history = [{selected: 0, ch: new Char(null)}];
        this.historyCurPos = 0;

        this.keyboardShortcuts = [
            {
                spec: ["SHIFT|ArrowUp"],
                handler: this.shiftUp
            },
            {
                spec: ["SHIFT|ArrowDown"],
                handler: this.shiftDown
            },
            {
                spec: ["SHIFT|ArrowLeft"],
                handler: this.shiftLeft
            },
            {
                spec: ["SHIFT|ArrowRight"],
                handler: this.shiftRight
            },
            {
                spec: ["ArrowUp"],
                handler: this.rollUp
            },
            {
                spec: ["ArrowDown"],
                handler: this.rollDown
            },
            {
                spec: ["ArrowLeft"],
                handler: this.rollLeft
            },
            {
                spec: ["ArrowRight"],
                handler: this.rollRight
            },
            {
                key: ["F1", "?"],
                handler: this.showHelp
            },
            {
                spec: [Utils.isMac() ? "META|s" : "CTRL|s"],
                handler: this.showSaveFontDlg
            },
            {
                spec: [Utils.isMac() ? "META|o" : "CTRL|o"],
                handler: this.showLoadFontDlg
            },
            {
                spec: [Utils.isMac() ? "META|c" : "CTRL|c"],
                handler: this.copy
            },
            {
                spec: [Utils.isMac() ? "META|v" : "CTRL|v"],
                handler: this.paste
            },
            {
                spec: [Utils.isMac() ? "META|z" : "CTRL|z"],
                handler: () => { if (this.canUndo()) { this.undo() } }
            },
            {
                spec: [Utils.isMac() ? "SHIFT|META|Z" : "SHIFT|CTRL|Z"],
                handler: () => { if (this.canRedo()) { this.redo() } }
            },
            {
                key: ["i"],
                handler: this.invertChar
            },
            {
                key: ["f"],
                handler: this.fillChar
            },
            {
                key: ["c"],
                handler: this.clearChar
            },
        ]
    }

    componentDidMount() {
        this.parentKeyHandler = Utils.installKeyHandler(this.handleKeyEvent)
    }

    handleKeyEvent(evt) {
        const code = Utils.keyEventToString(evt)
        const key = evt.key
        for (var i = 0; i < this.keyboardShortcuts.length; i++) {
            const s = this.keyboardShortcuts[i]
            if (s.spec) {
                for (var j = 0; j < s.spec.length; j++) {
                    if (s.spec[j] === code) {
                        s.handler()
                        return false;
                    }
                }
            }
            if (s.key) {
                for (var j = 0; j < s.key.length; j++) {
                    if (s.key[j] === key) {
                        s.handler()
                        return false;
                    }
                }
            }
        }
        if (this.parentKeyHandler) {
            return this.parentKeyHandler(evt)
        }
    }

    applyHistoryState(s) {
        const selectedChar = s.selected
        this.setState({selectedChar: selectedChar})
        this.fontViewRef.current.selectChar(selectedChar);
        this.charEditFieldRef.current.setChar(this.font.getChar(selectedChar))
        this.charEditFieldRef.current.setChar(s.ch)
        const fv = this.fontViewRef.current
        fv.updateChar(selectedChar, s.ch);
        this.font.setChar(selectedChar, s.ch)
    }

    addToHistory(s) {
        if (this.historyCurPos > 0) {
            // Only add to history if s is different from top element
            const s0 = this.history[this.historyCurPos]
            if ((s0.selected === s.selected) && (s0.ch.isEqual(s.ch))) {
                return
            }
        }
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
        this.clipboardRef.current.setChar(this.font.getChar(this.state.selectedChar))
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
        this.font.setChar(this.state.selectedChar, newChar)
        this.charEditFieldRef.current.setChar(newChar)
        this.fontViewRef.current.updateChar(this.state.selectedChar, newChar);
        this.addToHistory({selected: this.state.selectedChar, ch: newChar})
    }

    modifyChar(modifierFunc) {
        this.updateChar(modifierFunc(this.font.getChar(this.state.selectedChar)))
    }

    selectChar(i) {
        if (this.state.selectedChar === i) {
            return
        }
        this.setState({selectedChar: i})
        const c = this.font.getChar(i)
        this.charEditFieldRef.current.setState({data: c})
        this.fontViewRef.current.selectChar(i);
        this.addToHistory({selected: i, ch: c})
    }

    shiftUp() {
        this.modifyChar((c) => c.shiftUp())
    }

    shiftDown() {
        this.modifyChar((c) => c.shiftDown())
    }

    shiftLeft() {
        this.modifyChar((c) => c.shiftLeft(this.state.multicol))
    }

    shiftRight() {
        this.modifyChar((c) => c.shiftRight(this.state.multicol))
    }

    rollUp() {
        this.modifyChar((c) => c.rollUp())
    }

    rollDown() {
        this.modifyChar((c) => c.rollDown())
    }

    rollLeft() {
        this.modifyChar((c) => c.rollLeft(this.state.multicol))
    }

    rollRight() {
        this.modifyChar((c) => c.rollRight(this.state.multicol))
    }

    invertChar() {
        this.modifyChar((c) => c.invert())
    }

    fillChar() {
        this.modifyChar((c) => c.fill())
    }

    clearChar() {
        this.modifyChar((c) => c.clear())
    }

    showHelp() {
        this.props.helpDialogRef.current.showDialog()
    }

    showAbout() {
        this.props.aboutDialogRef.current.showDialog()
    }

    showLoadFontDlg() {
        this.closeLoadMenu()
        this.fileInputRef.current.click()
    }

    showSaveFontDlg() {
        this.props.saveDialogRef.current.showDialog(this.font)
    }

    loadFontFromData(data) {
        if (data.byteLength === 2050) {
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
        const ch = this.font.getChar(this.state.selectedChar)
        cef.setChar(ch)

        this.resetHistory({selected: this.state.selectedChar, ch: ch})
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
            this.loadFontFromData(data);
        };
        reader.onerror = (e) => {
            this.props.errorMessageRef.current.showError("Error while loading file: " + e)
        }
        reader.readAsArrayBuffer(f);
    }

    showLoadMenu(evt) {
        this.setState({loadMenuAnchor: evt.currentTarget})
    }

    closeLoadMenu() {
        this.setState({loadMenuAnchor: null})
    }

    selectColor(idx) {
        this.setState({selectedColor: idx})
    }

    setColor(idx, col) {
        this.setState((prevState) => {
            const cols = prevState.cols
            cols[idx] = col
            return {cols: cols}
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
                        <CardHeader title={"Character (0x" + this.state.selectedChar.toString(16).padStart(2, '0') +" / " + this.state.selectedChar + ")"} />
                        <CardContent>
                            <CharEditField
                                zoom={25}
                                multicol={this.state.multicol}
                                cols={this.state.cols}
                                selectedColor={this.state.selectedColor}
                                bordercol="darkgray"
                                setPixel={(x, y, val) => this.modifyChar((c) => c.set(x, y, val, this.state.multicol))}
                                ref={this.charEditFieldRef}
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
                                              multicol={this.state.multicol}
                                              cols={this.state.cols}
                                              onSelectChar={this.selectChar}
                                    />
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <DisableableButton
                                        ref={this.loadBtnRef}
                                        style={{marginBottom: "1rem", marginLeft: "1rem"}}
                                        variant="contained"
                                        onClick={this.showLoadMenu}>
                                        Std Font
                                    </DisableableButton>
                                    <Menu
                                        anchorEl={this.state.loadMenuAnchor}
                                        keepMounted
                                        open={Boolean(this.state.loadMenuAnchor)}
                                        onClose={this.closeLoadMenu}
                                    >
                                        {/*<MenuItem onClick={this.showLoadFontDlg}>Load file...</MenuItem>*/}
                                        {/*<hr/>*/}
                                        {EmbeddedFonts.map((font) => (
                                            <FontMenuItem isSeparator={font.name === ""} onClick={() => {this.loadFontFromData(font.data); this.closeLoadMenu()}}>{font.name}</FontMenuItem>
                                        ))}
                                    </Menu>
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
                                            onClick={this.showLoadFontDlg}>
                                            Load
                                        </DisableableButton>
                                    </Box>
                                    <DisableableButton
                                        style={{marginBottom: "1rem", marginLeft: "1rem"}}
                                        variant="contained"
                                        onClick={this.showSaveFontDlg}>
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
                                onUp={this.rollUp}
                                onDown={this.rollDown}
                                onLeft={this.rollLeft}
                                onRight={this.rollRight}
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
                                onUp={this.shiftUp}
                                onDown={this.shiftDown}
                                onLeft={this.shiftLeft}
                                onRight={this.shiftRight}
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
                                onFlipHorizontally={() => this.modifyChar((c) => c.flipHorizontally(this.state.multicol))}
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
                                multicol={this.state.multicol}
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
                                        onClick={this.invertChar}>
                                        Invert
                                    </DisableableButton>
                                </Box>
                                <Box display="flex" flexDirection="column" flex={1}>
                                    <Box flex={1}>
                                        <DisableableButton
                                            style={{width: "90%"}}
                                            variant="contained"
                                            onClick={this.clearChar}>
                                            Clear
                                        </DisableableButton>
                                    </Box>
                                    <Box flex={1}>
                                        <DisableableButton
                                            style={{width: "90%"}}
                                            variant="contained"
                                            onClick={this.fillChar}>
                                            Fill
                                        </DisableableButton>
                                    </Box>
                                </Box>
                                <Box display="flex" flexDirection="column" flex={1}>
                                    <Box>
                                        <DisableableButton
                                            style={{width: "90%", marginBottom: "0.5rem"}}
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
                                <Box display="flex" flexDirection="column" flex={1}>
                                    <Box>
                                        <DisableableButton
                                            style={{width: "90%", marginBottom: "0.5rem"}}
                                            variant="contained"
                                            startIcon={<HelpOutlineOutlinedIcon/>}
                                            onClick={this.showHelp}>
                                            Help
                                        </DisableableButton>
                                    </Box>
                                    <Box>
                                        <DisableableButton
                                            style={{width: "90%"}}
                                            variant="contained"
                                            startIcon={<InfoOutlinedIcon/>}
                                            onClick={this.showAbout}>
                                            About
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

