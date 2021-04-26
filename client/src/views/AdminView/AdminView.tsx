import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import NativeSelect from "@material-ui/core/NativeSelect";

// import Drawer from "../../components/Drawer/Drawer";
import { Row } from "../../components/Row/Row";
import { socket } from "../../services/socket";
import "./admin-view.scss";


export default function QuestionView(props: any) {
  const [answerTime, setAnswerTime] = useState(15);
  const [roomCode, _] = useState(props.location.state.roomCode);
  const [users, setUsers] = useState<any>([]);
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(15);
  const [startTimer, setStartTimer] = useState(false);

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
        <Button
          className="next-question"
          onClick={() => handleNextQuestion()}
          variant="contained"
          color="primary"
        >
          Next question
        </Button>
        <div className="time-left">
          <h3 className="white">{"Answer time: "}</h3>
          <NativeSelect
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
          </NativeSelect>
        </div>
        <h3 className="white">{`Time left to answer: ${questionTimeLeft}`}</h3>
      </footer>

      {/* <Drawer /> */}
    </div>
  );
}
