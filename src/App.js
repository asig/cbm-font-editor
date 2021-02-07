import React from "react";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {ThemeProvider} from "@material-ui/styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUpload} from "@fortawesome/free-solid-svg-icons"

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Logo from "./logo.svg"

import Char from "./model/Char";
import Font from "./model/Font";

import SplitButton from "./SplitButton";
import DisableableButton from "./DisableableButton";
import CharEditField from "./CharEditField";
import DirectionTable from "./DirectionTable";
import FontView from "./FontView";
import ErrorMsg from "./ErrorMsg";

import globals from "./globals"

import './App.css';
import RotationTable from "./RotationTable";

const theme = createMuiTheme({
    overrides: {
        MuiContainer: {
            root: {
                backgroundColor: globals.colors.bg,
            }
        },
        MuiCardHeader: {
            root: {
                backgroundColor: globals.colors.brown,
                color: globals.colors.white
            },
            title: {
                fontFamily: "Microgramma-D-Medium",
            }
        },
        MuiCardContent: {
            root: {
                display:'flex',
                justifyContent:'center'
            }
        },
        MuiPaper: {
            root: {
                border: "1px solid " + globals.colors.brown,
                backgroundColor: globals.colors.white,
                textAlign: 'center',
                height:"100%",
            }
        }
    }
});


class App extends React.Component {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this)
        this.loadFont = this.loadFont.bind(this)
        this.updateChar = this.updateChar.bind(this)
        this.selectChar = this.selectChar.bind(this)
        this.canUndo = this.canUndo.bind(this)
        this.canRedo = this.canRedo.bind(this)
        this.undo = this.undo.bind(this)
        this.redo = this.redo.bind(this)
        this.addToHistory = this.addToHistory.bind(this)
        this.resetHistory = this.resetHistory.bind(this)
        this.applyHistoryState = this.applyHistoryState.bind(this)

        this.charEditFieldRef = React.createRef();
        this.fontViewRef = React.createRef();
        this.fileInputRef = React.createRef()
        this.errorMsgRef = React.createRef()
        this.undoBtnRef = React.createRef()
        this.redoBtnRef = React.createRef()

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

    updateChar(modifierFunc) {
        const newChar = modifierFunc(this.font.getChar(this.selectedChar))
        this.font.setChar(this.selectedChar, newChar)
        this.charEditFieldRef.current.setChar(newChar)
        this.fontViewRef.current.updateChar(this.selectedChar, newChar);
        this.addToHistory({selected: this.selectedChar, ch: newChar})
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
                this.errorMsgRef.current.showError("Can't load font: invalid file length " + len)
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
            this.errorMsgRef.current.showError("Error while loading file: " + e)
        }
        reader.readAsArrayBuffer(f);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container fixed>
                    <Grid container justify="center" alignItems="stretch" spacing={3}>
                        <Grid item xs={12}>
                            <img src={Logo} width={"100%"} alt={"CBM Font Editor"}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Card elevation={5} >
                                <CardHeader title={"Character"}/>
                                <CardContent>
                                    <CharEditField
                                        ref={this.charEditFieldRef}
                                        fgcol="black"
                                        bgcol="white"
                                        bordercol="darkgray"
                                        setPixel={(x, y, val) => this.updateChar((c) => c.set(x, y, val))}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={9}>
                            <Card elevation={5}>
                                <CardHeader title={"Commands"}/>
                                <CardContent>
                                    <Box display="flex" flexDirection="row">
                                        <Box m={1}>
                                            <DirectionTable
                                                title="Roll"
                                                onUp={() => this.updateChar((c) => c.rollUp())}
                                                onDown={() => this.updateChar((c) => c.rollDown())}
                                                onLeft={() => this.updateChar((c) => c.rollLeft())}
                                                onRight={() => this.updateChar((c) => c.rollRight())}
                                            />
                                        </Box>
                                        <Box m={1}>
                                            <DirectionTable
                                                title="Shift"
                                                onUp={() => this.updateChar((c) => c.shiftUp())}
                                                onDown={() => this.updateChar((c) => c.shiftDown())}
                                                onLeft={() => this.updateChar((c) => c.shiftLeft())}
                                                onRight={() => this.updateChar((c) => c.shiftRight())}
                                            />
                                        </Box>
                                        <Box m={1}>
                                            <RotationTable
                                                title="Flip/Rotate"
                                                onFlipHorizontally={() => this.updateChar((c) => c.flipHorizontally())}
                                                onFlipVertically={() => this.updateChar((c) => c.flipVertically())}
                                                onRotateCcw={() => this.updateChar((c) => c.rotateCcw())}
                                                onRotateCw={() => this.updateChar((c) => c.rotateCw())}
                                            />
                                        </Box>
                                        <Box m={1}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => this.updateChar((c) => c.invert())}>
                                                Invert
                                            </Button>
                                        </Box>
                                        <Box m={1}>
                                            {/* See https://stackoverflow.com/questions/8350927/file-upload-button-without-input-field for details */}
                                            <input
                                                ref={this.fileInputRef}
                                                type="file"
                                                style={{display: "none"}}
                                                onChange={(e) => this.loadFont(e.target.files.item(0))}
                                            />
                                            <Button
                                                variant="outlined"
                                                onClick={() => this.fileInputRef.current.click()}>
                                                Load
                                            </Button>
                                        </Box>
                                        <Box m={1}>
                                            <DisableableButton
                                                enabled={this.canUndo()}
                                                variant="outlined"
                                                ref={this.undoBtnRef}
                                                onClick={this.undo}>
                                                Undo
                                            </DisableableButton>
                                        </Box>
                                        <Box m={1}>
                                            <DisableableButton
                                                enabled={this.canRedo()}
                                                variant="outlined"
                                                ref={this.redoBtnRef}
                                                onClick={this.redo}>
                                                Redo
                                            </DisableableButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card elevation={5}>
                                <CardHeader title={"Full Font"}/>
                                <CardContent>
                                    <FontView ref={this.fontViewRef}
                                              zoom={4}
                                              fgcol="black"
                                              bgcol="white"
                                              onSelectChar={this.selectChar}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                    </Grid>
                    <ErrorMsg ref={this.errorMsgRef}/>
                </Container>
            </ThemeProvider>
        );
    }
}


export default App;

