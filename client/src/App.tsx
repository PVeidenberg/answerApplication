import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { Paths } from "./Paths";
import { LandingView } from "./views/LandingView/LandingView";
import { QuestionView } from "./views/QuestionView/QuestionView";
import { NotFoundView } from "./views/NotFoundView/NotFoundView";
import { AdminView } from "./views/AdminView/AdminView";

import "./app.scss";

import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import { api } from "./services/api";
import { Socket } from "./components/Socket/Socket";
import { Header } from "./components/Header/Header";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
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
  const [isLoading, setIsLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    api.getSession().then(data => {
      console.log(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Box className={classes.root} m="auto">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Socket />
      <Header />
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
    </>
  );
};
