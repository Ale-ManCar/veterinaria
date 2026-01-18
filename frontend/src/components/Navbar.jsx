export default function Navbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <span className="font-semibold">Dashboard</span>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        className="text-red-500"
      >
        Salir
      </button>
    </header>
  );
}