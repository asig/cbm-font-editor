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
