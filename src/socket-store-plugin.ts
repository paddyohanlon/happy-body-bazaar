import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { RootState } from "@/types/types";

export default function createWebSocketPlugin(socket: Socket) {
  return (store: Store<RootState>) => {
    // @ts-ignore
    store.$socket = socket;

    socket.on("user:update", payload => {
      console.log("dispatch updateUserReceived", payload);
      store.dispatch("updateUserReceived", payload);
    });
  };
}
