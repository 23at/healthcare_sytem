import api from "@/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  // In real scenario, check user role here
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await api.post("/logout"); // clear Flask session
      router.push("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/">
        <h1 className="font-bold">Healthcare App</h1>
      </Link>

      <div className="space-x-4">
        <Link href="/patients">Patients</Link>
        <Link href="/visits">Visits</Link>
        {/* {userRole === "Admin" && ( */}
        <Link href="/prescriptions">Prescriptions</Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
