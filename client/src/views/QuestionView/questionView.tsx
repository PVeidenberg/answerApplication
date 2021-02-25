import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";
import { withStyles, styled } from "@material-ui/core/styles";
import "./question-view.css";

const CustomTextField = withStyles({
  root: {
    marginTop: "5px",
    width: "26ch",

    color: "white",
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      height: "10ch",
      "& fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

const MyButton = styled(Button)({
  marginTop: "5px",
  width: "225px",
});

export default function QuestionView(props: any) {
  const [answer, setAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(100);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const [userName, setUserName] = useState(props.location.state.userName);
  const [roomCode, setRoomCode] = useState(props.location.state.roomCode);
  const [startTimer, setStartTimer] = useState(false);

  // useEffect(() => {}, []); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on("nextQuestion", (data: any) => {
      setIsSendButtonDisabled(false);
      setQuestionTimeLeft(data.answerTime);
      setQuestionNumber(data.questionNumber);
      setStartTimer(true);
    });
  }, []); //only re-run the effect if new message comes in

  useEffect(() => {
    if (startTimer) {
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
  }, [startTimer, questionTimeLeft]);

  const handleAnswerChange = (event: any) => {
    setAnswer(event.target.value);
  };

  const handleAnswerSending = () => {
    console.log("sendAnswer", userName, answer, roomCode);
    setIsSendButtonDisabled(true);
    setQuestionTimeLeft(0);
    socket.emit(
      "sendAnswer",
      { userName, answer, roomCode },
      (error: Boolean) => {
        if (error) {
          console.log(error);
        }
      }
    );
    setAnswer("");
  };

  return (
    <div className="App">
      <h2 className="question-heading white">
        {questionNumber == 0 ? "" : `Question ${questionNumber}`}
      </h2>
      <CustomTextField
        id="outlined-multiline-static"
        label={"Your answer"}
        onChange={handleAnswerChange}
        value={answer}
        multiline
        rows={4}
        variant="outlined"
      />
      <h4 className="white">{`Time left : ${
        questionTimeLeft !== null ? questionTimeLeft : "0"
      }`}</h4>
      <MyButton
        onClick={() => handleAnswerSending()}
        disabled={isSendButtonDisabled}
        variant="contained"
        color="primary"
      >
        Send your answer
      </MyButton>
    </div>
  );
}
