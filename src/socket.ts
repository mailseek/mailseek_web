import { Socket } from "phoenix";
import { BACKEND_URL } from "./config";

let socket: Socket | null = null

if (typeof window !== 'undefined') {
  socket = new Socket(`${BACKEND_URL}/socket`, { params: {} });
  socket.connect();
}

export default socket;
