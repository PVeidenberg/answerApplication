import { Box, Button, FormControl, InputLabel, List, MenuItem, Select } from "@material-ui/core";
import { Location } from "history";
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useRecoilState } from "recoil";

import "./admin-view.scss";

import { Answer, User } from "../../../../shared/Types";
import { Paths } from "../../Paths";
import { roomState } from "../../atoms/roomState";
import { Header } from "../../components/Header/Header";
import { Row } from "../../components/Row/Row";
import { useEmit } from "../../hooks/useEmit";
import { useSocketEvent } from "../../hooks/useSocketEvent";

interface Props {
  location: Location<{ roomCode: string }>;
}

export const AdminView: React.FC<Props> = () => {
  const [room, setRoom] = useRecoilState(roomState);
  const history = useHistory();
  const [answerTime, setAnswerTime] = useState(60);
  const [users, setUsers] = useState<User[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useSocketEvent("users", users => {
    setUsers(users);
  });

  useSocketEvent("answer", answer => {
    setAnswers(answers => {
      const index = answers.findIndex(answerObj => answerObj.userName === answer.userName);
      if (index === -1) {
        return [...answers, answer];
      } else {
        return [...answers.slice(0, index), ...answers.slice(index + 1), answer];
      }
    });
  });

  const emit = useEmit();

  useEffect(() => {
    if (!room) {
      return;
    }
    emit("joinRoomAsAdmin", { roomCode: room.code }, (err, data) => {
      if (err) {
        history.replace({ pathname: Paths.landing, state: { error: err.message } });

        return;
      }

      setRoom(room =>
        room
          ? {
              ...room,
              isConnected: true,
              users: data.users,
            }
          : null,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!room) {
    return (
      <Redirect
        to={{
          pathname: Paths.landing,
          state: {
            error: "Room not found",
          },
        }}
      />
    );
  }

  const roomCode = room.code;

  const handleNextQuestion = e => {
    e.preventDefault();

    emit("nextQuestionServer", {
      roomCode,
      answerTime,
    });
    setAnswers([]);
  };

  const handleAnswerTimeChange = event => {
    const time = event.target.value;
    setAnswerTime(time);
  };

  return (
    <div>
      <Header>Code: {roomCode}</Header>
      <form onSubmit={handleNextQuestion} className="admin-view">
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
    </div>
  );
};
