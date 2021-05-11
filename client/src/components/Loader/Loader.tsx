import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const Loader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} m="auto">
      <CircularProgress />
    </Box>
  );
};
