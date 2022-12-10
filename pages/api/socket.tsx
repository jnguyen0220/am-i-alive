import { Server } from "socket.io";
import Bree from "bree";
import { Low, JSONFile } from "lowdb";
import serverPath from "../../util";

let io: any;
let bree: any;
let lowdb: any;

const workerMessageHandler = ({ name, message }: any) => {
  const payload = { ...message, name };
  io.local.emit(
    "update",
    `${new Date().toISOString()}:${JSON.stringify(payload)}`
  );
};

const init_io = (res: any) => {
  io = new Server(res.socket.server);
  io.on("connect", async (socket: any) => {
    socket.emit("welcome", lowdb.data.schedule);
  });
  console.log("Socket.IO Ready");
};

const init_bree = async () => {
  await lowdb.read();
  const { schedule } = lowdb.data;
  const jobs = schedule.map((x: any) => ({
    name: x.name,
    interval: x.interval,
    path: x.path,
    worker: { workerData: { url: x.address, port: x.port } },
  }));
  bree = new Bree({ jobs: ["init"].concat(jobs), workerMessageHandler });
  await bree.start();
};

const init_lowdb = () => {
  const file = serverPath("database/db.json");
  const adapter = new JSONFile(file);
  lowdb = new Low(adapter);
};

export default async function SocketHandler(req: any, res: any) {
  !lowdb && init_lowdb();
  !bree && init_bree();
  !io && init_io(res);
  res.end();
}
