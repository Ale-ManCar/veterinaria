import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    return(
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <main className="p-6">
                    <h1 className="text-2xl font-bold">
                        Panel principal
                    </h1>
                </main>
            </div>
        </div>
    );
}