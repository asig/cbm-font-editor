import React from "react";

import Button from "@material-ui/core/Button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretLeft, faCaretRight, faCaretUp} from "@fortawesome/free-solid-svg-icons";

function DirectionTable(props) {
    return <table>
        <thead>
        <tr>
            <td colSpan={3}>{props.title}</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td/>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onUp}>
                    <FontAwesomeIcon icon={faCaretUp}/>
                </Button>
            </td>
            <td/>
        </tr>
        <tr>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onLeft}>
                    <FontAwesomeIcon icon={faCaretLeft}/>
                </Button>
            </td>
            <td/>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onRight}>
                    <FontAwesomeIcon icon={faCaretRight}/>
                </Button>
            </td>
        </tr>
        <tr>
            <td/>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
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
