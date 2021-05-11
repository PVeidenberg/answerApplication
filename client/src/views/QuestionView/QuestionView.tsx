import { AppBar, Box, Button, Container, TextField, Toolbar, Typography, Zoom } from "@material-ui/core";
import { DoneOutline } from "@material-ui/icons";
import { Location } from "history";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";

import "./question-view.scss";

import { Paths } from "../../Paths";
import { Timer } from "../../components/Timer/Timer";
import { useEmit } from "../../hooks/useEmit";
import { useSocketEvent } from "../../hooks/useSocketEvent";

interface Props {
  location: Location<{ userName: string; roomCode: string }>;
}

export const QuestionView: React.FC<Props> = props => {
  const [answer, setAnswer] = useState("");
  const [isSendButtonActive, setIsSendButtonActive] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useSocketEvent("setAnswerCorrectness", ({ isCorrect }) => setIsCorrect(isCorrect));
  useSocketEvent("nextQuestion", () => setIsCorrect(false));
  const emit = useEmit();

  useEffect(() => {
    if (props.location.state) {
      emit("joinRoom", {
        userName: props.location.state.userName,
        roomCode: props.location.state.roomCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!props.location.state) {
    return <Redirect to={Paths.landing} />;
  }

  const handleAnswerChange = event => {
    setAnswer(() => event.target.value);
  };

  const handleAnswerSending = e => {
    e.preventDefault();
    emit("sendAnswer", {
      userName: props.location.state.userName,
      answer,
      roomCode: props.location.state.roomCode,
    });
    setAnswer("");
  };

  return (
    <div className="question-view">
      <AppBar position="static" className="header">
        <Toolbar>
          <Typography variant="h6" className="code">
            Write your answer in the box
          </Typography>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleAnswerSending}>
        <Container maxWidth="sm" className="main">
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label={"Your answer"}
            onChange={e => handleAnswerChange(e)}
            value={answer}
            multiline
            rows={4}
            variant="outlined"
          />
          <Box my={2}>
            <Button type="submit" disabled={!isSendButtonActive} fullWidth variant="contained" color="primary">
              Send your answer
            </Button>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <Zoom in={isCorrect}>
              <DoneOutline color="primary" style={{ fontSize: "50vw" }} />
            </Zoom>
          </Box>
        </Container>
      </form>
      <Timer toggleIsActive={setIsSendButtonActive} />
    </div>
  );
};
