import { useEffect, useState } from "react";

export default function MedicalRecords({ pet, onClose }) {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [visitDate, setVisitDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Cargar historial clínico
  useEffect(() => {
    if (!pet?.id) return;

    fetch(`http://localhost:3000/api/medical-records/pets/${pet.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error(err));
  }, [pet.id, token]);

  // 🔹 Crear registro clínico
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/medical-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pet_id: pet.id,
        visit_date: visitDate,
        diagnosis,
        treatment,
      }),
    });

    if (!res.ok) {
      console.error("Error al guardar historial");
      return;
    }

    // limpiar formulario
    setShowForm(false);
    setVisitDate("");
    setDiagnosis("");
    setTreatment("");

    // recargar historial
    const updated = await fetch(
      `http://localhost:3000/api/medical-records/pets/${pet.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRecords(await updated.json());
  };

  return (
    <div className="mt-4 bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">
          Historial clínico — {pet.name}
        </h3>
        <button onClick={onClose} className="text-red-600 font-bold">
          ✕
        </button>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-600 text-white px-3 py-1 rounded"
      >
        + Nueva consulta
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-3 rounded mb-4"
        >
          <input
            type="date"
            className="border p-2 w-full mb-2"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Diagnóstico"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Tratamiento"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </form>
      )}

      {records.length === 0 ? (
        <p className="text-gray-500">
          No hay historial clínico registrado
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              <p className="font-semibold">
                Consulta:{" "}
                {new Date(r.visit_date).toLocaleDateString()}
              </p>

              {r.diagnosis && (
                <p>
                  <b>Dx:</b> {r.diagnosis}
                </p>
              )}

              {r.treatment && (
                <p>
                  <b>Tx:</b> {r.treatment}
                </p>
              )}

              <p className="text-sm text-gray-400">
                Registrado:{" "}
                {new Date(r.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}