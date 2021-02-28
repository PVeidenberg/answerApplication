import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";
import { withStyles, styled } from "@material-ui/core/styles";
import "./landing-view.css";
import Paths from "../../Paths";
import { useHistory } from "react-router-dom";

const CustomTextField = withStyles({
  root: {
    marginTop: "40px",
    marginBottom: "40px",
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline": {
      borderBottomColor: "white",
      width: "225px",
    },
    "& .MuiInput-root": {
      color: "white",
    },
  },
})(TextField);

const MyButton = styled(Button)({
  marginTop: "30px",
  width: "225px",
});

export default function App(props: any) {
  const history = useHistory();
  const [isClicked, setIsClicked] = useState(false);
  const [hasUserNameError, setHasUserNameError] = useState(false);
  const [hasroomCodeError, setHasRoomCodeError] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");


  const handleJoinRoom = () => {
    if (isClicked) {
      if (userName.trim().length < 3) {
        setHasUserNameError(() => true);
        setHasRoomCodeError(false);
      } else {
        setHasUserNameError(() => false);
        socket.emit("validateRoomCode", {roomCode}, (isValid: boolean) => {
          if (isValid) {
            setHasRoomCodeError(false);
            history.push({
              pathname: Paths.question,
              state: {
                userName,
                roomCode,
              },
            });
          } else {
            setHasRoomCodeError(true);
          }
        });
      }
    } else {
      document.getElementById("Slider")?.classList.toggle("slidedown");
      setIsClicked(true);
    }
  };

  const handleCreateRoom = async () => {
    socket.emit("askRoomCode", null, (roomCode: string) => {
      setRoomCode(roomCode);
      history.push({
        pathname: Paths.admin,
        state: {
          roomCode,
        },
      });
    });
  };

  const handleUsernameChange = (event: any) => {
    setUserName(event.target.value);
  };

  const handleRoomCodeChange = (event: any) => {
    setRoomCode(event.target.value);
  };

  return (
    <div className="App">
      <MyButton
        onClick={() => handleCreateRoom()}
        variant="contained"
        color="primary"
      >
        Create room
      </MyButton>
      <div id="Slider" className="slideup">
        <CustomTextField
          id="userNameField"
          error={hasUserNameError}
          label={hasUserNameError ? "Error" : "Nickname"}
          helperText={
            hasUserNameError ? "Nickname must be at least 4 characters" : ""
          }
          onChange={handleUsernameChange}
          value={userName}
        />
        <CustomTextField
          id="roomCodeField"
          error={hasroomCodeError}
          label={hasroomCodeError ? "Error" : "Room code"}
          helperText={hasroomCodeError ? "Room does not exist" : ""}
          onChange={handleRoomCodeChange}
          value={roomCode}
        />
      </div>
      <MyButton
        onClick={() => handleJoinRoom()}
        variant="contained"
        color="primary"
      >
        Join room
      </MyButton>
    </div>
  );
}
