import React from "react";

import Button from "@material-ui/core/Button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretLeft, faCaretRight, faCaretUp} from "@fortawesome/free-solid-svg-icons";


import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SwapVertIcon from '@material-ui/icons/SwapVert';


function RotationTable(props) {
    return <table style={{border: "1px solid green"}}>
        <thead>
        <tr>
            <td align={"center"} colSpan={2}>Rotate/Flip</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td align={"center"}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onFlipVertically}>
                    <SwapVertIcon/>
                </Button>
            </td>
            <td align={"center"} colSpan={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onFlipHorizontally}>
                    <SwapHorizIcon/>
                </Button>
            </td>
        </tr>
        <tr>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onRotateCcw}>
                    <RotateLeftIcon/>
                </Button>
            </td>
            <td>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={props.onRotateCw}>
                    <RotateRightIcon/>
                </Button>
            </td>
        </tr>
        </tbody>
    </table>;
}

export default RotationTable;
