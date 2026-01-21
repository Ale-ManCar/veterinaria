import { useEffect, useState } from "react";

import MedicalRecords from "../components/MedicalRecords";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");

  const [selectedPet, setSelectedPet] = useState(null);

  const token = localStorage.getItem("token");
  console.log("TOKEN:", token)

  // ===============================
  // CARGAR CLIENTES
  // ===============================
  useEffect(() => {
    fetch("http://localhost:3000/api/clients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  // ===============================
  // CARGAR MASCOTAS DEL CLIENTE
  // ===============================
  useEffect(() => {
  if (!selectedClient) return;

  fetch(`http://localhost:3000/api/pets/clients/${selectedClient.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("No autorizado");
      return res.json();
    })
    .then((data) => {
      setPets(Array.isArray(data) ? data : []);
    })
    .catch(() => {
      setPets([]);
    });
}, [selectedClient, token]);

  // ===============================
  // CREAR CLIENTE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      setShowForm(false);
      setName("");
      setEmail("");

      const updated = await fetch("http://localhost:3000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(await updated.json());
    }
  };

  // ===============================
  // CREAR MASCOTA (FIX DEFINITIVO)
  // ===============================
  const handlePetSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClient) return;

    const res = await fetch("http://localhost:3000/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: petName,
        species,
        client_id: selectedClient.id, // ✅ CLAVE CORRECTA
      }),
    });

    if (res.ok) {
      setShowPetForm(false);
      setPetName("");
      setSpecies("");

      const updated = await fetch(
        `http://localhost:3000/api/pets/clients/${selectedClient.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPets(await updated.json());
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

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
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
            <tr
              key={c.id}
              className="border-t cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedClient(c)}
            >
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedClient && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">
            Mascotas de {selectedClient.name}
          </h2>

          <button
            onClick={() => setShowPetForm(true)}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Agregar mascota
          </button>

          {showPetForm && (
            <form
              onSubmit={handlePetSubmit}
              className="bg-gray-50 p-4 rounded shadow mb-4"
            >
              <input
                className="border p-2 mr-2"
                placeholder="Nombre mascota"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />

              <input
                className="border p-2 mr-2"
                placeholder="Especie"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </form>
          )}

          {pets.length === 0 ? (
            <p className="text-gray-500">
              Este cliente no tiene mascotas registradas
            </p>
          ) : (
            <ul className="list-disc ml-6">
              {Array.isArray(pets) && pets.map((p) => (
                <li
                  key={p.id}
                  className="cursor-pointer text-blue-600"
                  onClick={() => setSelectedPet(p)}
                  >
                    {p.name} - {p.species} (ver historial)
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* HOSTORIAL MEDICO */}
      {selectedPet && (
        <MedicalRecords
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
}