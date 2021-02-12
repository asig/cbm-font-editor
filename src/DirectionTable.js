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
