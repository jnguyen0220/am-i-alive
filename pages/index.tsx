import Head from "next/head";
import styles from "../styles/Home.module.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

let socket: any;

const sendMessage = async () => {
  socket.emit("createdMessage", { author: "Jonny Nguyen", message: "testing" });
};

const socketInitializer = async (setRowData: any) => {
  await fetch("/api/socket");
  socket = io();

  // socket.on("welcome", (msg: any) => {});
  socket.on("update", (msg: any) => {
    console.log(msg);
  });

  socket.on("welcome", (msg: any) => {
    setRowData(msg);
  });
};

export default function Home() {
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    socketInitializer(setRowData);
  }, [setRowData]);

  const [columnDefs] = useState([
    { headerName: "Address", field: "address" },
    { headerName: "Name", field: "name" },
    { headerName: "Interval", field: "interval" },
  ]);

  return (
    <div className={styles.container}>
      <Head>
        <title>AM I ALIVE</title>
        <meta name="description" content="Real time Heart Beat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div
          className="ag-theme-alpine"
          style={{ height: "600px", width: "100%" }}
        >
          <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
