import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const url = window.location.href;
  const [answerTime, setAnswerTime] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [roomCode, setRoomCode] = useState(props.location.state.roomCode);
  const [users, setUsers] = useState<Array<any>>([]);
  console.log(url);
  // const [user, setUser] = useState({});

  /* useEffect(() => {
    socket.emit("connect", {
      roomCode: ,

    });
  }, []); //only re-run the effect if new message comes in*/

  useEffect(() => {
    socket.on("renderUser", (data: any) => {
      const user = {
        userName: data.userName,
        answer: data.answer,
      };

      setUsers((users) => users.concat(user));
    });

    socket.on("deleteUser", (data: any) => {
      setUsers(users.filter((user) => user.userName !== data.userName));
    });
  }, []); //only re-run the effect if new message comes in

  const handleNextQuestion = () => {
    console.log(url);
    socket.emit("nextQuestionServer", {
      roomCode,
      answerTime,
      questionNumber: questionNumber + 1,
    });
    setUsers([]);
    setQuestionNumber(questionNumber + 1);
  };

  const handleAnswerTimeChange = (event: any) => {
    const time = event.target.value;
    setAnswerTime(time);
    console.log(time);
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
          <option value={0}>0</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
          <option value={35}>35</option>
          <option value={40}>40</option>
          <option value={45}>45</option>
          <option value={50}>50</option>
          <option value={55}>55</option>
          <option value={60}>60</option>
        </CustomNativeSelect>
      </div>
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
