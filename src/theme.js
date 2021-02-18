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
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import globals from "./globals";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ffcc00",
        },
        secondary: {
            main: "#e2001a",
        },
    },
    overrides: {
        MuiDivider: {
            root: {
                backgroundColor: globals.colors.fg,
            }
        },
        MuiContainer: {
            root: {
                backgroundColor: globals.colors.bg,
            }
        },
        MuiCard: {
            root: {
                height: "100%"
            }
        },
        MuiCardHeader: {
            root: {
                backgroundColor: globals.colors.brown,
                color: globals.colors.white,
                padding: 0,
            },
            title: {
                fontFamily: "Microgramma-D-Medium",
                // fontFamily: "Comfortaa",
                fontSize: "1.2rem",
            }
        },
        MuiCardContent: {
            root: {
                display: 'flex',
                justifyContent: 'center',
            }
        },
        MuiButton: {
            root: {
                fontFamily: "Comfortaa",
                // fontFamily: "Microgramma-D-Medium",
                textTransform: "unset",
                minWidth: "0px"
            },
            contained: {
                color: globals.colors.white,
                backgroundColor: globals.colors.brown
            }
        },
        MuiPaper: {
            root: {
                border: "1px solid " + globals.colors.brown,
                backgroundColor: globals.colors.bg,
                textAlign: 'center',
            }
        }
    }
});

export default theme
