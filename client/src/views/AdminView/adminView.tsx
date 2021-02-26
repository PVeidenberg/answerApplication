import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import NativeSelect from "@material-ui/core/NativeSelect";
import Drawer from "../../components/Drawer/drawer";
import { Row } from "../../components/Row/row";
import { socket } from "../../services/socket";
import { styled, withStyles } from "@material-ui/core/styles";
import "./admin-view.css";

const CustomNativeSelect = withStyles({
  select: {
    "&:before": {
      color: "red",
    },
  },
  icon: {
    fill: "white",
  },
})(NativeSelect);

const MyButton = styled(Button)({
  marginTop: "5px",
  width: "225px",
});

export default function QuestionView(props: any) {
  const [answerTime, setAnswerTime] = useState(15);
  const [roomCode, _] = useState(props.location.state.roomCode);
  const [users, setUsers] = useState<Array<any>>([]);

  useEffect(() => {
    socket.emit("createRoom", {
      roomCode,
    });
  }, []);

  useEffect(() => {
    socket.on("renderUser", (data: any) => {
      setUsers((users) => [
        ...users,
        {
          userName: data.userName,
          answer: data.answer,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    socket.on("deleteUser", (data: any) => {
      setUsers((users) =>
        users.filter((user) => user.userName !== data.userName)
      );
    });
  }, []);

  const handleNextQuestion = () => {
    socket.emit("nextQuestionServer", {
      roomCode,
      answerTime,
    });
    setUsers([]);
  };

  const handleEndQuestion = () => {
    socket.emit("endQuestionServer", {
      roomCode,
    });
  };

  const handleAnswerTimeChange = (event: any) => {
    const time = event.target.value;
    setAnswerTime(time);
  };

  return (
    <div className="admin-layout">
      <h2 className="white">{`ROOM CODE: ${roomCode}`}</h2>
      {users.map((userObject: any) => {
        return (
          <Row
            key={userObject.userName}
            userName={userObject.userName}
            answer={userObject.answer}
          />
        );
      })}
      <div className="time-left">
        <h3 className="white">Answer time(sec): </h3>
        <CustomNativeSelect
          value={answerTime}
          onChange={(e) => handleAnswerTimeChange(e)}
        >
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>1:00</option>
          <option value={75}>1:15</option>
          <option value={90}>1:30</option>
          <option value={105}>1:45</option>
          <option value={120}>2:00</option>
          <option value={135}>2:15</option>
          <option value={150}>2:30</option>
          <option value={300}>No time</option>
        </CustomNativeSelect>
      </div>

      <MyButton
        className=""
        onClick={() => handleEndQuestion()}
        variant="contained"
        color="primary"
      >
        End question
      </MyButton>

      <MyButton
        className="next-question"
        onClick={() => handleNextQuestion()}
        variant="contained"
        color="primary"
      >
        Next question
      </MyButton>

      <Drawer />
    </div>
  );
}
