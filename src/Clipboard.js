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

import globals from "./globals";
import DisableableButton from "./DisableableButton";
import CharView from "./CharView";

class Clipboard extends React.Component {

    static defaultProps = {
        fgcol: globals.colors.fg,
        fillcol: globals.colors.fg,
        bgcol: "white",
        title: "Clipboard",
    }

    constructor(props) {
        super(props);

        this.state = {
            char: null
        };

        this.charViewRef = React.createRef()
        this.pasteButtonRef = React.createRef()

        this.render = this.render.bind(this)
        this.setChar = this.setChar.bind(this)
        this.getChar = this.getChar.bind(this)
    }

    setChar(c) {
        // I don't understand why React can't detect that the nested nodes changed...
        // Until I can sort this out, I need to set the child states explictly...
        this.charViewRef.current.setChar(c)
        this.pasteButtonRef.current.setEnabled(c != null)
        this.setState({char: c})
    }

    getChar() {
        return this.state.char;
    }

    render() {
        return <table style={this.props.style}>
            <tbody>
            <tr>
                <td>
                    <DisableableButton
                        enabled={true}
                        variant="contained"
                        onClick={this.props.onCopy}>
                        Copy
                    </DisableableButton>
                </td>
                <td align="center">
                    <CharView ref={this.charViewRef} zoom={4}/>
                </td>
            </tr>
            <tr>
                <td>
                    <DisableableButton
                        ref={this.pasteButtonRef}
                        enabled={this.state.char != null}
                        variant="contained"
                        onClick={this.props.onPaste}>
                        Paste
                    </DisableableButton>
                </td>
                <td>
                    <DisableableButton
                        enabled={true}
                        variant="contained"
                        onClick={() => this.setChar(null)}>
                        Clear
                    </DisableableButton>
                </td>
            </tr>
            </tbody>
        </table>
    }
}

export default Clipboard;
