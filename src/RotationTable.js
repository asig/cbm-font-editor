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

import DisableableButton from "./DisableableButton";

import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SwapVertIcon from '@material-ui/icons/SwapVert';

function RotationTable(props) {
    const renderTitle = () => {
        if (props.title !== undefined && props.title.length > 0) {
            return <thead>
            <tr>
                <td align={"center"} colSpan={2}>{props.title}</td>
            </tr>
            </thead>
        }
        return ""
    }

    const debugStyle = {
        // border: "1px solid red"
    }

    return <table style={{...debugStyle, ...props.style}}  >
        <tbody>
        <tr>
            <td align={"center"}>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onFlipVertically}>
                    <SwapVertIcon/>
                </DisableableButton>
            </td>
            <td align={"center"} colSpan={2}>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onFlipHorizontally}>
                    <SwapHorizIcon/>
                </DisableableButton>
            </td>
        </tr>
        <tr>
            <td>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onRotateCcw}>
                    <RotateLeftIcon/>
                </DisableableButton>
            </td>
            <td>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onRotateCw}>
                    <RotateRightIcon/>
                </DisableableButton>
            </td>
        </tr>
        </tbody>
    </table>;
}

export default RotationTable;
