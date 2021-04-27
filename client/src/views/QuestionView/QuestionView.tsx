import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DoneOutline } from "@material-ui/icons";
import { socket } from "../../services/socket";

import "./question-view.scss";
import Timer from "../../components/Timer/Timer";
import { AppBar, Box, Container, Paper, Toolbar, Typography, Zoom } from "@material-ui/core";
import { Redirect } from "react-router";
import Paths from "../../Paths";

export default function QuestionView(props: any) {
  const [answer, setAnswer] = useState("");
  const [isSendButtonActive, setIsSendButtonActive] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (props.location.state) {
      socket.emit("joinRoom", {
        userName: props.location.state.userName,
        roomCode: props.location.state.roomCode,
      });
    }

    socket.on("setAnswerCorrectness", ({ isCorrect }: { isCorrect: boolean }) => {
      setIsCorrect(isCorrect);
    });

    socket.on("nextQuestion", () => {
      setIsCorrect(false);
    });
  }, []);

  if (!props.location.state) {
    return <Redirect to={Paths.landing} />;
  }

  const handleAnswerChange = (event: any) => {
    setAnswer(() => event.target.value);
  };

  const handleAnswerSending = e => {
    e.preventDefault();
    socket.emit("sendAnswer", {
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
}
