import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";
import Paths from "../../Paths";
import { useHistory } from "react-router-dom";

import "./landing-view.scss";

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
      <Button
        onClick={() => handleCreateRoom()}
        variant="contained"
        color="primary"
      >
        Create room
      </Button>
      <div id="Slider" className="slideup">
        <TextField
          id="userNameField"
          error={hasUserNameError}
          label={hasUserNameError ? "Error" : "Nickname"}
          helperText={
            hasUserNameError ? "Nickname must be at least 4 characters" : ""
          }
          onChange={handleUsernameChange}
          value={userName}
        />
        <TextField
          id="roomCodeField"
          error={hasroomCodeError}
          label={hasroomCodeError ? "Error" : "Room code"}
          helperText={hasroomCodeError ? "Room does not exist" : ""}
          onChange={handleRoomCodeChange}
          value={roomCode}
        />
      </div>
      <Button
        onClick={() => handleJoinRoom()}
        variant="contained"
        color="primary"
      >
        Join room
      </Button>
    </div>
  );
}
