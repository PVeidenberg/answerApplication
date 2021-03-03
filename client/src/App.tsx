import React from "react";
import { Route, Switch, Redirect } from "react-router";
import Paths from "./Paths";
import { BrowserRouter as Router } from "react-router-dom";
import LandingView from "./views/LandingView/landingView";
import QuestionView from "./views/QuestionView/questionView";
import NotFoundView from "./views/NotFoundView/notFoundView";
import AdminView from "./views/AdminView/adminView";

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
