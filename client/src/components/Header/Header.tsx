import { AppBar, createStyles, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { WifiTethering, PortableWifiOff } from "@material-ui/icons";
import React from "react";
import { useRecoilValue } from "recoil";

import { connectedState } from "../../atoms/connectedState";

const useStyles = makeStyles(theme =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
);

export const Header: React.FC = ({ children }) => {
  const classes = useStyles();
  const isConnected = useRecoilValue(connectedState);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {children || "Easy answers"}
        </Typography>
        {isConnected ? <WifiTethering /> : <PortableWifiOff />}
      </Toolbar>
    </AppBar>
  );
};
