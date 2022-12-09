import { Server } from "socket.io";
import Bree from "bree";

let io: any;
let bree: any;

const workerMessageHandler = ({name, message}: any) => {
  const payload = {...message, name}
  io.local.emit("welcome", `${new Date().toISOString()}:${JSON.stringify(payload)}`);
};

const init_io = (res: any) => {
  io = new Server(res.socket.server);

  io.on("connect", async (socket: any) => {
    socket.emit("welcome", "welcome to server");
  });
  console.log("Socket.IO Ready");
};

const init_bree = async () => {
  bree = new Bree({ jobs: ["foo"], workerMessageHandler });
  await bree.add({
    name: "google",
    interval: "every 10 seconds",
    path: '/workspaces/am-i-alive/jobs/test.js',
    worker: {
      workerData: {
        url: "https://google.com",
      },
    },
  });
  await bree.add({
    name: "amazon",
    interval: "every 15 seconds",
    path: '/workspaces/am-i-alive/jobs/test.js',
    worker: {
      workerData: {
        url: "https://www.amazon.com/",
      },
    },
  });
  await bree.add({
    name: "blue1",
    interval: "every 20 seconds",
    path: '/workspaces/am-i-alive/jobs/test.js',
    worker: {
      workerData: {
        url: "https://blue1.com/",
      },
    },
  });
  await bree.start();
};

export default async function SocketHandler(req: any, res: any) {
  !io && init_io(res);
  !bree && init_bree();
  res.end();
}
