import { Box, Button, Container, Grid, IconButton, TextField } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { Paths } from "../../Paths";
import { Role, roomState } from "../../atoms/roomState";
import { userState } from "../../atoms/userState";
import { Header } from "../../components/Header/Header";
import { useEmit } from "../../hooks/useEmit";

export const LandingView: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ error?: string } | undefined>();
  const setRoomState = useSetRecoilState(roomState);
  const [user, setUser] = useRecoilState(userState);
  const [errors, setErrors] = useState<{ name: string | null; roomCode: string | null }>({
    name: null,
    roomCode: null,
  });
  const [userName, setUserName] = useState(user?.name || "");
  const [roomCode, setRoomCode] = useState("");
  const emit = useEmit();

  const error = location.state?.error;

  const handleJoinRoom = e => {
    e.preventDefault();

    const nameError = userName.trim().length < 4 ? "Nickname must be at least 4 characters" : null;
    const roomCodeError = roomCode.trim().length < 4 ? "Room code must be at least 4 characters" : null;

    if (nameError || roomCodeError) {
      setErrors({
        name: nameError,
        roomCode: roomCodeError,
      });

      return;
    }

    setErrors({
      name: null,
      roomCode: null,
    });

    emit("canJoinRoom", { roomCode, name: userName }, errors => {
      if (errors) {
        setErrors(errors);
      } else {
        setUser({
          name: userName,
        });
        setRoomState({
          code: roomCode,
          role: Role.PLAYER,
          isConnected: false,
          users: [],
        });
        history.push(Paths.question);
      }
    });
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
                      error={!!errors.name}
                      label={"Nickname"}
                      helperText={errors.name}
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
                      error={!!errors.roomCode}
                      label={"Room code"}
                      helperText={errors.roomCode}
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
