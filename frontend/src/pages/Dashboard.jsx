import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Clients from "./Clients";

export default function Dashboard() {
  const [page, setPage] = useState("clients");

  return (
    <div className="flex">
      <Sidebar setPage={setPage} />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {page === "clients" && <Clients />}
        </main>
      </div>
    </div>
  );
}