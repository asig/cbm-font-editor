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

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCaretDown, faCaretLeft, faCaretRight, faCaretUp} from "@fortawesome/free-solid-svg-icons"
import DisableableButton from "./DisableableButton";

function DirectionTable(props) {

    const renderTitle = () => {
        if (props.title.length > 0) {
            return <thead>
            <tr>
                <td align={"center"} colSpan={2}>{props.title}</td>
            </tr>
            </thead>
        }
        return ""
    }

    const debugStyle = {
        // border: "1px solid green"
    }

    return <table style={{...debugStyle, ...props.style}}>
        <tbody>
        <tr>
            <td align={"center"} colSpan={2}>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onUp}>
                    <FontAwesomeIcon icon={faCaretUp}/>
                </DisableableButton>
            </td>
        </tr>
        <tr>
            <td>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onLeft}>
                    <FontAwesomeIcon icon={faCaretLeft}/>
                </DisableableButton>
            </td>
            <td>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onRight}>
                    <FontAwesomeIcon icon={faCaretRight}/>
                </DisableableButton>
            </td>
        </tr>
        <tr>
            <td align={"center"} colSpan={2}>
                <DisableableButton
                    size="small"
                    variant="contained"
                    onClick={props.onDown}>
                    <FontAwesomeIcon icon={faCaretDown}/>
                </DisableableButton>
            </td>
            <td/>
        </tr>
        </tbody>
    </table>;
}

export default DirectionTable;
