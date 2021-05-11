import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import { Paths } from "./Paths";
import { Header } from "./components/Header/Header";
import { useSocketConnection } from "./hooks/useSocketConnection";
import { api } from "./services/api";
import { AdminView } from "./views/AdminView/AdminView";
import { LandingView } from "./views/LandingView/LandingView";
import { NotFoundView } from "./views/NotFoundView/NotFoundView";
import { QuestionView } from "./views/QuestionView/QuestionView";

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useSocketConnection(!isLoading);

  useEffect(() => {
    api.getSession().then(data => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
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
