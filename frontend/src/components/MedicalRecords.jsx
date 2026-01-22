import { useEffect, useState } from "react";

export default function MedicalRecords({ pet, onClose }) {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // crear
  const [visitDate, setVisitDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");

  // editar
  const [editingId, setEditingId] = useState(null);
  const [editVisitDate, setEditVisitDate] = useState("");
  const [editDiagnosis, setEditDiagnosis] = useState("");
  const [editTreatment, setEditTreatment] = useState("");

  const token = localStorage.getItem("token");

  // 🔹 Cargar historial clínico
  const loadRecords = async () => {
    if (!pet?.id) return;

    const res = await fetch(
      `http://localhost:3000/api/medical-records/pets/${pet.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRecords(await res.json());
  };

  useEffect(() => {
    loadRecords();
  }, [pet?.id]);

  // 🔹 Crear registro clínico
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!visitDate) {
      alert("La fecha de la consulta es obligatoria");
      return;
    }

    const res = await fetch(
      "http://localhost:3000/api/medical-records",
      {
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
      }
    );

    if (!res.ok) {
      alert("Error al guardar historial clínico");
      return;
    }

    setShowForm(false);
    setVisitDate("");
    setDiagnosis("");
    setTreatment("");

    loadRecords();
  };

  // ✏️ Iniciar edición
  const startEdit = (r) => {
    setEditingId(r.id);
    setEditVisitDate(r.visit_date.split("T")[0]);
    setEditDiagnosis(r.diagnosis || "");
    setEditTreatment(r.treatment || "");
  };

  // 💾 Guardar edición
  const saveEdit = async (id) => {
    const res = await fetch(
      `http://localhost:3000/api/medical-records/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          visit_date: editVisitDate,
          diagnosis: editDiagnosis,
          treatment: editTreatment,
        }),
      }
    );

    if (!res.ok) {
      alert("Error al actualizar historial");
      return;
    }

    setEditingId(null);
    loadRecords();
  };

  return (
    <div className="mt-4 bg-white p-4 rounded shadow">
      {/* Header */}
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

      {/* Formulario crear */}
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

      {/* Listado */}
      {records.length === 0 ? (
        <p className="text-gray-500">
          No hay historial clínico registrado
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="border p-3 rounded">
              {editingId === r.id ? (
                <>
                  <input
                    type="date"
                    className="border p-2 w-full mb-2"
                    value={editVisitDate}
                    onChange={(e) =>
                      setEditVisitDate(e.target.value)
                    }
                  />

                  <textarea
                    className="border p-2 w-full mb-2"
                    value={editDiagnosis}
                    onChange={(e) =>
                      setEditDiagnosis(e.target.value)
                    }
                  />

                  <textarea
                    className="border p-2 w-full mb-2"
                    value={editTreatment}
                    onChange={(e) =>
                      setEditTreatment(e.target.value)
                    }
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(r.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold">
                    Consulta:{" "}
                    {new Date(
                      r.visit_date
                    ).toLocaleDateString()}
                  </p>

                  {r.vet_name && (
                    <p className="text-sm text-gray-500">
                      Veterinario: {r.vet_name}
                    </p>
                  )}

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
                    {new Date(
                      r.created_at
                    ).toLocaleString()}
                  </p>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => startEdit(r)}
                      className="text-blue-600 text-sm"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            "¿Eliminar este registro?"
                          )
                        )
                          return;

                        await fetch(
                          `http://localhost:3000/api/medical-records/${r.id}`,
                          {
                            method: "DELETE",
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );

                        setRecords(
                          records.filter(
                            (item) =>
                              item.id !== r.id
                          )
                        );
                      }}
                      className="text-red-600 text-sm"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}