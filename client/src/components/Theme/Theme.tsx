import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import React from "react";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#282c34",
    },
    primary: {
      main: "#369c57",
    },
  },
});

export const Theme: React.FC = ({ children }) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
