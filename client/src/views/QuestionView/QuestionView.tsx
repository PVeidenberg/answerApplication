import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";

import "./question-view.scss";

export default function QuestionView(props: any) {
  const [answer, setAnswer] = useState("");
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | string>(
    "No time"
  );
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const [userName, setUserName] = useState(props.location.state.userName);
  const [roomCode, setroomCode] = useState(props.location.state.roomCode);
  const [startTimer, setStartTimer] = useState(false);

  useEffect(() => {
    socket.emit("joinRoom", {
      userName,
      roomCode,
    });
  }, []);

  useEffect(() => {
    socket.on("nextQuestion", (data: any) => {
      setIsSendButtonDisabled(false);
      if (data.answerTime === "No time") {
        setQuestionTimeLeft("No time");
        setStartTimer(false);
      } else {
        setQuestionTimeLeft(parseInt(data.answerTime));
        setStartTimer(true);
      }
    });
  }, []);

  useEffect(() => {
    if (startTimer) {
      if (typeof questionTimeLeft === "number") {
        const timer = setInterval(() => {
          if (questionTimeLeft > 0) {
            setQuestionTimeLeft(questionTimeLeft - 1);
          } else {
            setIsSendButtonDisabled(true);
            clearTimeout(timer);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [startTimer, questionTimeLeft]);

  const handleAnswerChange = (event: any) => {
    setAnswer(() => event.target.value);
  };

  const handleAnswerSending = () => {;
      socket.emit("sendAnswer", { userName, answer, roomCode });
      setAnswer("");
  };

  return (
    <div className="App">
      <h2 className="question-heading white">Write your answer in the box</h2>
      <TextField
        id="outlined-multiline-static"
        label={"Your answer"}
        onChange={(e) => handleAnswerChange(e)}
        value={answer}
        multiline
        rows={4}
        variant="outlined"
      />
      <h4 className="white">{`Time left : ${
        questionTimeLeft !== null ? questionTimeLeft : "No time"
      }`}</h4>
      <Button
        onClick={() => handleAnswerSending()}
        disabled={isSendButtonDisabled}
        variant="contained"
        color="primary"
      >
        Send your answer
      </Button>
    </div>
  );
}
