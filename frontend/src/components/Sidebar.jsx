export default function Sidebar() {
  return (
    <aside className="w-64 bg-green-600 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Veterinaria</h2>
      <nav className="space-y-2">
        <p className="hover:bg-green-700 p-2 rounded cursor-pointer">
          Clientes
        </p>
        <p className="hover:bg-green-700 p-2 rounded cursor-pointer">
          Mascotas
        </p>
        <p className="hover:bg-green-700 p-2 rounded cursor-pointer">
          Citas
        </p>
      </nav>
    </aside>
  );
}