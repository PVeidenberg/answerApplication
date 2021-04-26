import React from "react";
import "./row.scss";
import { Answer, User } from "../../views/AdminView/AdminView";
import { Checkbox, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { socket } from "../../services/socket";

export interface RowProps {
  user?: User;
  answer?: Answer;
  roomCode: string;
}

export const Row: React.FC<RowProps> = ({ user, answer, roomCode }) => {
  const name = answer?.userName || user?.name;
  const value = answer?.answer;

  function handleAnswerToggle() {
    socket.emit("toggleAnswerCorrectnessServer", { userName: name, roomCode });
  }

  return (
    <ListItem>
      <ListItemText primary={name} secondary={value} />
      {value ? (
        <ListItemSecondaryAction>
          <Checkbox edge="end" color="primary" defaultChecked={answer?.isCorrect} onChange={handleAnswerToggle} />
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  );
};
