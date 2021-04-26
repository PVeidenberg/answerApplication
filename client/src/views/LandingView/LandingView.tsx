import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../../services/socket";
import Paths from "../../Paths";
import { useHistory } from "react-router-dom";
import { Box, Container, Grid, ThemeProvider } from "@material-ui/core";

// import "./landing-view.scss";

export default function App(props: any) {
  const history = useHistory();
  const [hasUserNameError, setHasUserNameError] = useState(false);
  const [hasroomCodeError, setHasRoomCodeError] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = e => {
    e.preventDefault();

    if (userName.trim().length < 3) {
      setHasUserNameError(() => true);
      setHasRoomCodeError(false);
    } else {
      setHasUserNameError(() => false);
      socket.emit("validateRoomCode", { roomCode }, (isValid: boolean) => {
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
    <Container maxWidth="sm">
      <Box my={4}>
        <form onSubmit={handleJoinRoom}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="userNameField"
                    fullWidth
                    error={hasUserNameError}
                    label={hasUserNameError ? "Error" : "Nickname"}
                    helperText={hasUserNameError ? "Nickname must be at least 4 characters" : ""}
                    onChange={handleUsernameChange}
                    variant="outlined"
                    value={userName}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="roomCodeField"
                    fullWidth
                    error={hasroomCodeError}
                    label={hasroomCodeError ? "Error" : "Room code"}
                    helperText={hasroomCodeError ? "Room does not exist" : ""}
                    onChange={handleRoomCodeChange}
                    variant="outlined"
                    value={roomCode}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Join room
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={() => handleCreateRoom()} fullWidth variant="outlined" color="primary">
                Create room
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
