import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import NativeSelect from "@material-ui/core/NativeSelect";
import Drawer from "../../components/Drawer/drawer";
import { Row } from "../../components/Row/row";
import { socket } from "../../services/socket";
import { styled, withStyles } from "@material-ui/core/styles";
import "./admin-view.css";

const CustomNativeSelect = withStyles({
  root: {
    color: "white",
    borderBottom: "2px solid white",
    "&.MuiNativeSelect-nativeInput": {
      color: "#282c34",
    },
  },
  icon: {
    fill: "white",
  },
})(NativeSelect);

const MyButton = styled(Button)({
  marginTop: "10px",
  width: "225px",
});

export default function QuestionView(props: any) {
  const [answerTime, setAnswerTime] = useState(15);
  const [roomCode, _] = useState(props.location.state.roomCode);
  const [users, setUsers] = useState<any>([]);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(15);
  const [startTimer, setStartTimer] = useState(false);
  const ary = [
    { userName: "Pärt", answer: "Tallinn" },
    { userName: "Evelina", answer: "Tallinn" },
    { userName: "Pät", answer: "Tallinn" },
    { userName: "Prt", answer: "Tallinn" },
    { userName: "rt", answer: "Tallinn" },

    { userName: "Evela", answer: "Tallinn" },
    { userName: "Eelina", answer: "Tallinn" },
    { userName: "Eveina", answer: "Tallinn" },
    { userName: "Elina", answer: "Tallinn" },
    { userName: "Svenm", answer: "Tallinn" },
    { userName: "Sven", answer: "Tallinn" },
    { userName: "Anne", answer: "Tallinn" },
  ];

  useEffect(() => {
    socket.emit(
      "createRoom",
      {
        roomCode,
      },
      (data: any) => {
        if (data.length === 0) {
          return;
        } else {
          data.forEach((element:any) => {
            const latestUser = {
              userName: element.userName,
              answer: element.answer,
            };

            setUsers((users: any) => {
              users.forEach((user: any, index: number) => {
                if (user.userName === data.userName) {
                  users.splice(index, 1);
                }
              });
              return [...users, latestUser];
            });
          });
         

        }   
      }
    );
  }, []);

  useEffect(() => {
    socket.on("renderUser", (data: any) => {
      const latestUser = {
        userName: data.userName,
        answer: data.answer,
      };

      setUsers((users: any) => {
        users.forEach((user: any, index: number) => {
          if (user.userName === data.userName) {
            users.splice(index, 1);
          }
        });
        return [...users, latestUser];
      });
    });

    socket.on("deleteUser", (data: any) => {
      setUsers((users: any) =>
        users.filter((user: any) => user.userName !== data.userName)
      );
    });
  }, []);

  useEffect(() => {
    if (startTimer) {
        const timer = setInterval(() => {
          if (questionTimeLeft > 0) {
            setQuestionTimeLeft(questionTimeLeft - 1);
          } else {
            clearTimeout(timer);
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
  }, [startTimer, questionTimeLeft]);

  const handleNextQuestion = () => {
    setQuestionTimeLeft(() => answerTime);  
    setStartTimer(() => true);
    socket.emit("nextQuestionServer", {
      roomCode,
      answerTime,
    });
    setUsers([]);
  };
  
  const handleAnswerTimeChange = (event: any) => {
    const time = event.target.value;
    setAnswerTime(() => time);
  };

  return (
    <div className="wrapper">
      <header>
        <h2 className="white">{`ROOM CODE: ${roomCode}`}</h2>
      </header>
      <main>
        {users.map((userObject: any, index: number) => {
          return (
            <Row
              key={index}
              userName={userObject.userName}
              answer={userObject.answer}
            />
          );
        })}
      </main>
      <footer>
        <MyButton
          className="next-question"
          onClick={() => handleNextQuestion()}
          variant="contained"
          color="primary"
        >
          Next question
        </MyButton>
        <div className="time-left">
          <h3 className="white">{"Answer time: "}</h3>
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
            <option value={"No time"}>No time</option>
          </CustomNativeSelect>
        </div>
        <h3 className="white">{`Time left to answer: ${questionTimeLeft}`}</h3>
      </footer>

      {/* <Drawer /> */}
    </div>
  );
}
