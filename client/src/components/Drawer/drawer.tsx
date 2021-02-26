import React from "react";
import clsx from "clsx";
import { makeStyles, styled } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  list: {
    width: 150,
  },
  fullList: {
    width: "auto",
  },
});

const MyButton = styled(Button)({
  marginTop: "15px",
  width: "225px",
});

export default function TemporaryDrawer(props: any) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor: any, open: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: any) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Question1", "Question2", "Question3", "Question4"].map(
          (text, index) => (
            <div key={index}>
              {text}
              <Divider />
            </div>
          )
        )}
      </List>
    </div>
  );

  return (
    <div>
      <React.Fragment key={"left"}>
        {/* <MyButton variant="contained" color="primary" onClick={toggleDrawer('left', true)}>Previous questions</MyButton> */}
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
