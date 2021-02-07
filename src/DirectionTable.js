import React from "react";

import Button from "@material-ui/core/Button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretLeft, faCaretRight, faCaretUp} from "@fortawesome/free-solid-svg-icons";

function DirectionTable(props) {
    return <table style={{border: "1px solid green"}}>
        <thead>
        <tr>
            <td align={"center"} colSpan={2}>{props.title}</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td align={"center"} colSpan={2}>
                <Button
                    variant="contained"
                    onClick={props.onUp}>
                    <FontAwesomeIcon icon={faCaretUp}/>
                </Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button
                    variant="contained"
                    onClick={props.onLeft}>
                    <FontAwesomeIcon icon={faCaretLeft}/>
                </Button>
            </td>
            <td>
                <Button
                    variant="contained"
                    onClick={props.onRight}>
                    <FontAwesomeIcon icon={faCaretRight}/>
                </Button>
            </td>
        </tr>
        <tr>
            <td align={"center"} colSpan={2}>
                <Button
                    variant="contained"
                    onClick={props.onDown}>
                    <FontAwesomeIcon icon={faCaretDown}/>
                </Button>
            </td>
            <td/>
        </tr>
        </tbody>
    </table>;
}

export default DirectionTable;
