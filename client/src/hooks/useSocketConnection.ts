import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { connectedState } from "../atoms/connectedState";
import { socket } from "../services/socket";

export function useSocketConnection(connect: boolean): void {
  const setConnected = useSetRecoilState(connectedState);

  useEffect(() => {
    if (!connect) {
      return;
    }

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
  }, [connect, setConnected]);
}
