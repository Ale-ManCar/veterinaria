import { useEffect, useState } from "react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/clients", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      setShowForm(false);
      setName("");
      setEmail("");
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Nuevo cliente
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-4"
        >
          <input
            className="border p-2 mr-2"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="border p-2 mr-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </form>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}