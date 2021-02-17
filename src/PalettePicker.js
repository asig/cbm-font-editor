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

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"

import palette from "./palette"

function PalettePicker(props) {

    const renderCell = (i) => {
        const col = palette[i]
        return <td style={{width: "2rem", height: "1rem"}}>
            <Button variant="outlined" style={{backgroundColor: col, width: "100%", height: "100%"}}
                    onClick={() => props.onColorSelected(col)}> </Button>
        </td>
    }

    const renderLine = (i) => {
        return <tr>
            {renderCell(4 * i + 0)}
            {renderCell(4 * i + 1)}
            {renderCell(4 * i + 2)}
            {renderCell(4 * i + 3)}
        </tr>
    }

    /* No ideas why I need to wrap the onClickAway callback, but props.onCancel is undefined if the user does not click outside...*/
    return <ClickAwayListener onClickAway={() => { if (props.onCancel) { props.onCancel() } }}>
        <Paper>
            <table style={{borderCollapse: "collapse", border: "0px", ...props.style}}>
                <tbody>
                {renderLine(0)}
                {renderLine(1)}
                {renderLine(2)}
                {renderLine(3)}
                </tbody>
            </table>
        </Paper>
    </ClickAwayListener>
}

export default PalettePicker;
