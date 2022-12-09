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

const socketInitializer = async () => {
  await fetch("/api/socket");
  socket = io();

  socket.on("welcome", (msg: any) => {
    console.log(msg);
  });
};

export default function Home() {
  useEffect(() => {
    socketInitializer(), [];
  });

  const [columnDefs] = useState([
    { headerName: "First Name", field: "first_name" },
    { headerName: "Last Name", field: "last_name" },
    { headerName: "Job Title", field: "job_title" },
    { field: "office" },
    { field: "email" },
    { field: "phone" },
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
          <AgGridReact
            rowData={[]}
            columnDefs={columnDefs}
            // style={{ height: "100%", width: "100%" }}
          ></AgGridReact>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
