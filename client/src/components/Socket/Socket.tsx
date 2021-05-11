import React, { useEffect } from "react";
import { socket } from "../../services/socket";
import { useSetRecoilState } from "recoil";
import { connectedState } from "../../atoms/connectedState";

export const Socket: React.FC = () => {
  const setConnected = useSetRecoilState(connectedState);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return null;
};
