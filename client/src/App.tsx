import React from "react";
import { Route, Switch, Redirect } from "react-router";
import Paths from "./Paths";
import { BrowserRouter as Router } from "react-router-dom";
import LandingView from "./views/LandingView/landingView";
import QuestionView from "./views/QuestionView/questionView";
import AdminView from "./views/AdminView/adminView";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

export const App: React.FC = () => {

  const isAdmin = true;
  
  return (
    <>
      <Router>
        <Switch>
        <Route exact path="/">
            <Redirect to={Paths.landing} />
        </Route>
        <Route exact path={Paths.landing} component={LandingView} />
        <Route exact path={Paths.question} component={QuestionView} />
        <ProtectedRoute
            allowed={isAdmin}
            path={Paths.admin}
            redirectNotAllowed={Paths.landing}
            component={AdminView}
          />
        
          {/* <Route>
            <NotFoundView />
          </Route> */}
        </Switch>
      </Router>
    </>
  );
};
