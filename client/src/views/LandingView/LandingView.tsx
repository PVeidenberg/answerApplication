import { Box, Button, Container, Grid, IconButton, TextField } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { Paths } from "../../Paths";
import { Role, roomState } from "../../atoms/roomState";
import { Header } from "../../components/Header/Header";
import { useEmit } from "../../hooks/useEmit";

export const LandingView: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ error?: string } | undefined>();
  const setRoomState = useSetRecoilState(roomState);
  const [hasUserNameError, setHasUserNameError] = useState(false);
  const [hasroomCodeError, setHasRoomCodeError] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const emit = useEmit();

  const error = location.state?.error;

  const handleJoinRoom = e => {
    e.preventDefault();

    if (userName.trim().length < 3) {
      setHasUserNameError(() => true);
      setHasRoomCodeError(false);
    } else {
      setHasUserNameError(() => false);
      emit("validateRoomCode", { roomCode }, isValid => {
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
    emit("createRoom", (err, data) => {
      if (err) {
        history.replace({ state: { error: err.message } });

        return;
      }

      setRoomState({
        code: data.roomCode,
        role: Role.ADMIN,
        isConnected: false,
        users: [],
      });
      history.push({
        pathname: Paths.admin,
      });
    });
  };

  const handleUsernameChange = event => {
    setUserName(event.target.value);
  };

  const handleRoomCodeChange = event => {
    setRoomCode(event.target.value);
  };

  return (
    <div>
      <Header />
      <Container maxWidth="sm">
        <Box my={4}>
          <form onSubmit={handleJoinRoom}>
            <Grid container spacing={3}>
              <Grid item xs={12} hidden={!error}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Alert
                      severity="error"
                      variant="outlined"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            history.replace({});
                          }}
                        >
                          <Close fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {error}
                    </Alert>
                  </Grid>
                </Grid>
              </Grid>

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
    </div>
  );
};
