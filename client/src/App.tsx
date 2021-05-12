import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { Paths } from "./Paths";
import { Role, roomState } from "./atoms/roomState";
import { Loader } from "./components/Loader/Loader";
import { useSocketConnection } from "./hooks/useSocketConnection";
import { api } from "./services/api";
import { AdminView } from "./views/AdminView/AdminView";
import { LandingView } from "./views/LandingView/LandingView";
import { NotFoundView } from "./views/NotFoundView/NotFoundView";
import { QuestionView } from "./views/QuestionView/QuestionView";

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const setRoom = useSetRecoilState(roomState);
  useSocketConnection(!isLoading);

  useEffect(() => {
    api.getSession().then(data => {
      if (data.roomCode) {
        setRoom({
          code: data.roomCode,
          role: data.role || Role.PLAYER,
          isConnected: false,
          users: [],
        });
      }
      setIsLoading(false);
    });
  }, [setRoom]);

  if (isLoading) {
    return <Loader />;
  }

  return (
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
  );
};
