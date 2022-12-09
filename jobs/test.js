const { parentPort, workerData } = require("worker_threads");
const got = require("got");

const { worker } = workerData.job;
const {
  workerData: { url },
} = worker;

const result = { url, ok: false };

got(url, { timeout: { request: 1000 } })
  .then((res) => {
    result.ok = res.statusCode === 200;
  }).catch(err => {}).finally(() => {
    parentPort?.postMessage(result);
  });
