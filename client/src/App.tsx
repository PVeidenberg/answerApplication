import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Paths from "./Paths";

import "./app.scss"
import LandingView from "./views/LandingView/LandingView";
import QuestionView from "./views/QuestionView/QuestionView";
import AdminView from "./views/AdminView/AdminView";
import NotFoundView from "./views/NotFoundView/NotFoundView";

export const App: React.FC = () => {
  return (
    <>
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
