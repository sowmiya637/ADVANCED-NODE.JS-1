import cluster from "cluster";
import os from "os";
import http from "http";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import { fork } from "child_process";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // Each worker process runs this
  const app = http.createServer();
  const io = new Server(app, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected on worker ${process.pid}`);

    // simulate CPU-heavy task using worker thread
    socket.on("heavyTask", (data) => {
      const worker = new Worker("./workerTask.js", { workerData: data });
      worker.on("message", (result) => {
        socket.emit("heavyResult", result);
      });
    });

    // simulate Child Process task (e.g., calling external script)
    socket.on("childTask", (data) => {
      const child = fork("./childTask.js");
      child.send(data);
      child.on("message", (result) => {
        socket.emit("childResult", result);
      });
    });

    // Normal chat message
    socket.on("chat", (msg) => {
      io.emit("chat", { msg, worker: process.pid });
    });
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });
}
