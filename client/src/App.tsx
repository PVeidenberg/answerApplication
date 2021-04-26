import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Paths from "./Paths";
import LandingView from "./views/LandingView/LandingView";
import QuestionView from "./views/QuestionView/QuestionView";
import NotFoundView from "./views/NotFoundView/NotFoundView";
import AdminView from "./views/AdminView/AdminView";

import "./app.scss";

import {
  Box,
  CardHeader,
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export const App: React.FC = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to={Paths.landing} />
          </Route>
          <Route path={Paths.landing} component={LandingView} />
          <Route path={Paths.question} component={QuestionView} />
          <Route path={Paths.admin} component={AdminView} />

          <Route>
            <NotFoundView />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};
