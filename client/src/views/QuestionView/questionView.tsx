import { useEffect, useState, useRef } from "react";
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
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | string>(
    "plenty"
  );
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const [hasNotAnswered, setHasNotAnswered] = useState(true);
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
      console.log("nextQuestion");
      setIsSendButtonDisabled(false);
      if (parseInt(data.answerTime) === 300) {
        setQuestionTimeLeft("plenty");
        setStartTimer(false);
      } else {
        setQuestionTimeLeft(parseInt(data.answerTime));
        setStartTimer(true);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("endQuestion", () => {
      handleAnswerSending();
      console.log("endQuestion");
      /*  setQuestionTimeLeft("plenty");
      if (hasNotAnswered) {
        socket.emit("sendAnswer", {
          userName,
          answer: "Was toooo slow to answer",
          roomCode,
        });
        setAnswer("");
      }*/
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
  }, [questionTimeLeft]);

  const handleAnswerChange = (event: any) => {
    setAnswer(() => event.target.value);
  };

  const handleAnswerSending = () => {
    console.log(hasNotAnswered);
    if (hasNotAnswered) {
      setHasNotAnswered(false);
      setIsSendButtonDisabled(true);
      setQuestionTimeLeft("plenty");
      console.log(answer);
      socket.emit("sendAnswer", { userName, answer, roomCode });
      setAnswer("");
    }
  };

  return (
    <div className="App">
      <h2 className="question-heading white">Write your answer in the box</h2>
      <CustomTextField
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
