import React, { useEffect, useState } from "react";

import { Row } from "../../components/Row/Row";
import "./admin-view.scss";
import { Timer } from "../../components/Timer/Timer";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Redirect } from "react-router";
import { Paths } from "../../Paths";
import { Answer, User } from "../../../../shared/Types";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { useEmit } from "../../hooks/useEmit";

export const AdminView: React.FC = (props: any) => {
  const [answerTime, setAnswerTime] = useState(60);
  const [users, setUsers] = useState<User[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useSocketEvent("users", users => {
    setUsers(users);
  });

  useSocketEvent("answer", answer => {
    setAnswers(answers => {
      let index = answers.findIndex(answerObj => answerObj.userName === answer.userName);
      if (index === -1) {
        return [...answers, answer];
      } else {
        return [...answers.slice(0, index), ...answers.slice(index + 1), answer];
      }
    });
  });

  const emit = useEmit();

  useEffect(() => {
    if (!props.location.state) {
      return;
    }
    emit(
      "createRoom",
      {
        roomCode: props.location.state.roomCode,
      },
      ({ users, answers }) => {
        if (!users || users.length === 0) {
          return;
        } else {
          setUsers(users);
        }

        if (answers) {
          setAnswers(answers);
        }
      },
    );
  }, []);

  if (!props.location.state) {
    return <Redirect to={Paths.landing} />;
  }

  const roomCode = props.location.state.roomCode;

  const handleNextQuestion = e => {
    e.preventDefault();

    emit("nextQuestionServer", {
      roomCode,
      answerTime,
    });
    setAnswers([]);
  };

  const handleAnswerTimeChange = (event: any) => {
    const time = event.target.value;
    setAnswerTime(time);
  };

  return (
    <form onSubmit={handleNextQuestion} className="admin-view">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="code">
            Code: {roomCode}
          </Typography>
          <Timer isAdmin={true} />
        </Toolbar>
      </AppBar>

      <Box my={1}>
        <List dense={true}>
          {answers.length > 0
            ? answers.map(answer => <Row key={answer.userName} answer={answer} roomCode={roomCode} />)
            : users.map(user => <Row key={user.name} user={user} roomCode={roomCode} />)}
        </List>
      </Box>
      <Box className="footer">
        <Button type="submit" className="next-question" variant="contained" color="primary" fullWidth>
          Next question
        </Button>
        <br />
        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-filled-label">Answer time</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            fullWidth
            onChange={handleAnswerTimeChange}
            value={answerTime}
          >
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={45}>45</MenuItem>
            <MenuItem value={60}>1:00</MenuItem>
            <MenuItem value={75}>1:15</MenuItem>
            <MenuItem value={90}>1:30</MenuItem>
            <MenuItem value={105}>1:45</MenuItem>
            <MenuItem value={120}>2:00</MenuItem>
            <MenuItem value={135}>2:15</MenuItem>
            <MenuItem value={150}>2:30</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </form>
  );
};
