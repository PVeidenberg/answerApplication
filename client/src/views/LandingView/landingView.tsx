import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";

import { withStyles, styled } from "@material-ui/core/styles";
import axios from "axios";
import "./landing-view.css";
import Paths from "../../Paths";
import { Redirect, useHistory } from "react-router-dom";

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

export default function App() {
  const history = useHistory();
  const [isClicked, setIsClicked] = useState(false);
  const [hasUserNameError, setHasUserNameError] = useState(false);
  const [hasroomCodeError, setHasRoomCodeError] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    socket.on("notValidRoomCode", () => {
      setHasRoomCodeError(true);
    });
  }, []); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on("notValidUserName", () => {
      console.log("notValidUserName");
      setHasUserNameError(true);
    });
  }, [hasUserNameError]); //only re-run the effect if new message comes in

  useEffect(() => {
    socket.on("validRoomCode", (data: any) => {
      setHasRoomCodeError(false);
      history.push({
        pathname: Paths.question + `/${roomCode}`,
        state: { userName: data.userName, roomCode: data.roomCode },
      });
    });
  }, []); //only re-run the effect if new message comes in

  const handleJoinRoom = () => {
    console.log("handleJoinRoom");
    if (isClicked) {
      if (userName.trim().length === 0 && isClicked) {
        setHasUserNameError(true);
        return;
      }
      if (roomCode.trim().length === 0 && isClicked) {
        setHasRoomCodeError(true);
        return;
      }
      setHasRoomCodeError(false);
      setHasUserNameError(false);

      socket.emit("joinRoom", { userName, roomCode });
    } else {
      document.getElementById("Slider")?.classList.toggle("slidedown");
      setIsClicked(true);
    }
  };

  const handleCreateRoom = async () => {
    socket.emit("createRoom", null, function (roomCode: any) {
      history.push({
        pathname: Paths.admin + `/${roomCode}`,
        state: { roomCode },
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
          label={hasUserNameError ? "Error" : "Username"}
          helperText={
            hasUserNameError ? "Incorrect entry or username already exists" : ""
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
