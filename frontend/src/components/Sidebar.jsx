import { useState } from "react";
import Clients from "../pages/Clients";

export default function Sidebar({ setPage }) {
  return (
    <aside className="w-64 bg-green-600 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Veterinaria</h2>
      <nav className="space-y-2">
        <p onClick={() => setPage("clients")} className="hover:bg-green-700 p-2 rounded cursor-pointer">
          Clientes
        </p>
      </nav>
    </aside>
  );
}